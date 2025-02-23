from django.test import TestCase
from django.core import mail
from accounts.models import CustomUser
from matters.models import Matter
from payments.models import Payment
from payments.views import handle_checkout_session_completed


class PaymentEmailTests(TestCase):
    def setUp(self):
        # Create a test user
        self.user = CustomUser.objects.create_user(
            email="test@example.com",
            password="testpass",
            name="Test",
            surname="User",
            phone_number="1234567890",
            gdpr_consent=True,
        )
        # Set a "first_name" attribute on the user for testing purposes.
        setattr(self.user, "first_name", self.user.name)

        # Create a test matter linked to the user
        self.matter = Matter.objects.create(
            user=self.user, title="Test Ärende", description="Testbeskrivning"
        )

        # Create a payment with a "pending" status
        self.payment = Payment.objects.create(
            user=self.user, matter=self.matter, amount="100.00", status="pending"
        )

    def test_successful_payment_sends_order_confirmation_email(self):
        # Clear the email outbox before running the test
        mail.outbox = []

        # Simulate a Stripe session with metadata
        session = {
            "metadata": {
                "payment_id": str(self.payment.id),
                "matter_id": str(self.matter.id),
            },
            "payment_intent": "pi_test_123",
            "client_reference_id": str(self.user.id),
        }

        handle_checkout_session_completed(session)

        # Update the payment from the database
        self.payment.refresh_from_db()
        self.assertEqual(self.payment.status, "paid")
        self.assertEqual(self.payment.stripe_payment_id, "pi_test_123")

        # Check that an email was sent
        self.assertGreater(len(mail.outbox), 0, "Inget e‑postmeddelande skickades.")

        order_email = mail.outbox[0]
        self.assertIn("Orderbekräftelse", order_email.subject)
        self.assertIn(str(self.payment.id), order_email.body)
        self.assertIn(self.matter.title, order_email.body)
        self.assertIn("100.00 SEK", order_email.body)
        # Update the test to verify that the greeting uses the "name" and "surname" fields
        self.assertIn(f"Hej {self.user.name} {self.user.surname},", order_email.body)
