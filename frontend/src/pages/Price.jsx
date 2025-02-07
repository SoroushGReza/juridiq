import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../styles/Price.module.css";

const Price = () => {
  return (
    <Container fluid className={`${styles.priceContainer} p-0`}>
      <div className={styles.priceBackground}></div>
      <div className={styles.priceContent}>
        <Row className="text-center">
          <Col xs={12}>
            <h1 className={`${styles.priceHeading} p-0 mt-4`}>Våra Priser</h1>
          </Col>
        </Row>
        <Row className="g-3">
          <Col xs={12} sm={6} md={6} lg={3} className="p-3 text-white">
            <div className={`${styles.sectionBox}`}>
              <h4 className="text-center">Överklaganden</h4>
              <p>Inkluderar:</p>
              <ul>
                <li>Genomgång av ditt ärende</li>
                <li>Skriftlig överklagan</li>
                <li>Uppföljning och rådgivning</li>
              </ul>
              <p>
                <b>Pris:</b> från 1595 kr/timme
              </p>
              <p className={`${styles.deal15Min}`}>
                Fast pris kan erbjudas vid enklare ärenden.
              </p>
            </div>
          </Col>
          <Col xs={12} sm={6} md={6} lg={3} className="p-3 text-white">
            <div className={`${styles.sectionBox}`}>
              <h4 className="text-center">Avtal och kontrakt</h4>
              <ul>
                <li>
                  <b>Samboavtal:</b> 485 kr
                </li>
                <li>
                  <b>Bodelning:</b> 1950 kr
                </li>
                <li>
                  <b>Företagskontrakt:</b> 950 kr
                </li>
                <li>
                  <b>Sekretessavtal:</b> 375 kr
                </li>
              </ul>
            </div>
          </Col>
          <Col xs={12} sm={6} md={6} lg={3} className="p-3 text-white">
            <div className={`${styles.sectionBox}`}>
              <h4 className="text-center">Rådgivning</h4>
              <p>Vi erbjuder kvalificerad juridisk vägledning inom:</p>
              <ul>
                <li>Familjerätt</li>
                <li>Arbetsrätt</li>
                <li>Affärsjuridik</li>
              </ul>
              <p>
                <b>Pris:</b> 1985 kr/timme
              </p>
              <p className={`${styles.deal15Min}`}>
                Första 15 minuterna är kostnadsfria.
              </p>
            </div>
          </Col>
          <Col xs={12} sm={6} md={6} lg={3} className="p-3 text-white">
            <div className={`${styles.sectionBox}`}>
              <h4 className="text-center">Dokumentservice</h4>
              <ul>
                <li>
                  <b>Testamente:</b> 485 kr
                </li>
                <li>
                  <b>Framtidsfullmakt:</b> 385 kr
                </li>
                <li>
                  <b>Arbetsavtal:</b> 250 kr
                </li>
                <li>
                  <b>Hyresavtal:</b> 250 kr
                </li>
                <li>
                  <b>Tjänsteavtal:</b> 499 kr
                </li>
              </ul>
            </div>
          </Col>
          <Col xs={12} sm={6} md={6} lg={6} className="p-3 text-white mx-auto">
            <div className={`${styles.sectionBox}`}>
              <h4 className="text-center">Brottmål</h4>
              <p>Rådgivning för misstänkta och brottsoffer:</p>
              <ul className="mb-3">
                <li>Genomgång av ditt fall</li>
                <li>Förberedelse inför polisförhör</li>
                <li>
                  Strategisk rådgivning för hur du bäst bemöter frågor och
                  undviker missförstånd
                </li>
                <li>
                  Koppling till en erfaren advokat specialiserad inom brottmål
                </li>
              </ul>
              <p>
                <b>Pris:</b> 1985 kr/timme
              </p>
              <p className={`${styles.deal15Min}`}>
                Första 15 minuterna är kostnadsfria.
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Price;
