from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "amount", "status", "stripe_payment_id", "created_at")
    search_fields = ("user__email", "stripe_payment_id")
    list_filter = ("status", "created_at")
