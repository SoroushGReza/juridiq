from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone

CustomUser = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    gdpr_consent = serializers.BooleanField(write_only=True)

    class Meta:
        model = CustomUser
        fields = (
            "email",
            "password",
            "name",
            "surname",
            "phone_number",
            "gdpr_consent",
        )

    def create(self, validated_data):
        # Remove gdpr_concent from data
        gdpr_consent = validated_data.pop("gdpr_consent")

        user = CustomUser.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            name=validated_data.get("name"),
            surname=validated_data.get("surname"),
            phone_number=validated_data.get("phone_number"),
        )

        # Set GDPR after user is created
        user.gdpr_consent = gdpr_consent
        user.gdpr_consent_date = timezone.now()
        user.save()
        return user

    def validate_gdpr_consent(self, value):
        if value is not True:
            raise serializers.ValidationError(
                "Du måste godkänna villkoren och integritetspolicyn för att registrera ett konto."
            )
        return value


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)


class UserProfileSerializer(serializers.ModelSerializer):
    is_superuser = serializers.BooleanField(read_only=True)
    is_staff = serializers.BooleanField(read_only=True)
    stripe_account_id = serializers.CharField(read_only=True)

    class Meta:
        model = CustomUser
        fields = (
            "email",
            "name",
            "surname",
            "phone_number",
            "bank_account",
            "is_delegated_admin",
            "is_superuser",
            "is_staff",
            "stripe_account_id",
        )


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class DeleteAccountSerializer(serializers.Serializer):
    password = serializers.CharField(required=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "email", "name", "surname"]
