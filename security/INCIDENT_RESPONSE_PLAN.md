# Incidenthanteringsplan för JuridiQ

## Syfte
Att definiera en snabb och effektiv process för att hantera säkerhetsincidenter i enlighet med NIS‑2.

## Definition
En incident är ett oönskat händelseförlopp som påverkar systemets konfidentialitet, integritet eller tillgänglighet.

## Processsteg

### 1. Upptäckt
- **Verktyg:**  
  - Använd central loggning via konfigurationen i `settings.py` (loggar sparas i `logs/django.log`).  
  - Övervakningssystem (ex. Sentry eller ELK‑stack) används för att automatiskt upptäcka avvikelser.
- **Ansvar:** IT-säkerhetsansvarig (Soroush Gholamreza).

### 2. Rapportering
- **Intern rapportering:** Vid upptäckt av incident skickas en omedelbar rapport via e‑post till säkerhetsansvarig.
- **Extern rapportering:** Vid allvarliga incidenter, rapportera enligt svensk lag (t.ex. till MSB).

### 3. Bedömning
- Analysera loggar och identifiera omfattningen av incidenten.
- Bedöm riskerna utifrån sannolikhet och konsekvens.

### 4. Åtgärd
- **Isolering:** Vid behov isoleras drabbade system (t.ex. genom att blockera IP-adresser).
- **Radering/Återställning:** Använd backuper för att återställa systemet om så behövs.
- **Dokumentation:** Dokumentera alla åtgärder och beslut i ett incidentrapporteringsdokument.

### 5. Återgång till normal drift
- När incidenten är åtgärdad, verifiera med loggdata att systemet är säkert.
- Informera berörda parter och uppdatera loggar samt incidentrapporten.

### 6. Efteranalys
- Gör en fullständig genomgång av incidenten.
- Uppdatera säkerhetspolicyn och genomför nödvändiga utbildningsinsatser.

## Loggningens roll
- Alla incidenter registreras i loggfiler enligt `LOGGING`‑inställningarna i `settings.py`. Dessa loggar är centrala för att snabbt kunna spåra händelser och vidta rätt åtgärder.

## Kommunikation
- **Intern:** Säkerhetsansvarig meddelar alla relevanta intressenter vid större incidenter.
- **Extern:** Vid behov, kontakta berörda myndigheter enligt gällande regelverk.

*Planen revideras minst en gång per år eller vid större incidenter.*  
*Ansvarig: Soroush Gholamreza*
