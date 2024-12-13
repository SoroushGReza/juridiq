from django.contrib import admin
from .models import Matter


@admin.register(Matter)
class MatterAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "status", "created_at"]
    list_filter = ["status", "created_at", "user"]
    search_fields = ["user__email", "description"]
