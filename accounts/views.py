from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from allauth.account.models import (
    EmailAddress,
    EmailConfirmation,
    EmailConfirmationHMAC,
)
from allauth.account.utils import perform_login
from allauth.account.utils import send_email_confirmation
import logging
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authtoken.models import Token
from .models import CustomUser
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
    DeleteAccountSerializer,
    UserSerializer,
)

logger = logging.getLogger(__name__)

CustomUser = get_user_model()


class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]


class UserRegistrationView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        # Create an EmailAddress record if it doesn't already exist
        email_address, created = EmailAddress.objects.get_or_create(
            user=user, email=user.email
        )
        if created:
            email_address.primary = True
            email_address.verified = False
            email_address.save()
        # Send verification email to the specified email address
        send_email_confirmation(self.request, user)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"detail": "Kolla din e‑post för att verifiera ditt konto."},
            status=status.HTTP_201_CREATED,
        )


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, key, format=None):
        # Try HMAC first
        confirmation = EmailConfirmationHMAC.from_key(key)
        if confirmation:
            # Check if the email address is already verified
            if confirmation.email_address.verified:
                user = confirmation.email_address.user
                # If the user is already active, return 200
                if user.is_active:
                    refresh = RefreshToken.for_user(user)
                    login(request, user)
                    return Response(
                        {
                            "message": "Konto redan verifierat. Du är nu inloggad.",
                            "refresh": str(refresh),
                            "access": str(refresh.access_token),
                        },
                        status=status.HTTP_200_OK,
                    )
                else:
                    # Verified
                    user.is_active = True
                    user.save()
            else:
                # Verify email for the first time
                confirmation.confirm(request)
                user = confirmation.email_address.user
                user.is_active = True
                user.save()
        else:
            # If the key is not found in HMAC, try to find it in the database
            try:
                confirmation = EmailConfirmation.objects.get(key=key)
                if confirmation.email_address.verified:
                    user = confirmation.email_address.user
                    if user.is_active:
                        # already verified and active
                        refresh = RefreshToken.for_user(user)
                        login(request, user)
                        return Response(
                            {
                                "message": "Konto redan verifierat. Du är nu inloggad.",
                                "refresh": str(refresh),
                                "access": str(refresh.access_token),
                            },
                            status=status.HTTP_200_OK,
                        )
                    else:
                        # Verified in DB, but is_active=False
                        user.is_active = True
                        user.save()
                else:
                    # Verify for the first time
                    confirmation.confirm(request)
                    user = confirmation.email_address.user
                    user.is_active = True
                    user.save()
            except EmailConfirmation.DoesNotExist:
                # Check if the user is already authenticated
                if request.user.is_authenticated and request.user.is_active:
                    # Probably a double call – return 200
                    refresh = RefreshToken.for_user(request.user)
                    return Response(
                        {
                            "message": "Konto redan verifierat. Du är nu inloggad.",
                            "refresh": str(refresh),
                            "access": str(refresh.access_token),
                        },
                        status=status.HTTP_200_OK,
                    )
                return Response(
                    {"detail": "Ogiltig verifieringsnyckel."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        # First time email is confirmed (or we just set is_active=True)
        if not user.is_active:
            user.is_active = True
            user.save()
        refresh = RefreshToken.for_user(user)
        login(request, user)
        return Response(
            {
                "message": "E‑post verifierad. Du är nu inloggad.",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_200_OK,
        )


class UserLoginView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
        )
        if user is not None:
            login(request, user)  # Log in user
            # Generate JWT-token
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {"message": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED,  # noqa
        )


class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not self.object.check_password(serializer.data.get("old_password")):
            return Response(
                {"old_password": "Wrong password."},
                status=status.HTTP_400_BAD_REQUEST,  # noqa
            )

        self.object.set_password(serializer.data.get("new_password"))
        self.object.save()

        return Response({"message": "Password updated successfully"})


class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = request.user
        serializer = DeleteAccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not user.check_password(serializer.validated_data["password"]):
            return Response(
                {"password": "Incorrect password"},
                status=status.HTTP_400_BAD_REQUEST,  # noqa
            )

        user.delete()
        return Response(
            {"message": "Account deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )
