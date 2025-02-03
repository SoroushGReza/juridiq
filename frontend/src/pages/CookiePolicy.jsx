import React from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import styles from "../styles/CookiePolicy.module.css";
import GreyLogo from "../assets/images/greylogo.svg";

const CookiePolicy = () => {
  return (
    <div className={styles.fullPage}>
      <Container className={`${styles.cookiePolicyPage} mt-2`}>
        <Row>
          <Col>
            <div className="d-flex align-items-center mb-3">
              <h2 className="mb-0 me-2">JuridiQ Cookiepolicy</h2>
              <img src={GreyLogo} alt="JuridiQ Logo" className={styles.logo} />
            </div>

            <p className="mb-4">
              Denna cookiepolicy förklarar hur JuridiQ använder cookies på vår
              webbplats för att ge dig bästa möjliga upplevelse.
            </p>
          </Col>
        </Row>
        <Row>
          <Col md={10} lg={10}>
            <h4 className="mb-3">Vad är cookies?</h4>
            <p className="mb-4">
              Cookies är små textfiler som lagras på din dator eller mobila
              enhet när du besöker JuridiQ. De hjälper oss att förbättra din
              upplevelse, samla in statistik och anpassa juridiska tjänster.
            </p>
            <h4 className="mb-3">Vilka cookies använder JuridiQ?</h4>
            <ListGroup variant="flush" className={`mb-4 ${styles.listGroup}`}>
              <ListGroup.Item className={styles.listGroupItem}>
                <strong>Nödvändiga cookies:</strong> Dessa cookies är avgörande
                för JuridiQs funktionalitet och kan inte inaktiveras.
              </ListGroup.Item>
              <ListGroup.Item className={styles.listGroupItem}>
                <strong>Analyscookies:</strong> Dessa cookies används för att
                samla in statistik som hjälper oss att förbättra våra juridiska
                tjänster.
              </ListGroup.Item>
              <ListGroup.Item className={styles.listGroupItem}>
                <strong>Marknadsföringscookies:</strong> Dessa cookies används
                för att visa anpassade erbjudanden och juridiska tjänster.
              </ListGroup.Item>
            </ListGroup>

            <h4 className="mb-3">Hur kontrollerar du cookies?</h4>
            <p className="mb-4">
              Du kan ändra dina cookie-inställningar när som helst genom att
              klicka på "Cookie Inställningar" i vår cookie-banner eller genom
              att använda inställningarna i din webbläsare.
            </p>
            <p className="mb-4">
              För mer information om hur du hanterar cookies, vänligen se din
              webbläsares hjälpsektion.
            </p>
            <h4 className="mb-3">Ändringar i cookiepolicyn</h4>
            <p>
              Vi kan komma att uppdatera denna cookiepolicy vid behov. Ändringar
              publiceras på denna sida.
            </p>
            <p className="mb-4">
              Om du har frågor kring vår användning av cookies eller JuridiQs
              juridiska tjänster, är du välkommen att kontakta oss.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CookiePolicy;
