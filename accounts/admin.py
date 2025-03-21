from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser
from django.core.exceptions import PermissionDenied
from django.contrib import messages


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = [
        "email",
        "name",
        "surname",
        "is_staff",
        "is_active",
        "is_delegated_admin",
    ]
    list_filter = ["is_staff", "is_active"]
    search_fields = ["email", "name", "surname"]
    ordering = ["email"]
    exclude = ("date_joined",)

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            "Personal info",
            {"fields": ("name", "surname", "phone_number")},
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "user_permissions",
                    "is_delegated_admin",
                    "groups",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login",)}),
    )

    # Custom fieldsets for user creation form
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "name",
                    "surname",
                    "phone_number",
                    "password1",
                    "password2",
                    "is_active",
                    "is_staff",
                    "is_delegated_admin",
                ),
            },
        ),
    )


admin.site.register(CustomUser, CustomUserAdmin)
