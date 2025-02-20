from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.http import HttpResponse
from payments.views import stripe_webhook
from .views import home_view


urlpatterns = [
    path("", home_view, name="home"),
    path("secure-admin/", admin.site.urls),  # Admin Panel
    path("api/accounts/", include("accounts.urls")),
    path("api/matters/", include("matters.urls")),
    path("api/auth/", include("dj_rest_auth.urls")),
    path("api-auth/", include("rest_framework.urls")),
    path("api/auth/registration/", include("dj_rest_auth.registration.urls")),
    path(
        "api/auth/token/obtain/",
        TokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),  # JWT Token obtain
    path(
        "api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"
    ),  # JWT Token refresh
    path("api/payments/webhook/", stripe_webhook, name="stripe_webhook"),
    path("api/payments/", include("payments.urls")),
    path("api/contact/", include("contact.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
# handler404 = TemplateView.as_view(template_name="index.html")
