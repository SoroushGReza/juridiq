from django.db import models
from django.conf import settings
from django.core.validators import FileExtensionValidator

MAX_FILE_SIZE_TOTAL = 15 * 1024 * 1024  # Maximum files size 15 MB (Togehter) 


class Matter(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Ongoing", "Ongoing"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="matters"
    )
    title = models.CharField(max_length=200, default="Ingen titel")
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Matter {self.id} ({self.title}) - {self.user.email}"


class MatterFile(models.Model):
    matter = models.ForeignKey(Matter, on_delete=models.CASCADE, related_name="files")
    file = models.FileField(
        upload_to="matter_files/",
        validators=[
            FileExtensionValidator(
                allowed_extensions=["pdf", "docx", "txt", "jpg", "png"]
            )
        ],
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"File {self.id} for Matter {self.matter.id}"
