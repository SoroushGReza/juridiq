from django.urls import path
from payments.views import stripe_webhook

urlpatterns = [
    path("api/payments/webhook/", stripe_webhook, name="stripe_webhook"),
]
