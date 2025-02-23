# Stripe och Stark Kundautentisering (SCA) – PSD2 Efterlevnad

Vi använder Stripe Checkout för att hantera alla betalningstransaktioner i projektet. Stripe
har inbyggda mekanismer för att uppfylla PSD2-kraven, framför allt vad gäller stark kundautentisering (SCA).

## Viktiga Punkter:

- **HTTPS Endpoints:**  
  Alla checkout-sessioner skapas med `success_url` och `cancel_url` som använder HTTPS:
  - Success URL: `https://juridiq.nu/success`
  - Cancel URL: `https://juridiq.nu/cancel`
- **Automatisk SCA:**  
  Vid en checkout initierar Stripe en SCA-process där användaren kan behöva genomgå en
  extra autentisering (exempelvis med SMS eller en bankapp) innan transaktionen slutförs.

- **API-version och Uppdateringar:**  
  Vi använder den senaste Stripe API-versionen vilket säkerställer att alla aktuella säkerhetskrav uppfylls.

- **Miljövariabler:**  
  Miljövariablerna `STRIPE_SECRET_KEY` och `STRIPE_WEBHOOK_SECRET` hanteras säkert och
  är satta till produktionsvärden i vår produktionsmiljö.

Denna integration är utformad för att uppfylla PSD2-kraven och säkerställa robust säkerhet för alla betalningstransaktioner.
