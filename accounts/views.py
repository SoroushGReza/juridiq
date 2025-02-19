from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login
from .permissions import TwoFactorEnabledPermission
import qrcode
import io
import base64
from rest_framework.permissions import IsAuthenticated
import pyotp
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
                    # Create response data with 2FA flag if needed
                    response_data = {
                        "message": "Konto redan verifierat. Du är nu inloggad.",
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    }
                    if not user.two_factor_enabled:  # If 2FA is not enabled, add flag
                        response_data["setup_2fa_required"] = True
                    return Response(response_data, status=status.HTTP_200_OK)
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
                        response_data = {
                            "message": "Konto redan verifierat. Du är nu inloggad.",
                            "refresh": str(refresh),
                            "access": str(refresh.access_token),
                        }
                        if not user.two_factor_enabled:
                            response_data["setup_2fa_required"] = True
                        return Response(response_data, status=status.HTTP_200_OK)
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
                    login(request, request.user)
                    response_data = {
                        "message": "Konto redan verifierat. Du är nu inloggad.",
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    }
                    if not request.user.two_factor_enabled:
                        response_data["setup_2fa_required"] = True
                    return Response(response_data, status=status.HTTP_200_OK)
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
        # Build response data and include the 2FA flag if needed
        response_data = {
            "message": "E‑post verifierad. Du är nu inloggad.",
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
        if not user.two_factor_enabled:  # Add flag if 2FA is not activated
            response_data["setup_2fa_required"] = True
        return Response(response_data, status=status.HTTP_200_OK)


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
            # Om 2FA är aktiverat, krävs TOTP‑kod
            if user.two_factor_enabled:
                totp_code = request.data.get("totp_code")
                if not totp_code:
                    return Response({"detail": "TOTP-kod krävs."}, status=400)
                totp = pyotp.TOTP(user.totp_secret)
                if not totp.verify(totp_code):
                    return Response({"detail": "Felaktig TOTP-kod."}, status=401)
            login(request, user)  # Log in user
            refresh = RefreshToken.for_user(user)
            response_data = {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
            # If 2FA is not enabled, inform the frontend that 2FA setup is required
            if not user.two_factor_enabled:
                response_data["setup_2fa_required"] = True
            return Response(response_data, status=200)
        return Response(
            {"message": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED,  # noqa
        )


class UserStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


# 2FA‑related views
class TOTPSetupView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        if user.two_factor_enabled:
            return Response(
                {"detail": "Tvåstegsverifiering är redan aktiverad."}, status=400
            )
        if user.totp_secret:
            return Response(
                {
                    "detail": "2FA-setup har redan initierats. Om du tappat bort koden, återställ 2FA."
                },
                status=400,
            )
        # Generate a random base32 secret
        totp_secret = pyotp.random_base32()
        user.totp_secret = totp_secret
        user.save()
        totp = pyotp.TOTP(totp_secret)
        provisioning_uri = totp.provisioning_uri(name=user.email, issuer_name="Juridiq")
        # Generate a QR code from the provisioning URI
        qr = qrcode.QRCode(border=1)
        qr.add_data(provisioning_uri)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        qr_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
        data = {
            "totp_secret": totp_secret,  # Show this only once
            "provisioning_uri": provisioning_uri,
            "qr_code": f"data:image/png;base64,{qr_base64}",
        }
        return Response(data, status=200)


class TOTPActivateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        if user.two_factor_enabled:
            return Response(
                {"detail": "Tvåstegsverifiering är redan aktiverad."}, status=400
            )
        if not user.totp_secret:
            return Response({"detail": "2FA-setup inte initierat."}, status=400)
        totp_code = request.data.get("totp_code")
        if not totp_code:
            return Response({"detail": "TOTP-kod krävs."}, status=400)
        totp = pyotp.TOTP(user.totp_secret)
        if totp.verify(totp_code):
            user.two_factor_enabled = True
            user.save()
            return Response(
                {"detail": "Tvåstegsverifiering aktiverad framgångsrikt."}, status=200
            )
        else:
            return Response({"detail": "Felaktig TOTP-kod."}, status=400)


# Reset 2FA settings as logged in
class TOTPResetView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        password = request.data.get("password")
        if not password or not user.check_password(password):
            return Response({"detail": "Felaktigt lösenord."}, status=400)
        # Reset 2FA settings
        user.totp_secret = None
        user.two_factor_enabled = False
        user.save()
        return Response(
            {"detail": "Tvåstegsverifiering har återställts. Vänligen sätta upp igen."},
            status=200,
        )


class ForceReset2FAView(APIView):
    """
    This view allows a user who cannot provide a valid TOTP code (e.g. lost authenticator)
    to force-reset their 2FA settings by providing their email and password.
    """

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")
        if not email or not password:
            return Response({"detail": "Email and password are required."}, status=400)
        user = authenticate(email=email, password=password)
        if user is None:
            return Response({"detail": "Invalid credentials."}, status=401)
        # Reset the 2FA settings
        user.totp_secret = None
        user.two_factor_enabled = False
        user.save()
        return Response(
            {"detail": "2FA has been reset. Please log in and set up 2FA again."},
            status=200,
        )


class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [IsAuthenticated, TwoFactorEnabledPermission]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated, TwoFactorEnabledPermission]

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
    permission_classes = [IsAuthenticated, TwoFactorEnabledPermission]

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
