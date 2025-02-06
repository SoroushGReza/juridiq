import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../styles/About.module.css";
import LOGO from "../assets/images/LOGO.svg";

const About = () => {
  return (
    <Container fluid className={`${styles.aboutContainer} p-0`}>
      <div className={styles.aboutBackground}></div>

      <div className={styles.aboutContent}>
        {/* Company Introduction Section */}
        <Row className="text-center p-5">
          <Col xs={12} md={11} className="mx-auto">
            <img src={LOGO} alt="Logo Image" className={styles.LogoImage} />
            <h1 className={styles.aboutHeading}>Om JuridiQ</h1>
            <p className={styles.introText}>
              Välkommen till JuridiQ – din moderna partner för alla juridiska
              behov. Vi kombinerar traditionell juridisk expertis med innovativa
              lösningar för att erbjuda dig förstklassig service.
            </p>
          </Col>
        </Row>

        {/* Mission and Vision Section */}
        <Row className="p-3">
          <Col xs={12} md={5} className={`${styles.customCol} mx-auto`}>
            <h2 className={`${styles.sectionTitle} text-center`}>
              Vårt Uppdrag
            </h2>
            <p className={styles.sectionParagraph}>
              På JuridiQ är vårt uppdrag att göra juridik begriplig och
              tillgänglig för alla. Vi arbetar målmedvetet för att ge dig
              rättslig rådgivning som är både pålitlig och anpassad efter dina
              behov.
            </p>
          </Col>
          <Col xs={12} md={5} className={`${styles.customCol} mx-auto`}>
            <h2 className={`${styles.sectionTitle} text-center`}>Vår Vision</h2>
            <p className={styles.sectionParagraph}>
              Vår vision är att vara den ledande aktören inom juridiska tjänster
              i Sverige, där innovation och expertis samverkar för att sätta
              klienten i centrum.
            </p>
          </Col>
        </Row>

        {/* Values and History Section */}
        <Row className="p-3">
          <Col xs={12} md={5} className={`${styles.customCol} mx-auto`}>
            <h2 className={`${styles.sectionTitle} text-center`}>
              Våra Värderingar
            </h2>
            <p className={styles.sectionParagraph}>
              Integritet, professionalism och personligt engagemang är kärnan i
              allt vi gör. Varje klient behandlas med största respekt och
              omsorg, vilket garanterar en trygg och transparent process.
            </p>
          </Col>
          <Col xs={12} md={5} className={`${styles.customCol} mx-auto`}>
            <h2 className={`${styles.sectionTitle} text-center`}>
              Vår Historia
            </h2>
            <p className={styles.sectionParagraph}>
              JuridiQ grundades med en stark vision om att revolutionera den
              juridiska branschen. Med ett team av erfarna jurister och
              rådgivare har vi som mål att snabbt etablera oss som en pålitlig
              partner för både privatpersoner och företag.
            </p>
          </Col>
        </Row>

        {/* Team Section */}
        <Row className="p-3">
          <Col
            lg={8}
            md={6}
            sm={12}
            xs={12}
            className={`${styles.customCol} mx-auto`}
          >
            <h2 className={`${styles.sectionTitle} text-center`}>Vårt Team</h2>
            <p className={styles.sectionParagraph}>
              Vårt dedikerade team består av jurister och rådgivare med djup
              kompetens inom olika juridiska områden. Tillsammans arbetar vi för
              att säkerställa att du alltid får den bästa möjliga juridiska
              rådgivningen.
            </p>
          </Col>
        </Row>

        {/* Contact Section */}
        <Row className="text-center p-3 mb-5">
          <Col
            lg={8}
            md={6}
            sm={12}
            xs={12}
            className={`${styles.customCol} mx-auto`}
          >
            <h2 className={styles.sectionTitle}>Kontakta Oss</h2>
            <p className={styles.sectionParagraph}>
              Har du frågor eller önskar en kostnadsfri konsultation? Tveka inte
              att{" "}
              <Link to="/contact" className={styles.link}>
                kontakta oss
              </Link>{" "}
              – vi finns här för att hjälpa dig!
            </p>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default About;
