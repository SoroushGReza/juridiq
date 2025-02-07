import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../styles/CookieNIntegrityPolicy.module.css";

const PrivacyPolicy = () => {
  return (
    <div className={styles.fullPage}>
      <Container className={`${styles.pageContainer} mt-2`}>
        <Row>
          <Col>
            <div className="d-flex align-items-center mb-3">
              <h2 className="mb-0">JuridiQ Integritetspolicy</h2>
            </div>
            <p>
              Denna integritetspolicy beskriver hur JuridiQ samlar in, lagrar,
              använder och skyddar dina personuppgifter i enlighet med GDPR och
              svensk lagstiftning.
            </p>
          </Col>
        </Row>

        <Row>
          <Col>
            <h4>Vilka personuppgifter samlar vi in?</h4>
            <p>
              Vi samlar in de uppgifter som du aktivt lämnar när du registrerar
              dig, loggar in eller använder våra tjänster. Detta inkluderar
              bland annat:
            </p>
            <ul>
              <li>E-postadress</li>
              <li>För- och efternamn</li>
              <li>Telefonnummer</li>
              <li>
                Övriga uppgifter som är nödvändiga för att kunna tillhandahålla
                våra juridiska tjänster
              </li>
            </ul>
          </Col>
        </Row>

        <Row>
          <Col>
            <h4>Hur använder vi dina personuppgifter?</h4>
            <p>Dina uppgifter används för att:</p>
            <ul>
              <li>Skapa och underhålla ditt konto</li>
              <li>
                Tillhandahålla våra juridiska tjänster, såsom rådgivning,
                dokumentservice och hantering av ärenden
              </li>
              <li>
                Kommunicera med dig, till exempel vid uppdateringar eller frågor
                om ditt ärende
              </li>
              <li>
                Hantera betalningar och transaktioner (inklusive integration med
                Stripe)
              </li>
            </ul>
          </Col>
        </Row>

        <Row>
          <Col>
            <h4>Delning av dina uppgifter</h4>
            <p>
              Vi delar inte dina personuppgifter med tredje part utan ditt
              uttryckliga samtycke, med undantag för:
            </p>
            <ul>
              <li>
                Myndigheter eller rättsliga instanser om det krävs enligt lag
              </li>
              <li>
                Tjänsteleverantörer som hjälper oss att driva och underhålla vår
                webbplats, förutsatt att de följer våra säkerhets- och
                sekretesskrav
              </li>
            </ul>
          </Col>
        </Row>

        <Row>
          <Col>
            <h4>Säkerhet</h4>
            <p>
              Vi vidtar rimliga tekniska och organisatoriska åtgärder för att
              skydda dina personuppgifter från obehörig åtkomst, förlust eller
              missbruk.
            </p>
          </Col>
        </Row>

        <Row>
          <Col>
            <h4>Dina rättigheter</h4>
            <p>Enligt GDPR har du rätt att:</p>
            <ul>
              <li>Begära tillgång till de personuppgifter vi lagrar om dig</li>
              <li>Begära rättelse av felaktiga uppgifter</li>
              <li>
                Begära radering av dina uppgifter (under vissa förutsättningar)
              </li>
              <li>Begära begränsning av vår behandling av dina uppgifter</li>
              <li>Invända mot vår behandling</li>
              <li>Begära dataportabilitet</li>
            </ul>
            <p>
              För att utöva dessa rättigheter, vänligen kontakta oss med de
              kontaktuppgifter som anges nedan.
            </p>
          </Col>
        </Row>

        <Row>
          <Col>
            <h4>Cookies</h4>
            <p>
              Vi använder cookies för att förbättra din upplevelse på vår
              webbplats. För en detaljerad beskrivning av hur vi använder
              cookies, se gärna vår{" "}
              <a href="/cookie-policy" className={styles.link}>
                cookiepolicy
              </a>
              .
            </p>
          </Col>
        </Row>

        <Row>
          <Col>
            <h4>Ändringar i denna policy</h4>
            <p>
              Vi kan komma att uppdatera denna integritetspolicy vid behov. Alla
              ändringar publiceras på denna sida. Vi rekommenderar att du
              regelbundet kontrollerar denna policy för att hålla dig informerad
              om hur dina uppgifter hanteras.
            </p>
          </Col>
        </Row>

        <Row>
          <Col>
            <h4>Kontakt</h4>
            <p>
              Har du frågor om vår integritetspolicy eller om hur vi behandlar
              dina personuppgifter, vänligen kontakta oss:
            </p>
            <ul>
              <li>
                <strong>E-post:</strong>{" "}
                <a href="mailto:juridiq.nu@gmail.com" className={styles.link}>
                  juridiq.nu@gmail.com
                </a>
              </li>
              <li>
                <strong>Telefon:</strong> [Fyller i när jag reggat
                företagsnummer]
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;
