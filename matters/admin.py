from django.contrib import admin
from .models import Matter, MatterFile


@admin.register(Matter)
class MatterAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "title", "status", "created_at"]
    list_filter = ["status", "created_at", "user"]
    search_fields = ["user__email", "description"]


@admin.register(MatterFile)
class MatterFileAdmin(admin.ModelAdmin):
    list_display = ["id", "matter", "file", "uploaded_at"]
    search_fields = ["file", "matter__title"]
