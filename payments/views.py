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


# Stripe API credentials
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")


# Stripe Webhook to processes incoming webhook events
@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.headers.get("Stripe-Signature")

    try:
        # Verify incoming event with webhook signature
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError:
        return HttpResponseBadRequest("Ogiltig payload")
    except stripe.error.SignatureVerificationError:
        return HttpResponseBadRequest("Ogiltig signatur")

    # Handle different event types from Stripe
    if event["type"] in [
        "checkout.session.completed",
        "checkout.session.async_payment_succeeded",
    ]:
        session = event["data"]["object"]
        handle_checkout_session_completed(session)
    elif event["type"] == "checkout.session.async_payment_failed":
        session = event["data"]["object"]
        handle_checkout_session_failed(
            session
        )
    elif event["type"] == "checkout.session.expired":
        print("Sessionen gick ut!")

    return JsonResponse({"status": "success"})


def handle_checkout_session_failed(session):
    payment_id = session["metadata"].get("payment_id")
    try:
        payment = Payment.objects.get(id=payment_id)
    except Payment.DoesNotExist:
        print(f"Ingen Payment med id={payment_id} hittades vid fail-eventet.")
        return

    payment.status = "failed"
    payment.save()
    print(f"Payment uppdaterad till 'failed': {payment}")


# Handles checkout session completion & updates or creates payment
class PaymentCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, matter_id, *args, **kwargs):
        if not request.user.is_staff:
            raise PermissionDenied("Endast admin kan skapa betalningar.")

        amount = request.data.get("amount")

        if not amount:
            return Response(
                {"error": "Belopp är obligatoriskt."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            matter = Matter.objects.get(id=matter_id)
        except Matter.DoesNotExist:
            return Response(
                {"error": "Ärendet existerar inte."}, status=status.HTTP_404_NOT_FOUND
            )

        # Check if there is existing payment for matter
        existing_payment = Payment.objects.filter(
            matter=matter, status="pending"
        ).first()
        if existing_payment:
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

            payment.stripe_payment_id = session["payment_intent"]
            payment.save()

            return Response(
                PaymentSerializer(payment).data, status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {"error": f"Stripe-session kunde inte skapas: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


def handle_checkout_session_completed(session):
    # Get Stripe payment ID
    payment_id = session["metadata"].get("payment_id")
    # Get user & matter information from session metadata
    payment_intent = session.get("payment_intent")
    user_id = session.get("client_reference_id")  # User ID from Stripe session
    matter_id = session["metadata"].get("matter_id")  # Matter ID from metadata
    # Retrieve user & matter from database based on IDs
    user = CustomUser.objects.filter(id=user_id).first()
    matter = Matter.objects.filter(id=matter_id).first()
    if not user or not matter:
        print("No user or matter available to create payment.")
        return

    try:
        payment = Payment.objects.get(id=payment_id)
    except Payment.DoesNotExist:
        print(f"No Payment with id={payment_id} found.")
        return

    payment.status = "paid"
    payment.stripe_payment_id = payment_intent
    payment.save()

    print(f"Payment updated: {payment}")


# Allow access only to admins or the object owner


class IsAdminOrReadOwn(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_staff:
            return True
        return request.method in permissions.SAFE_METHODS

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return obj.user == request.user


# ViewSet for Payment model with CRUD operations
class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Payment.objects.all()

        matter_id = self.request.query_params.get("matter", None)
        if matter_id:
            queryset = queryset.filter(matter_id=matter_id)

        # If not admin, show only logged in user's payments
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)

        return queryset

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def create_checkout_session(self, request, pk=None):
        payment = self.get_object()

        # Check if user is owner of payment
        if request.user != payment.user:
            return Response(
                {"error": "Du har inte behörighet att betala denna betalning."},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            # Create Stripe checkout session
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

            return Response({"url": session.url}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
