# IT-Säkerhetspolicy för JuridiQ

## Syfte
Denna policy beskriver både de tekniska och organisatoriska åtgärderna som JuridiQ implementerar för att skydda sina system och personuppgifter i enlighet med NIS‑2 och GDPR.

## Omfattning
Policyn gäller för alla IT-tillgångar, system, nätverk och applikationer i JuridiQ samt för alla medarbetare (även om du är ensam utvecklare).

## Säkerhetsmål
- Skydda kunddata och interna system från obehörig åtkomst.
- Säkerställa att systemen är robusta, tillgängliga och snabbt kan återställas vid incidenter.
- Upprätthålla ett strukturerat och dokumenterat säkerhetsarbete.

## Tekniska säkerhetsåtgärder
- **Autentisering och åtkomst:** Användning av JWT, e‑mailverifiering vid registrering och tvåfaktorsautentisering (2FA).
- **Kommunikation:** Produktionen körs över HTTPS.
- **Filhantering:** Endast säkra filformat (PDF, TXT, JPG, PNG) tillåts och total uppladdad filstorlek begränsas (max 15 MB).
- **Loggning:**  
  - Vår loggning är konfigurerad i `settings.py`.  
  - Loggar skrivs både till konsolen och till en fil (se `logs/django.log`), med ett detaljerat format (se `verbose` formatter).  
  - Viktiga händelser, fel och varningar loggas med nivåerna INFO och DEBUG för respektive app (t.ex. `accounts` loggas på DEBUG‑nivå).
- **Övriga åtgärder:** CSRF‑skydd, CORS‑konfiguration och användning av externa tjänster (t.ex. Stripe) med säker hantering av API‑nycklar.

## Organisatoriska säkerhetsåtgärder
- **Riskbedömning:** Regelbundna riskanalyser genomförs minst årligen (se RISK_ASSESSMENT.md).
- **Incidenthantering:** En dokumenterad incidenthanteringsplan finns (se INCIDENT_RESPONSE_PLAN.md) med definierade roller, processer och kommunikationsvägar.
- **Övervakning:**  
  - Kontinuerlig övervakning av systemet sker via central loggning.  
  - Loggar samlas in med konfigurationen i `settings.py` (se `LOGGING`-inställningar) och granskas regelbundet.
- **Utbildning:** Alla relevanta parter får regelbunden IT-säkerhetsutbildning.
- **Revision:** Säkerhetspolicyn, riskbedömningen och incidenthanteringsplanen revideras minst en gång per år.

## Revision och Uppdatering
Denna policy revideras årligen eller vid större förändringar i IT-miljön. Alla ändringar dokumenteras med versionsnummer och datum.

*Godkänd av: Soroush Gholamreza*  
*Datum: 2025-02-20*
