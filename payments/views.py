import logging
from rest_framework import viewsets, permissions, status
from payments.models import Payment
from django.core.exceptions import PermissionDenied
from payments.serializers import PaymentSerializer
from rest_framework.response import Response
from matters.models import Matter
from accounts.models import CustomUser
import os
import stripe
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseBadRequest
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings


logger = logging.getLogger(__name__)

# Stripe API credentials
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")


# Stripe Webhook to processes incoming webhook events
@csrf_exempt
def stripe_webhook(request):
    logger.info("stripe_webhook called")
    payload = request.body
    sig_header = request.headers.get("Stripe-Signature")
    try:
        # Verify incoming event with webhook signature
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
        logger.debug("Stripe event constructed: %s", event["type"])
    except ValueError:
        logger.error("Invalid payload in stripe_webhook")
        return HttpResponseBadRequest("Ogiltig payload")
    except stripe.error.SignatureVerificationError:
        logger.error("Invalid signature in stripe_webhook")
        return HttpResponseBadRequest("Ogiltig signatur")

    # Handle different event types from Stripe
    if event["type"] in [
        "checkout.session.completed",
        "checkout.session.async_payment_succeeded",
    ]:
        session = event["data"]["object"]
        logger.info("Handling Stripe event: %s", event["type"])
        handle_checkout_session_completed(session)
    elif event["type"] == "checkout.session.async_payment_failed":
        session = event["data"]["object"]
        logger.info("Handling Stripe event: %s", event["type"])
        handle_checkout_session_failed(session)
    elif event["type"] == "checkout.session.expired":
        logger.info(
            "Stripe event 'checkout.session.expired' received: Sessionen gick ut!"
        )
        print("Sessionen gick ut!")

    logger.info("stripe_webhook processed successfully")
    return JsonResponse({"status": "success"})


def handle_checkout_session_failed(session):
    logger.info("handle_checkout_session_failed called")
    payment_id = session["metadata"].get("payment_id")
    try:
        payment = Payment.objects.get(id=payment_id)
        logger.debug("Found Payment with id: %s", payment_id)
    except Payment.DoesNotExist:
        logger.error("Ingen Payment med id=%s hittades vid fail-eventet.", payment_id)
        print(f"Ingen Payment med id={payment_id} hittades vid fail-eventet.")
        return

    payment.status = "failed"
    payment.save()
    logger.info("Payment uppdaterad till 'failed': %s", payment)
    print(f"Payment uppdaterad till 'failed': {payment}")


# Handles checkout session completion & updates or creates payment
# The Stripe Checkout session is created here with HTTPS endpoints for both success_url and cancel_url.
# This ensures that all communication occurs over a secure channel, which is a fundamental requirement for PSD2 and Strong Customer Authentication (SCA).
# Stripe handles the necessary SCA process, where the user may need to confirm the payment via their banking app or via SMS before the transaction is approved.


# Only staff or delegated admins can create payments
class PaymentCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, matter_id, *args, **kwargs):
        logger.info(
            "PaymentCreateView POST called by user: %s for matter_id: %s",
            request.user,
            matter_id,
        )

        confirm_password = request.data.get("confirm_password")
        if not confirm_password or not request.user.check_password(confirm_password):
            logger.warning("Extra autentisering misslyckades ...")
            return Response(
                {
                    "error": "Extra autentisering misslyckades. Kontrollera ditt lösenord."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        amount = request.data.get("amount")
        if not amount:
            logger.error("Amount not provided in PaymentCreateView POST")
            return Response(
                {"error": "Belopp är obligatoriskt."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            matter = Matter.objects.get(id=matter_id)
        except Matter.DoesNotExist:
            logger.error("Matter with id %s does not exist", matter_id)
            return Response(
                {"error": "Ärendet existerar inte."}, status=status.HTTP_404_NOT_FOUND
            )

        existing_payment = Payment.objects.filter(
            matter=matter, status="pending"
        ).first()
        if existing_payment:
            logger.warning("Active payment already exists for matter %s", matter_id)
            return Response(
                {
                    "error": "Det finns redan en aktiv betalningsbegäran för detta ärende."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if request.user.is_staff:
            # Admin = 100% to their own account
            payment = Payment.objects.create(
                user=matter.user, matter=matter, amount=amount, status="pending"
            )
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[
                    {
                        "price_data": {
                            "currency": "sek",
                            "product_data": {"name": f"Matter: {matter.title}"},
                            "unit_amount": int(float(amount) * 100),
                        },
                        "quantity": 1,
                    }
                ],
                mode="payment",
                success_url="https://juridiq.nu/success",
                cancel_url="https://juridiq.nu/cancel",
                client_reference_id=str(matter.user.id),
                metadata={
                    "matter_id": str(matter.id),
                    "payment_id": str(payment.id),
                },
            )
            payment.stripe_payment_id = session["payment_intent"]
            payment.save()

            serializer = PaymentSerializer(payment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        elif request.user.is_delegated_admin:
            # Delegated admin = 90% to their own account, 10% to JuridiQ
            if not request.user.stripe_account_id:
                return Response(
                    {"error": "Du har inget Stripe Express-konto kopplat."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Check if user is delegated admin for the matter
            if request.user not in matter.delegated_admins.all():
                return Response(
                    {"error": "Du är inte delegerad admin för detta ärende."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            payment = Payment.objects.create(
                user=matter.user, matter=matter, amount=amount, status="pending"
            )

            application_fee_amount = int(
                float(amount) * 100 * 0.10
            )  # 10% in cents (ören in SEK)

            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[
                    {
                        "price_data": {
                            "currency": "sek",
                            "product_data": {"name": f"Matter: {matter.title}"},
                            "unit_amount": int(float(amount) * 100),
                        },
                        "quantity": 1,
                    }
                ],
                mode="payment",
                success_url="https://juridiq.nu/success",
                cancel_url="https://juridiq.nu/cancel",
                client_reference_id=str(matter.user.id),
                metadata={
                    "matter_id": str(matter.id),
                    "payment_id": str(payment.id),
                },
                payment_intent_data={
                    "application_fee_amount": application_fee_amount,
                    "transfer_data": {
                        "destination": request.user.stripe_account_id,
                    },
                },
            )
            payment.stripe_payment_id = session["payment_intent"]
            payment.save()

            serializer = PaymentSerializer(payment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        else:
            # No permission
            return Response(
                {"error": "Du har inte behörighet att skapa betalningar."},
                status=status.HTTP_403_FORBIDDEN,
            )


def handle_checkout_session_completed(session):
    logger.info("handle_checkout_session_completed called")
    payment_id = session["metadata"].get("payment_id")
    payment_intent = session.get("payment_intent")
    user_id = session.get("client_reference_id")  # User ID from Stripe session
    matter_id = session["metadata"].get("matter_id")  # Matter ID from metadata
    logger.debug(
        "Session metadata: payment_id=%s, user_id=%s, matter_id=%s",
        payment_id,
        user_id,
        matter_id,
    )
    user = CustomUser.objects.filter(id=user_id).first()
    matter = Matter.objects.filter(id=matter_id).first()
    if not user or not matter:
        logger.error(
            "No user or matter available to create payment (user: %s, matter: %s)",
            user,
            matter,
        )
        print("No user or matter available to create payment.")
        return

    try:
        payment = Payment.objects.get(id=payment_id)
        logger.debug("Found Payment with id: %s", payment_id)
    except Payment.DoesNotExist:
        logger.error("No Payment with id=%s found.", payment_id)
        print(f"No Payment with id={payment_id} found.")
        return

    payment.status = "paid"
    payment.stripe_payment_id = payment_intent
    payment.save()
    logger.info("Payment updated: %s", payment)
    print(f"Payment updated: {payment}")
    # Send order confirmation email
    subject = "Orderbekräftelse - JuridiQ"
    message = (
        f"Hej {payment.user.name} {payment.user.surname},\n\n"
        f"Tack för din betalning hos JuridiQ.\n\n"
        f"Orderinformation:\n"
        f"Ordernummer: {payment.id}\n"
        f"Ärende: {payment.matter.title}\n"
        f"Belopp: {payment.amount} SEK\n"
        f"Betalningsmetod: Kortbetalning via Stripe\n"
        f"Datum: {payment.created_at.strftime('%Y-%m-%d %H:%M')}\n\n"
        f"Vänligen spara detta meddelande som bekräftelse på din betalning.\n\n"
        f"Med vänlig hälsning,\n"
        f"JuridiQ"
    )
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [payment.user.email]
    send_mail(subject, message, from_email, recipient_list)
    logger.info("Orderbekräftelse skickad till %s", payment.user.email)


# Allow access only to admins or the object owner
class IsAdminOrReadOwn(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_staff:
            logger.debug("User %s is staff", request.user)
            return True
        result = request.method in permissions.SAFE_METHODS
        logger.debug("User %s safe method check: %s", request.user, result)
        return result

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            logger.debug("User %s is staff (object permission)", request.user)
            return True
        result = obj.user == request.user
        logger.debug(
            "User %s object ownership check for object %s: %s",
            request.user,
            obj.id,
            result,
        )
        return result


# ViewSet for Payment model with CRUD operations
class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        logger.info("PaymentViewSet.get_queryset called by user: %s", self.request.user)
        queryset = Payment.objects.all()
        matter_id = self.request.query_params.get("matter", None)
        if matter_id:
            logger.debug("Filtering payments by matter id: %s", matter_id)
            queryset = queryset.filter(matter_id=matter_id)
        if not self.request.user.is_staff:
            logger.debug("Filtering payments by user: %s", self.request.user)
            queryset = queryset.filter(user=self.request.user)
        qs = queryset
        logger.info("PaymentViewSet.get_queryset returning %d objects", qs.count())
        return qs

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def create_checkout_session(self, request, pk=None):
        logger.info(
            "PaymentViewSet.create_checkout_session called for payment id: %s", pk
        )
        payment = self.get_object()
        if request.user != payment.user:
            logger.warning(
                "User %s not authorized to pay payment id: %s", request.user, payment.id
            )
            return Response(
                {"error": "Du har inte behörighet att betala denna betalning."},
                status=status.HTTP_403_FORBIDDEN,
            )
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[
                    {
                        "price_data": {
                            "currency": "sek",
                            "product_data": {"name": f"Matter: {payment.matter.title}"},
                            "unit_amount": int(payment.amount * 100),
                        },
                        "quantity": 1,
                    }
                ],
                mode="payment",
                # success_url="http://localhost:5173/success",
                # cancel_url="http://localhost:5173/cancel",
                success_url="https://juridiq.nu/success",
                cancel_url="https://juridiq.nu/cancel",
                client_reference_id=str(payment.user.id),
                metadata={
                    "matter_id": str(payment.matter.id),
                    "payment_id": str(payment.id),
                },
            )
            logger.info(
                "Stripe checkout session created for payment id: %s", payment.id
            )
            return Response({"url": session.url}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception(
                "Error in create_checkout_session for payment id: %s", payment.id
            )
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
