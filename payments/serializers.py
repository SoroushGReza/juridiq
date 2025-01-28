from rest_framework import serializers
from payments.models import Payment
from matters.models import Matter
from accounts.models import CustomUser


class PaymentSerializer(serializers.ModelSerializer):
    matter_title = serializers.CharField(source="matter.title", read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Payment
        fields = [
            "id",
            "user",
            "matter",
            "amount",
            "status",
            "created_at",
            "matter_title",
            "user_email",
            "stripe_payment_id",
        ]
        extra_kwargs = {"user": {"write_only": True}, "matter": {"write_only": True}}
