import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import EmailForm from "../components/EmailForm";
// Styling
import FormStyles from "../styles/FormStyles.module.css";
import styles from "../styles/Contact.module.css";
// Images
import FbImg from "../assets/images/facebook.png";
import EmailImage from "../assets/images/email.png";
import PhoneImage from "../assets/images/phone.png";
import LinkedinImg from "../assets/images/linkedin.png";
// Icons
import { FaPhone, FaWhatsapp } from "react-icons/fa";

function Contact() {
  return (
    <Container fluid className={FormStyles.pageContainer}>
      {/* Backgrouns Images */}
      <div className={styles.contactBackground}>
        <img src={FbImg} alt="Facebook Logo" className={styles.fbImage} />
        <img src={EmailImage} alt="Email Logo" className={styles.emailImage} />
        <img src={PhoneImage} alt="Phone Logo" className={styles.phoneImage} />
        <img src={LinkedinImg} alt="Linkedin Logo" className={styles.LIImg} />
      </div>
      <Row className="justify-content-center">
        <Col
          xs={12}
          md={8}
          lg={6}
          xl={4}
          className={`${FormStyles["formCol"]} mt-4 mb-4`}
        >
          <h1 className={`${FormStyles.pageHeader} mb-4 text-center`}>
            Kontakta oss
          </h1>

          {/* Email Component */}
          <EmailForm />

          {/* Phone Section */}
          <div className={FormStyles.formWrapper}>
            <Row className="justify-content-center">
              <h2 className={`${FormStyles.formHeader} text-center`}>
                Ring oss
              </h2>
              <Row className="mt-1 g-3 text-center align-items-center">
                <Col
                  xs={12}
                  sm={5}
                  md={5}
                  className="d-flex flex-column align-items-center"
                >
                  <div className="d-flex align-items-center gap-2">
                    <FaPhone className={styles.phoneIcon} />
                    <p className={styles.label}>Mobil:</p>
                  </div>
                  <span className={styles.phoneNumber}>0720 24 68 60</span>
                </Col>

                {/* Separator */}
                <Col xs={12} sm={2} className="d-flex justify-content-center">
                  <div className={styles.seperateLine}></div>
                </Col>

                <Col
                  xs={12}
                  sm={5}
                  md={5}
                  className="d-flex flex-column align-items-center"
                >
                  <div className="d-flex align-items-center gap-2">
                    <FaWhatsapp className={`${styles.icon} text-success`} />
                    <p className={styles.label}>WhatsApp:</p>
                  </div>
                  <a
                    href="https://wa.me/46720246860"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.phoneNumber}
                  >
                    +46 720 24 68 60
                  </a>
                </Col>
              </Row>
            </Row>
          </div>

          {/* Social Media */}
          <div className={FormStyles.formWrapper}>
            <Row className="justify-content-center">
              <Col xs={12} md={8} lg={6} xl={4} className={FormStyles.formCol}>
                <h2 className={`${FormStyles.formHeader} text-center`}>
                  Sociala Medier
                </h2>
                <div className="d-flex justify-content-center gap-4 mt-3">
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-facebook fa-2x"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-linkedin fa-2x"></i>
                  </a>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Contact;
