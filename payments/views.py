from rest_framework import viewsets, permissions
from payments.models import Payment
from django.core.exceptions import PermissionDenied
from payments.serializers import PaymentSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from matters.models import Matter
from accounts.models import CustomUser
import os
import stripe
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseBadRequest

# Stripe API credentials
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")


# Stripe Webhook to processes incoming webhook events
@csrf_exempt
def stripe_webhook(request):
    print("Webhook hit!")  # Log when webhook is hit
    payload = request.body
    sig_header = request.headers.get("Stripe-Signature")

    try:
        # Verify incoming event with webhook signature
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
        print(f"Webhook event type: {event['type']}")  # Log event type
    except ValueError:
        # If the payload is invalid
        print("Invalid payload")
        return HttpResponseBadRequest("Invalid payload")
    except stripe.error.SignatureVerificationError:
        # If signature is invalid
        print("Invalid signature")
        return HttpResponseBadRequest("Invalid signature")

    # Handle different event types from Stripe
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        handle_checkout_session_completed(session)
    elif event["type"] == "checkout.session.async_payment_failed":
        print("Payment failed!")
    elif event["type"] == "checkout.session.async_payment_succeeded":
        print("Async payment succeeded!")
    elif event["type"] == "checkout.session.expired":
        print("Session expired!")

    return JsonResponse({"status": "success"})


# Handles checkout session completion & updates or creates payment
def handle_checkout_session_completed(session):
    # Get Stripe payment ID
    stripe_payment_id = session.get("payment_intent")

    # Get user & matter information from session metadata
    user_id = session.get("client_reference_id")  # User ID from Stripe session
    matter_id = session.get("metadata", {}).get("matter_id")  # Matter ID from metadata

    # Retrieve user & matter from database based on IDs
    user = CustomUser.objects.filter(id=user_id).first()
    matter = Matter.objects.filter(id=matter_id).first()

    if not user or not matter:
        print("No user or matter available to create payment.")
        return

    # Create or update payment record in database
    payment, created = Payment.objects.get_or_create(
        stripe_payment_id=stripe_payment_id,
        defaults={
            "user": user,  # Assign user to payment
            "matter": matter,  # Assign matter to payment
            "amount": session.get("amount_total", 0)
            / 100,  # Convert amount to correct unit
            "status": "paid",  # Set status to paid
        },
    )
    if created:
        print(f"New payment created: {payment}")  # Log if new payment created
    else:
        print(f"Payment updated: {payment}")  # Log if payment updated


# Allow access only to admins or the object owner
class IsAdminOrReadOwn(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_staff:
            return True
        return request.method in permissions.SAFE_METHODS

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return (
            obj.user == request.user
        )  # Ensure that only owner can edit their own objects


# ViewSet for Payment model with CRUD operations
class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAdminOrReadOwn]

    def get_queryset(self):
        # If admin, return all payments, else only user own payments
        if self.request.user.is_staff:
            return Payment.objects.all()
        return Payment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Only admins allowed to create payments
        if not self.request.user.is_staff:
            raise PermissionDenied("Only admins can create payments")
        serializer.save()  # Save payment to database
