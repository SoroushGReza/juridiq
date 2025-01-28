from django.urls import path
from payments.views import PaymentViewSet, stripe_webhook, PaymentCreateView
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path("webhook/", stripe_webhook, name="stripe_webhook"),
    path("create/<int:matter_id>/", PaymentCreateView.as_view(), name="create_payment"),
]

router = DefaultRouter()
router.register(r"", PaymentViewSet, basename="payment")

urlpatterns += router.urls
