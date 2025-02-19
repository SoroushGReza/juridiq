from django.urls import path
from .views import (
    UserRegistrationView,
    UserLoginView,
    UserProfileView,
    ChangePasswordView,
    DeleteAccountView,
    UserListView,
    VerifyEmailView,
    TOTPSetupView,
    TOTPActivateView,
    TOTPResetView,
    ForceReset2FAView,
    UserStatusView,
)


urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="register"),
    path("verify-email/<str:key>/", VerifyEmailView.as_view(), name="verify-email"),
    # 2FA
    path("2fa/setup/", TOTPSetupView.as_view(), name="2fa-setup"),
    path("2fa/activate/", TOTPActivateView.as_view(), name="2fa-activate"),
    path("2fa/reset/", TOTPResetView.as_view(), name="2fa-reset"),
    path("2fa/force-reset/", ForceReset2FAView.as_view(), name="2fa-force-reset"),
    path("login/", UserLoginView.as_view(), name="login"),
    path("profile/", UserProfileView.as_view(), name="profile"),
    path("status/", UserStatusView.as_view(), name="user-status"),
    path(
        "change-password/", ChangePasswordView.as_view(), name="change-password"
    ),  # noqa: E501
    path(
        "delete-account/", DeleteAccountView.as_view(), name="delete-account"
    ),  # noqa: E501
    path("users/", UserListView.as_view(), name="user-list"),
]
