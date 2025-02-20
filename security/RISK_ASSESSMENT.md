# Riskbedömning för JuridiQ

## Syfte
Att identifiera, bedöma och dokumentera risker som kan påverka våra IT-tillgångar och verksamhet, så att vi kan vidta åtgärder i enlighet med NIS‑2.

## Metod
Risker bedöms utifrån sannolikhet (Låg, Medel, Hög) och konsekvens (Låg, Medel, Hög). Varje risk får en risknivå baserad på dessa parametrar.

## Loggningens roll i riskhanteringen
- Vår Django-loggning, konfigurerad i `settings.py`, loggar kritiska händelser både till konsolen och i en fil (`logs/django.log`).  
- Dessa loggar används som underlag vid riskbedömningar för att identifiera oregelbunden aktivitet eller mönster som kan tyda på säkerhetshot.

## Risköversikt

### Risk 1: Obeskyddad API-åtkomst
- **Beskrivning:** Angrepp via API‑anrop om obehörig åtkomst.  
- **Sannolikhet:** Medel  
- **Konsekvens:** Hög  
- **Åtgärder:**  
  - JWT‑baserad autentisering och 2FA.  
  - Loggning av API‑anrop med vår centraliserade loggkonfiguration för att upptäcka missbruk.  
  - Införande av rate limiting vid behov.

### Risk 2: Skadliga filer vid uppladdning
- **Beskrivning:** Möjlighet att ladda upp filer med skadlig kod.  
- **Sannolikhet:** Låg  
- **Konsekvens:** Hög  
- **Åtgärder:**  
  - Filvalidering med begränsade format och storleksgräns (max 15 MB).  
  - Loggning av filuppladdningar med information om filtyp och storlek för att spåra oönskade händelser.

### Risk 3: Dataintrång och incidenter
- **Beskrivning:** Intrång i systemet som påverkar konfidentialitet, integritet eller tillgänglighet.  
- **Sannolikhet:** Medel  
- **Konsekvens:** Mycket hög  
- **Åtgärder:**  
  - Central loggning (konfigurerad i `settings.py`) för att snabbt upptäcka incidenter.  
  - Incidenthanteringsplan (se INCIDENT_RESPONSE_PLAN.md) aktiveras vid misstänkt aktivitet.  
  - Regelbundna säkerhetstester och revisioner.

## Sammanfattning
Riskbedömningen genomförs årligen och resultaten dokumenteras tillsammans med en åtgärdsplan. Dessa dokument används för att följa upp och minimera risker enligt NIS‑2.

*Senaste bedömning: 2025-02-20*
