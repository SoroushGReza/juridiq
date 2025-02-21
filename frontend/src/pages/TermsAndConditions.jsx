import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../styles/CookieNIntegrityPolicy.module.css";

const TermsAndConditions = () => {
  return (
    <div className={styles.fullPage}>
      <Container className={`${styles.pageContainer} mt-2`}>
        <Row>
          <Col>
            <h2>Villkor för JuridiQ</h2>
            <p>
              Dessa villkor ("Villkoren") reglerar din användning av webbplatsen
              JuridiQ samt de juridiska tjänster som erbjuds genom den –
              inklusive rådgivning, utformning av juridiska dokument,
              överklaganden och avtalsskrivning. Genom att använda webbplatsen
              bekräftar du att du har läst, förstått och godkänner dessa
              villkor. Om du inte accepterar dem, bör du inte använda
              webbplatsen.
            </p>
            <h4>1. Tjänsterna</h4>
            <p>
              JuridiQ erbjuder rådgivning och vägledning inom juridiska frågor
              samt förmedlar kontakt till advokater och jurister med
              specialkompetens. Tjänsterna är i huvudsak rådgivande och utgör
              inte ett fullständigt juridiskt ombudskap. I de fall det behövs
              vidare juridisk expertis, kommer vi att hjälpa dig att hitta en
              lämplig advokat eller jurist.
            </p>
            <h4>2. Användning av tjänsterna</h4>
            <p>
              Du ansvarar för att lämna korrekt och fullständig information vid
              registrering och när du använder våra tjänster. All kommunikation
              och all information som du lämnar hanteras i enlighet med vår
              integritetspolicy.
            </p>
            <h4>3. Betalning och priser</h4>
            <p>
              Tjänsterna betalas via Stripe, och betalning sker i förväg innan
              arbetet påbörjas. Vissa tjänster har fasta priser medan andra
              beror på ärendets komplexitet, omfattning och beräknad arbetstid.
              Efter att vi har bedömt ditt ärende ges ett prisförslag, och du
              har möjlighet att acceptera eller avböja innan arbetet startar.
            </p>
            <h4>4. Ångerrätt &amp; Reklamation</h4>
            <p>
              Observera att våra juridiska tjänster är undantagna från ångerrätt
              enligt e‑handelslagen. När tjänsten har påbörjats eller är fullt
              utförd, förlorar du din rätt att ångra köpet. Om du anser att
              tjänsten inte uppfyller de överenskomna villkoren, gäller de
              reklamationsregler som anges i vår reklamationspolicy. Vid frågor,
              vänligen kontakta oss via e‑post på{" "}
              <a href="mailto:juridiq.nu@gmail.com" className={styles.link}>
                juridiq.nu@gmail.com
              </a>{" "}
              eller telefon <strong>0720 24 68 60</strong>.
            </p>
            <h4>5. Återbetalning</h4>
            <p>
              Återbetalning sker endast om vi av någon anledning inte kan
              leverera det överenskomna arbetet, med undantag för{" "}
              <a
                href="https://sv.wikipedia.org/wiki/Force_majeure"
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                force majeure
              </a>{" "}
              eller andra särskilda omständigheter som gör att arbetet inte kan
              genomföras.
            </p>

            <h4>6. Ansvarsbegränsning</h4>
            <p>
              JuridiQ ansvarar inte för utgången av ett ärende eller de
              juridiska konsekvenserna av den rådgivning och de dokument som
              tillhandahålls. Vi gör vårt yttersta för att matcha dig med en
              advokat eller jurist med rätt kompetens, men kan inte garantera
              ett visst resultat. Om ett fel inträffar i leveransen åtar vi oss
              att vidta nödvändiga åtgärder för att rätta till detta.
            </p>
            <h4>7. Förmedling av juridisk rådgivning</h4>
            <p>
              Vår webbplats erbjuder inte direkt juridisk rådgivning från
              auktoriserade advokater. Istället fungerar vi som en mellanhand
              som hjälper dig att få kontakt med kvalificerade advokater och
              jurister. Vi lämnar prisförslag och information om avgifter innan
              vidare kontakt sker, så att du kan fatta ett informerat beslut.
            </p>
            <h4>8. Immateriella rättigheter</h4>
            <p>
              Allt innehåll på webbplatsen, inklusive text, grafik, logotyper
              och annat material, tillhör JuridiQ eller dess licensgivare. Det
              är förbjudet att kopiera, sprida eller på annat sätt använda detta
              innehåll utan uttryckligt skriftligt medgivande från JuridiQ.
            </p>
            <h4>9. Ändringar av villkoren</h4>
            <p>
              Vi förbehåller oss rätten att ändra dessa villkor när som helst.
              Ändringar träder i kraft omedelbart efter att de publicerats på
              webbplatsen. Det är ditt ansvar att regelbundet kontrollera
              villkoren. Genom att fortsätta använda webbplatsen godkänner du de
              reviderade villkoren.
            </p>
            <h4>10. Tillämplig lag och tvistlösning</h4>
            <p>
              Dessa villkor regleras av svensk lag. Tvister som uppstår i
              samband med användningen av webbplatsen ska i första hand lösas
              genom förhandlingar. Om en överenskommelse inte kan nås ska
              tvisten avgöras av svensk allmän domstol med [din ort] tingsrätt
              som första instans.
            </p>
            <h4>11. Övriga bestämmelser</h4>
            <p>
              Genom att använda webbplatsen bekräftar du att du har läst och
              förstått dessa villkor. Om du har några frågor om villkoren,
              vänligen kontakta oss via de kontaktuppgifter som anges i vår
              integritetspolicy.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TermsAndConditions;
