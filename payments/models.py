from django.db import models
from django.conf import settings
from matters.models import Matter


class Payment(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("failed", "Failed"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="payments"
    )
    matter = models.ForeignKey(
        Matter, on_delete=models.CASCADE, related_name="payments"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    stripe_payment_id = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Payment {self.id} - {self.amount} SEK ({self.status})"
