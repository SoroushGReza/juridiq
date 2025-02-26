from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
from django.utils import timezone


class CustomUserManager(BaseUserManager):
    def create_user(self, email, username=None, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", False)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        return self.create_user(email, username, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=150, null=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=30)
    surname = models.CharField(max_length=30)
    phone_number = models.CharField(max_length=15)
    totp_secret = models.CharField(max_length=64, blank=True, null=True)

    # Bank account details for payouts
    bank_account = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        verbose_name="Bankkonto",
        help_text="Ange ditt bankkonto (IBAN eller kontonummer) dit betalningar ska skickas.",
    )

    two_factor_enabled = models.BooleanField(default=False)
    # GDPR-approval
    gdpr_consent = models.BooleanField(
        default=False,
        verbose_name="GDPR-samtycke",
        help_text="Användaren har godkänt våra villkor och integritetspolicy.",
    )
    gdpr_consent_date = models.DateTimeField(
        null=True, blank=True, verbose_name="GDPR-samtyckesdatum"
    )

    is_delegated_admin = models.BooleanField(
        default=False,
        verbose_name="Delegated admin",
        help_text="Markera om denna användare är en delegerad admin.",
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    groups = models.ManyToManyField(
        "auth.Group",
        related_name="customuser_set",
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="customuser_set",
        blank=True,
    )

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "name", "surname", "phone_number"]

    def __str__(self):
        return self.email
