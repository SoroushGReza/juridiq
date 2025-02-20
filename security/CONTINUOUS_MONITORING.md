# Kontinuerlig Övervakning och Loggning

## Syfte
Att säkerställa att alla kritiska händelser i systemet upptäcks och hanteras i tid, samt att loggarna utgör en viktig grund för riskbedömning och incidentanalys.

## Loggning
- **Konfiguration:**  
  - Vår Django‑applikation är konfigurerad med ett LOGGING‑system i `settings.py`.  
  - Loggar skrivs till konsolen (med ett enkelt format) och till en fil (`logs/django.log`) med ett detaljerat format.
- **Format:**  
  - Verbose format: `"[{asctime}] {levelname} {name} {message}"` används i filhanteraren.
- **Loggnivåer:**  
  - Django‑systemet loggar på INFO‑nivå (och mailas vid ERROR‑nivå).
  - Exempelvis loggas även med "accounts" på DEBUG‑nivå för att underlätta felsökning.

## Övervakning
- **Automatiska varningar:**  
  - Övervakningsverktyg (ex. Sentry eller ELK‑stack) kan konfigureras att läsa in loggar från `logs/django.log` och skicka varningar vid misstänkt aktivitet.
- **Manuell granskning:**  
  - Säkerhetsansvarig bör regelbundet (minst veckovis) granska loggarna för att upptäcka potentiella hot.

## Uppföljning
- Loggar används vid riskbedömningar och incidenthanteringsprocessen (se INCIDENT_RESPONSE_PLAN.md).
- Resultat från logggranskningar dokumenteras och rapporteras kvartalsvis.

*Ansvarig för loggning och övervakning: Soroush Gholamreza*
