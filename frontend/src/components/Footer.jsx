import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FaLinkedin } from "react-icons/fa";
import styles from "../../src/styles/Footer.module.css";
import Logo from "../assets/images/JQ.svg";

const Footer = () => {
  return (
    <footer className={`bg-dark text-white py-4`}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={6} md={4} className="text-center mb-4">
            <h6 className={`${styles["footerHeadings"]}`}>Snabblänkar</h6>
            <div className="d-flex justify-content-center gap-3">
              <NavLink
                to="/contact"
                className={`${styles["footerLinks"]} text-white text-decoration-none`}
              >
                Kontakt
              </NavLink>
              <span className={styles.footerSeperator}>|</span>
              <NavLink
                to="/about"
                className={`${styles["footerLinks"]} text-white text-decoration-none`}
              >
                Om oss
              </NavLink>
            </div>
          </Col>
          <Col xs={0} md={4} className="text-center d-none d-md-block">
            <img
              src={Logo}
              alt="JuridiQ Logo"
              className={`${styles["companyLogo"]}`}
            />
          </Col>
          <Col xs={6} md={4} className="text-center mb-4">
            <h6 className={`${styles["footerHeadings"]}`}>Följ oss på</h6>
            <div className="d-flex justify-content-center gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles["linkedIn"]} text-white`}
              >
                <FaLinkedin size={18} />
              </a>
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-center">
            <small>
              &copy; {new Date().getFullYear()} JuridiQ. Alla rättigheter
              reserverade.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
