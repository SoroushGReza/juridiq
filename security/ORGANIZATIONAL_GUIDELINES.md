# Organisatoriska Riktlinjer och Roller för IT-säkerhet

## Syfte
Att definiera vilka processer, roller och rutiner som ska finnas på plats för att säkerställa ett heltäckande säkerhetsarbete enligt NIS‑2.

## Roller och Ansvar
- **IT-säkerhetsansvarig:**  
  - Soroush Gholamreza är ansvarig för att se till att alla säkerhetspolicyer, riskbedömningar, incidenthanteringsplaner och övervakningsrutiner följs.
- **Utveckling:**  
  - Ansvarar för att implementera säker kod, som t.ex. 2FA, e‑mailverifiering, filvalidering och loggning.
- **Systemövervakning:**  
  - Ansvarig för att kontinuerligt granska loggar (konfigurerade enligt `settings.py` under LOGGING‑avsnittet) samt se till att incidentvarningar och uppföljning sker.

## Utbildning
- **Säkerhetsutbildning:**  
  - Alla medarbetare (eller ansvarig person om du är ensam) genomför minst en årlig utbildning i IT-säkerhet och incidenthantering.
- **Dokumentation:**  
  - Säkerhetspolicyer, riskbedömningar och incidentplaner ska läsas och förstås av alla relevanta parter.

## Kommunikationsrutiner
- **Vid incidenter:**  
  1. Upptäckt – via loggar (se CONTINUOUS_MONITORING.md).  
  2. Rapportering – direkt via e‑post eller ett internt ärendehanteringssystem till IT-säkerhetsansvarig.  
  3. Uppföljning – dokumentera och rapportera incidenten enligt INCIDENT_RESPONSE_PLAN.md.
- **Extern rapportering:**  
  - Vid allvarliga incidenter, rapportera till myndigheter enligt gällande lag.

## Revision och Uppdatering
- **Årlig revision:**  
  - Säkerhetspolicyn, riskbedömningen, incidenthanteringsplanen och övervakningsrutinerna revideras minst en gång per år.  
  - Uppdateringar dokumenteras med versionsnummer och datum.
- **Intern utvärdering:**  
  - Regelbundna säkerhetsmöten (minst kvartalsvis) för att diskutera loggdata, incidenter och möjliga förbättringar.

---

*Dessa riktlinjer är att betrakta som en del av JuridiQs övergripande säkerhetsarbete och ska vara levande dokument som uppdateras vid behov.*  
*Ansvarig: Soroush Gholamreza*
