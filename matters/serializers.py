from rest_framework import serializers
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from .models import Matter, MatterFile, MAX_FILE_SIZE_TOTAL


class MatterFileSerializer(serializers.ModelSerializer):
    # Get absolute URL
    file = serializers.SerializerMethodField()

    class Meta:
        model = MatterFile
        fields = ["id", "file", "uploaded_at"]
        read_only_fields = ["id", "uploaded_at"]

    def get_file(self, obj):
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.file.url)
        return obj.file.url


class MatterCreateUpdateSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    new_files = serializers.ListField(
        child=serializers.FileField(
            validators=[
                FileExtensionValidator(
                    allowed_extensions=["pdf", "txt", "jpg", "png"],
                    message="Filformat stöds inte! Endast PDF, TXT, JPG och PNG tillåtna.",
                )
            ]
        ),
        required=False,
        write_only=True,
    )

    remove_file_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        write_only=True,
    )
    files = MatterFileSerializer(many=True, read_only=True)

    class Meta:
        model = Matter
        fields = [
            "id",
            "user",
            "title",
            "description",
            "status",
            "notes",
            "created_at",
            "new_files",
            "remove_file_ids",
            "files",
        ]
        read_only_fields = ["id", "created_at"]

    def validate(self, attrs):
        """
        Check that the total file size is <= 15 MB.
        If matter already exists (update), retrieve existing files and subtract
        those to be removed (remove_file_ids) before calculating.
        Then add new_files.
        """
        request = self.context["request"]
        matter_instance = self.instance

        new_files = attrs.get("new_files", [])
        remove_file_ids = attrs.get("remove_file_ids", [])

        existing_files_size = 0
        if matter_instance:
            files_to_keep = matter_instance.files.exclude(id__in=remove_file_ids)
            existing_files_size = sum(f.file.size for f in files_to_keep)

        new_files_size = sum(f.size for f in new_files)
        total_size = existing_files_size + new_files_size

        if total_size > MAX_FILE_SIZE_TOTAL:
            raise ValidationError("Totala filstorleken överstiger 15MB.")
        return attrs

    def create(self, validated_data):
        new_files = validated_data.pop("new_files", [])
        remove_file_ids = validated_data.pop("remove_file_ids", [])
        matter = Matter.objects.create(**validated_data)

        for f in new_files:
            MatterFile.objects.create(matter=matter, file=f)
        return matter

    def update(self, instance, validated_data):
        request = self.context["request"]
        user = request.user

        new_files = validated_data.pop("new_files", [])
        remove_file_ids = validated_data.pop("remove_file_ids", [])

        # Prevent none-admin users to update status or notes
        if not (user.is_staff or user.is_superuser):
            validated_data.pop("status", None)
            validated_data.pop("notes", None)

        # Uppdate Matter-field
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Delete files if remove_file_ids exists
        if remove_file_ids:
            files_to_remove = instance.files.filter(id__in=remove_file_ids)
            for f in files_to_remove:
                f.delete()

        # Add new files
        for f in new_files:
            MatterFile.objects.create(matter=instance, file=f)

        return instance
