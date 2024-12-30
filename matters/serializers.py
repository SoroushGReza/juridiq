from rest_framework import serializers
from .models import Matter


class MatterSerializer(serializers.ModelSerializer):
    file = serializers.FileField(required=False)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Matter
        fields = [
            "id",
            "user",
            "title",
            "description",
            "file",
            "status",
            "notes",
            "created_at",
        ]
        read_only_fields = ["id", "status", "notes", "created_at"]

    def create(self, validated_data):
        return Matter.objects.create(**validated_data)


class MatterDetailSerializer(serializers.ModelSerializer):
    file = serializers.FileField(required=False, allow_null=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Matter
        fields = [
            "id",
            "user",
            "title",
            "description",
            "file",
            "status",
            "notes",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def update(self, instance, validated_data):
        user = self.context["request"].user

        # Handle permission for non-admin users
        if not (user.is_staff or user.is_superuser):
            validated_data.pop("status", None)
            validated_data.pop("notes", None)

        # Handle file deletion
        if "file" in validated_data and validated_data["file"] is None:
            if instance.file:  # Check if file exists
                instance.file.delete(save=False)  # Delete file from server
            validated_data["file"] = None  # Set file field to none

        # Update instance with new data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
