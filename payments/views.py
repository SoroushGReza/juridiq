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
class PaymentCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, matter_id, *args, **kwargs):
        logger.info(
            "PaymentCreateView POST called by user: %s for matter_id: %s",
            request.user,
            matter_id,
        )
        if not request.user.is_staff:
            logger.error("User %s is not staff - PermissionDenied", request.user)
            raise PermissionDenied("Endast admin kan skapa betalningar.")

        amount = request.data.get("amount")
        if not amount:
            logger.error("Amount not provided in PaymentCreateView POST")
            return Response(
                {"error": "Belopp är obligatoriskt."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            matter = Matter.objects.get(id=matter_id)
            logger.debug("Found Matter with id: %s", matter_id)
        except Matter.DoesNotExist:
            logger.error("Matter with id %s does not exist", matter_id)
            return Response(
                {"error": "Ärendet existerar inte."}, status=status.HTTP_404_NOT_FOUND
            )

        # Check if there is existing payment for matter
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

        try:
            payment = Payment.objects.create(
                user=matter.user, matter=matter, amount=amount, status="pending"
            )
            logger.info("Payment created with id: %s", payment.id)

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
                # success_url="http://localhost:5173/success",
                # cancel_url="http://localhost:5173/cancel",
                success_url="https://juridiq.nu/success",
                cancel_url="https://juridiq.nu/cancel",
                client_reference_id=str(matter.user.id),
                metadata={
                    "matter_id": str(matter.id),
                    "payment_id": str(payment.id),
                },
            )
            logger.debug(
                "Stripe checkout session created for payment id: %s", payment.id
            )

            payment.stripe_payment_id = session["payment_intent"]
            payment.save()
            logger.info(
                "Payment updated with stripe_payment_id for payment id: %s", payment.id
            )

            return Response(
                PaymentSerializer(payment).data, status=status.HTTP_201_CREATED
            )

        except Exception as e:
            logger.exception("Error creating Stripe session")
            return Response(
                {"error": f"Stripe-session kunde inte skapas: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
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
