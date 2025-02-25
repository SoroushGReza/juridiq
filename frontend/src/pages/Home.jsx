import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../styles/Home.module.css";
import AppealIcon from "../assets/icons/appeal.svg";
import DocumentIcon from "../assets/icons/document.svg";
import HandcuffsIcon from "../assets/icons/handcuffs.svg";

const Home = () => {
  return (
    <Container fluid className={`${styles.homeContainer} p-0`}>
      <div className={styles.homeBackground}></div>
      <div className={styles.homeContent}>
        {/* ---------------- Announcement ---------------- */}
        <Row className="justify-content-center">
          <Col xs={11} md={11} lg={8}>
            <div className={styles.announcement}>
              <h2>Sidan är under utveckling</h2>
              <p>
                Men vi söker redan nu <strong>jurister</strong> och{" "}
                <strong>advokater</strong> för samarbete! Som en tidig
                samarbetspartner får du en administrativ profil där vi förmedlar
                ärenden anpassade efter din specialitet. Du kan även påverka
                utvecklingen av sidan och dess funktioner.
              </p>
              <p>
                📩 Är du intresserad?{" "}
                <a href="mailto:juridiq.nu@gmail.com">Kontakta oss</a>
              </p>
            </div>
          </Col>
        </Row>
        {/* ----------------..............---------------- */}

        <Row className="text-center p-3 m-3">
          <Col xs={12}>
            <h1 className={styles.homeHeading}>
              Vi hjälper dig med juridiska dokument och vägledning.
            </h1>
          </Col>
        </Row>
        <Row className="g-3">
          <h1 className={`${styles.services}`}>Våra Tjänster</h1>
          <Col xs={12} sm={6} md={6} lg={3} className="p-3 text-white">
            <div className={`${styles.sectionBox}`}>
              <h4 className="text-center">Överklaganden</h4>
              <p>
                Vi hjälper dig att överklaga beslut från myndigheter och
                organisationer, som exempelvis socialtjänsten eller
                Försäkringskassan. Vi ser till att ditt ärende hanteras korrekt
                och professionellt.
              </p>
              <div className={`${styles.iconDiv}`}>
                <img
                  src={AppealIcon}
                  alt="Överklaganden"
                  className={`${styles.appealIcon}`}
                />
              </div>
            </div>
          </Col>
          <Col xs={12} sm={6} md={6} lg={3} className="p-3 text-white d-flex">
            <div className={`${styles.sectionBox}`}>
              <h4 className="text-center">Avtal och kontrakt</h4>
              <p>Vi skräddarsyr juridiskt bindande avtal för dina behov.</p>
              <ul className={`${styles.serviceList}`}>
                <li>
                  <b>Samboavtal:</b> Rättvis ekonomisk fördelning.
                </li>
                <li>
                  <b>Bodelning:</b> Hjälp vid separation.
                </li>
                <li>
                  <b>Företagskontrakt:</b> Professionellt granskade avtal.
                </li>
                <li>
                  <b>Sekretessavtal:</b> Skydda känslig information.
                </li>
              </ul>
            </div>
          </Col>
          <Col xs={12} sm={6} md={6} lg={3} className="p-3 text-white d-flex">
            <div className={`${styles.sectionBox}`}>
              <h4 className="text-center">Rådgivning</h4>
              <p>
                Vi erbjuder kvalificerad juridisk rådgivning för privatpersoner
                och företag.
              </p>
              <ul className={`${styles.serviceList}`}>
                <li>
                  <b>Familjerätt:</b> Samboavtal och äktenskapsförord.
                </li>
                <li>
                  <b>Arbetsrätt:</b> Frågor om anställningar.
                </li>
                <li>
                  <b>Affärsjuridik:</b> Juridisk hjälp för företag.
                </li>
              </ul>
            </div>
          </Col>
          <Col xs={12} sm={6} md={6} lg={3} className="p-3 text-white d-flex">
            <div className={`${styles.sectionBox}`}>
              <h4 className="text-center">Dokumentservice</h4>
              <p>
                Vi hjälper dig att skapa juridiska dokument som är korrekt
                utformade enligt svensk lag.
              </p>
              <ul className={`${styles.serviceList}`}>
                <li>
                  <b>Arbetsavtal:</b> Klara villkor.
                </li>
                <li>
                  <b>Hyresavtal:</b> Skydd för alla parter.
                </li>
                <li>
                  <b>Tjänsteavtal:</b> Anpassade samarbeten.
                </li>
              </ul>
              <div className={`${styles.iconDiv}`}>
                <img
                  src={DocumentIcon}
                  alt="Överklaganden"
                  className={`${styles.documentIcon}`}
                />
              </div>
            </div>
          </Col>
          <Col xs={12} sm={8} md={6} lg={4} className="p-3 text-white mx-auto">
            <div className={`${styles.sectionBox}`}>
              <h4 className="text-center">Brottmål</h4>
              <p>Vi erbjuder rådgivning för både misstänkta och brottsoffer:</p>
              <ul className={`${styles.serviceList}`}>
                <li>Genomgång av ditt ärende</li>
                <li>
                  Strategisk rådgivning – hur du bäst bemöter frågor och
                  undviker missförstånd under polisförhör och rättegång.
                </li>
                <li>
                  Förmedling av ditt ärende till en erfaren advokat som är bäst
                  lämpad för ditt fall – ett tryggare alternativ än att bli
                  tilldelad en slumpmässig offentlig försvarare.
                </li>
              </ul>
              <div className={`${styles.iconDiv}`}>
                <img
                  src={HandcuffsIcon}
                  alt="Handbojor (Ikon)"
                  className={`${styles.handcuffsIcon}`}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Home;
