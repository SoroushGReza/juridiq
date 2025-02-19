from rest_framework import permissions


class TwoFactorEnabledPermission(permissions.BasePermission):
    message = "Tvåstegsverifiering krävs för att komma åt denna resurs."

    def has_permission(self, request, view):
        # Only grant if the user is authenticated and 2FA is enabled.
        if request.user and request.user.is_authenticated:
            return request.user.two_factor_enabled
        return False
