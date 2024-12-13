from rest_framework import serializers
from .models import Matter


class MatterSerializer(serializers.ModelSerializer):
    file = serializers.FileField(required=False)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Matter
        fields = ["id", "user", "description", "file", "status", "notes", "created_at"]
        read_only_fields = ["id", "status", "notes", "created_at"]

    def create(self, validated_data):
        return Matter.objects.create(**validated_data)


class MatterDetailSerializer(serializers.ModelSerializer):
    file = serializers.FileField(required=False)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Matter
        fields = ["id", "user", "description", "file", "status", "notes", "created_at"]
        read_only_fields = ["id", "created_at"]

    def update(self, instance, validated_data):
        user = self.context["request"].user

        # Handle permissions for non-admin users
        if not (user.is_staff or user.is_superuser):
            validated_data.pop("status", None)
            validated_data.pop("notes", None)

        # Keep existing file if no new file is uploaded
        if not validated_data.get("file"):
            validated_data.pop("file", None)

        # Update instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
