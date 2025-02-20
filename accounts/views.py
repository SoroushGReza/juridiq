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

    def list(self, request, *args, **kwargs):
        logger.info("UserListView accessed by user: %s", request.user)
        return super().list(request, *args, **kwargs)


class UserRegistrationView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        logger.info("New user registered: %s", user.email)
        # Create an EmailAddress record if it doesn't already exist
        email_address, created = EmailAddress.objects.get_or_create(
            user=user, email=user.email
        )
        if created:
            email_address.primary = True
            email_address.verified = False
            email_address.save()
            logger.debug("Created new EmailAddress for user: %s", user.email)
        else:
            logger.debug("EmailAddress already exists for user: %s", user.email)
        # Send verification email to the specified email address
        send_email_confirmation(self.request, user)
        logger.info("Sent email confirmation to: %s", user.email)

    def post(self, request, *args, **kwargs):
        logger.debug("UserRegistrationView POST called with data: %s", request.data)
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
        logger.info("VerifyEmailView called with key: %s", key)
        # Try HMAC first
        confirmation = EmailConfirmationHMAC.from_key(key)
        if confirmation:
            logger.debug("Found EmailConfirmationHMAC for key: %s", key)
            # Check if the email address is already verified
            if confirmation.email_address.verified:
                user = confirmation.email_address.user
                logger.info("Email already verified for user: %s", user.email)
                # If the user is already active, return 200
                if user.is_active:
                    refresh = RefreshToken.for_user(user)
                    login(request, user)
                    response_data = {
                        "message": "Konto redan verifierat. Du är nu inloggad.",
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    }
                    if not user.two_factor_enabled:
                        response_data["setup_2fa_required"] = True
                    logger.info("User %s logged in (already active)", user.email)
                    return Response(response_data, status=status.HTTP_200_OK)
                else:
                    user.is_active = True
                    user.save()
                    logger.info("User %s activated via HMAC confirmation", user.email)
            else:
                logger.info("Email not verified via HMAC; confirming now")
                confirmation.confirm(request)
                user = confirmation.email_address.user
                user.is_active = True
                user.save()
                logger.info("User %s verified for the first time", user.email)
        else:
            logger.warning("EmailConfirmationHMAC not found; trying DB lookup")
            try:
                confirmation = EmailConfirmation.objects.get(key=key)
                if confirmation.email_address.verified:
                    user = confirmation.email_address.user
                    if user.is_active:
                        refresh = RefreshToken.for_user(user)
                        login(request, user)
                        response_data = {
                            "message": "Konto redan verifierat. Du är nu inloggad.",
                            "refresh": str(refresh),
                            "access": str(refresh.access_token),
                        }
                        if not user.two_factor_enabled:
                            response_data["setup_2fa_required"] = True
                        logger.info("User %s logged in via DB lookup", user.email)
                        return Response(response_data, status=status.HTTP_200_OK)
                    else:
                        user.is_active = True
                        user.save()
                        logger.info("User %s activated via DB lookup", user.email)
                else:
                    confirmation.confirm(request)
                    user = confirmation.email_address.user
                    user.is_active = True
                    user.save()
                    logger.info("User %s verified for the first time (DB)", user.email)
            except EmailConfirmation.DoesNotExist:
                logger.error("Invalid verification key provided: %s", key)
                if request.user.is_authenticated and request.user.is_active:
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
        if not user.is_active:
            user.is_active = True
            user.save()
            logger.debug("User %s activated (post-check)", user.email)
        refresh = RefreshToken.for_user(user)
        login(request, user)
        response_data = {
            "message": "E‑post verifierad. Du är nu inloggad.",
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
        if not user.two_factor_enabled:
            response_data["setup_2fa_required"] = True
        logger.info("User %s successfully verified and logged in", user.email)
        return Response(response_data, status=status.HTTP_200_OK)


class UserLoginView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        logger.info("UserLoginView POST called")
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = authenticate(
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
        )
        if user is not None:
            logger.info("User %s authenticated", user.email)
            if user.two_factor_enabled:
                totp_code = request.data.get("totp_code")
                if not totp_code:
                    logger.warning("TOTP code missing for user: %s", user.email)
                    return Response({"detail": "TOTP-kod krävs."}, status=400)
                totp = pyotp.TOTP(user.totp_secret)
                if not totp.verify(totp_code):
                    logger.warning("Invalid TOTP code for user: %s", user.email)
                    return Response({"detail": "Felaktig TOTP-kod."}, status=401)
            login(request, user)
            refresh = RefreshToken.for_user(user)
            response_data = {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
            if not user.two_factor_enabled:
                response_data["setup_2fa_required"] = True
            logger.info("User %s logged in successfully", user.email)
            return Response(response_data, status=200)
        logger.error("Failed login attempt for email: %s", request.data.get("email"))
        return Response(
            {"message": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED,
        )


# 2FA‑related views
class TOTPSetupView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        logger.info("TOTPSetupView called for user: %s", user.email)
        if user.two_factor_enabled:
            logger.warning("User %s already has 2FA enabled", user.email)
            return Response(
                {"detail": "Tvåstegsverifiering är redan aktiverad."}, status=400
            )
        if user.totp_secret:
            logger.warning("User %s already initiated 2FA setup", user.email)
            return Response(
                {
                    "detail": "2FA-setup har redan initierats. Om du tappat bort koden, återställ 2FA."
                },
                status=400,
            )
        totp_secret = pyotp.random_base32()
        user.totp_secret = totp_secret
        user.save()
        totp = pyotp.TOTP(totp_secret)
        provisioning_uri = totp.provisioning_uri(name=user.email, issuer_name="Juridiq")
        qr = qrcode.QRCode(border=1)
        qr.add_data(provisioning_uri)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        qr_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
        logger.info("2FA setup initiated for user: %s", user.email)
        data = {
            "totp_secret": totp_secret,
            "provisioning_uri": provisioning_uri,
            "qr_code": f"data:image/png;base64,{qr_base64}",
        }
        return Response(data, status=200)


class TOTPActivateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        logger.info("TOTPActivateView called for user: %s", user.email)
        if user.two_factor_enabled:
            logger.warning("User %s already has 2FA enabled", user.email)
            return Response(
                {"detail": "Tvåstegsverifiering är redan aktiverad."}, status=400
            )
        if not user.totp_secret:
            logger.error("2FA-setup not initiated for user: %s", user.email)
            return Response({"detail": "2FA-setup inte initierat."}, status=400)
        totp_code = request.data.get("totp_code")
        if not totp_code:
            logger.error("TOTP code missing in activation for user: %s", user.email)
            return Response({"detail": "TOTP-kod krävs."}, status=400)
        totp = pyotp.TOTP(user.totp_secret)
        if totp.verify(totp_code):
            user.two_factor_enabled = True
            user.save()
            logger.info("2FA successfully activated for user: %s", user.email)
            return Response(
                {"detail": "Tvåstegsverifiering aktiverad framgångsrikt."}, status=200
            )
        else:
            logger.warning("Invalid TOTP code provided for user: %s", user.email)
            return Response({"detail": "Felaktig TOTP-kod."}, status=400)


class TOTPResetView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        logger.info("TOTPResetView called for user: %s", user.email)
        password = request.data.get("password")
        if not password or not user.check_password(password):
            logger.warning("Incorrect password for 2FA reset for user: %s", user.email)
            return Response({"detail": "Felaktigt lösenord."}, status=400)
        user.totp_secret = None
        user.two_factor_enabled = False
        user.save()
        logger.info("2FA settings reset for user: %s", user.email)
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
        logger.info("ForceReset2FAView called")
        email = request.data.get("email")
        password = request.data.get("password")
        if not email or not password:
            logger.error("ForceReset2FAView: Missing email or password")
            return Response({"detail": "Email and password are required."}, status=400)
        user = authenticate(email=email, password=password)
        if user is None:
            logger.error("ForceReset2FAView: Invalid credentials for email: %s", email)
            return Response({"detail": "Invalid credentials."}, status=401)
        user.totp_secret = None
        user.two_factor_enabled = False
        user.save()
        logger.info("2FA force-reset completed for user: %s", user.email)
        return Response(
            {"detail": "2FA has been reset. Please log in and set up 2FA again."},
            status=200,
        )


class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = [IsAuthenticated, TwoFactorEnabledPermission]
    serializer_class = UserProfileSerializer

    def get_object(self):
        logger.info("UserProfileView accessed by user: %s", self.request.user.email)
        return self.request.user


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated, TwoFactorEnabledPermission]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        logger.info("ChangePasswordView called for user: %s", request.user.email)
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if not self.object.check_password(serializer.data.get("old_password")):
            logger.warning("User %s provided wrong old password", request.user.email)
            return Response(
                {"old_password": "Wrong password."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        self.object.set_password(serializer.data.get("new_password"))
        self.object.save()
        logger.info("Password updated successfully for user: %s", request.user.email)
        return Response({"message": "Password updated successfully"})


class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated, TwoFactorEnabledPermission]

    def delete(self, request, *args, **kwargs):
        logger.info("DeleteAccountView called for user: %s", request.user.email)
        user = request.user
        serializer = DeleteAccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if not user.check_password(serializer.validated_data["password"]):
            logger.warning(
                "Incorrect password for account deletion by user: %s", user.email
            )
            return Response(
                {"password": "Incorrect password"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.delete()
        logger.info("User account deleted: %s", user.email)
        return Response(
            {"message": "Account deleted successfully"},
            status=status.HTTP_204_NO_CONTENT,
        )
