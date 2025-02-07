import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FaLinkedin, FaFacebook } from "react-icons/fa"; // Importera Facebook-ikonen
import styles from "../../src/styles/Footer.module.css";
import Logo from "../assets/images/JQ.svg";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4" role="contentinfo">
      <Container>
        <Row className="justify-content-center">
          {/* Quick links */}
          <Col xs={12} md={4} className="text-center mb-4">
            <h6 className={styles.footerHeadings}>Snabblänkar</h6>
            <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">
              <NavLink
                to="/contact"
                className={`${styles.footerLinks} text-white text-decoration-none`}
              >
                Kontakt
              </NavLink>
              <span className={styles.footerSeperator}>|</span>
              <NavLink
                to="/about"
                className={`${styles.footerLinks} text-white text-decoration-none`}
              >
                Om oss
              </NavLink>
              <span className={styles.footerSeperator}>|</span>
              <NavLink
                to="/privacy-policy"
                className={`${styles.footerLinks} text-white text-decoration-none`}
              >
                Integritetspolicy
              </NavLink>
            </div>
          </Col>

          {/* Company Logo */}
          <Col xs={12} md={4} className="text-center mb-4">
            <img
              src={Logo}
              alt="JuridiQ Logotyp"
              className={styles.companyLogo}
            />
          </Col>

          {/* Social Links */}
          <Col xs={12} md={4} className="text-center mb-4">
            <h6 className={styles.footerHeadings}>Följ oss på</h6>
            <div className="d-flex justify-content-center align-items-center gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialLinks} text-white`}
                aria-label="Följ oss på LinkedIn"
              >
                <FaLinkedin size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialLinks} text-white`}
                aria-label="Följ oss på Facebook"
              >
                <FaFacebook size={18} />
              </a>
            </div>
          </Col>
        </Row>

        {/* Copyright */}
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
