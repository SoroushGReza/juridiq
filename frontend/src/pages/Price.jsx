import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../styles/Home.module.css";

const Price = () => {
  return (
    <Container fluid className={`${styles.homeContainer} p-0`}>
      <div className={styles.homeBackground}></div>
      <div className={styles.homeContent}>
        <Row className="text-center p-3 m-3">
          <Col xs={12}>
            <h1 className={styles.homeHeading}>Priser för våra tjänster</h1>
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
                <b>Pris:</b> från 2000 kr/timme
              </p>
            </div>
          </Col>
          <Col xs={12} sm={6} md={6} lg={3} className="p-3 text-white">
            <div className={`${styles.sectionBox}`}>
              <h4 className="text-center">Avtal och kontrakt</h4>
              <ul>
                <li>
                  <b>Samboavtal:</b> 3200 kr
                </li>
                <li>
                  <b>Bodelning:</b> 4000 kr
                </li>
                <li>
                  <b>Företagskontrakt:</b> 4500 kr
                </li>
                <li>
                  <b>Sekretessavtal:</b> 3000 kr
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
                <b>Pris:</b> 2000 kr/timme
              </p>
            </div>
          </Col>
          <Col xs={12} sm={6} md={6} lg={3} className="p-3 text-white">
            <div className={`${styles.sectionBox}`}>
              <h4 className="text-center">Dokumentservice</h4>
              <ul>
                <li>
                  <b>Testamente:</b> 5500 kr
                </li>
                <li>
                  <b>Framtidsfullmakt:</b> 5000 kr
                </li>
                <li>
                  <b>Arbetsavtal:</b> 3500 kr
                </li>
                <li>
                  <b>Hyresavtal:</b> 3000 kr
                </li>
                <li>
                  <b>Tjänsteavtal:</b> 4000 kr
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Price;
