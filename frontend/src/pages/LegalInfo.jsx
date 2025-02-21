import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../styles/CookieNIntegrityPolicy.module.css";

const LegalInfo = () => {
  return (
    <div className={styles.fullPage}>
      <Container className={`${styles.pageContainer} mt-2`}>
        <Row>
          <Col>
            <h2>Juridisk Information</h2>
            <p>
              <strong>Företagsnamn:</strong> JuridiQ
              <br />
              <strong>Organisationsnummer:</strong> 901031-3139
              <br />
              <strong>Telefon:</strong> 0720 24 68 60
              <br />
              <strong>E-post:</strong>{" "}
              <a href="mailto:juridiq.nu@gmail.com" className={styles.link}>
                juridiq.nu@gmail.com
              </a>
              <br />
              <strong>VAT‑nummer:</strong> SE901031313901
              <br />
            </p>
            <h4>Orderbekräftelse</h4>
            <p>
              När du genomför en betalning skickas en orderbekräftelse till din
              angivna e‑postadress. Denna bekräftelse innehåller information om
              din beställning, pris, betalningsmetod samt övriga villkor.
            </p>
            <h4>Ångerrätt och reklamation</h4>
            <p>
              Observera att våra juridiska tjänster är undantagna från ångerrätt
              enligt e‑handelslagen. När tjänsten har påbörjats eller är
              fullgjord, har du inte rätt att ångra ditt köp. Om du däremot
              anser att tjänsten inte lever upp till de överenskomna villkoren,
              gäller de reklamationsregler som anges i vår reklamationspolicy.
              Vid frågor, vänligen kontakta oss via e‑post på{" "}
              <strong>juridiq.nu@gmail.com </strong>
              eller telefon <strong>0720 24 68 60</strong>.
            </p>
            <h4>Betalning och Priser</h4>
            <p>
              Alla priser anges inklusive moms. Eventuella extra avgifter
              framgår tydligt innan köp slutförs.
            </p>
            <h4>Kontakt vid frågor</h4>
            <p>
              Vid frågor angående dessa villkor, vänligen kontakta oss via
              ovanstående kontaktuppgifter.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LegalInfo;
