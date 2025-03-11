import stripe
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.conf import settings
from .models import CustomUser
import logging

logger = logging.getLogger(__name__)

stripe.api_key = settings.STRIPE_SECRET_KEY


class CreateExpressAccountView(APIView):
    """
    Create a Stripe Express account for delegated admin and return onboarding link.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        # Check if user is delegated admin
        if not user.is_delegated_admin:
            return Response(
                {"detail": "Du är inte delegerad admin."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # If account already exists, return error
        if user.stripe_account_id:
            return Response(
                {"detail": "Du har redan ett Stripe Express-konto kopplat."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Create an Express account
            account = stripe.Account.create(
                type="express",
                email=user.email,
            )
            user.stripe_account_id = account.id
            user.save()

            # Create a link for onboarding
            account_link = stripe.AccountLink.create(
                account=account.id,
                refresh_url="https://juridiq.nu/connect/refresh",
                return_url="https://juridiq.nu/connect/complete",
                type="account_onboarding",
            )

            return Response(
                {"onboarding_url": account_link.url}, status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.exception("Kunde inte skapa Express-konto")
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
