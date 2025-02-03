import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import styles from "../styles/CookieBanner.module.css";

// Default setting – necessary cookies are always active
const DEFAULT_CONSENT = {
  necessary: true,
  analytics: false,
  marketing: false,
};

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState(DEFAULT_CONSENT);

  // On first render, check if we have already saved cookie settings
  useEffect(() => {
    const cookieConsent = Cookies.get("cookieConsent");
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  // Save settings in a cookie (valid for 365 days)
  const saveConsent = (consentData) => {
    Cookies.set("cookieConsent", JSON.stringify(consentData), { expires: 365 });
    setConsent(consentData);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAccept = () => {
    // Accept all cookies (necessary, analytics, and marketing)
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const handleReject = () => {
    // Reject all except necessary cookies
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const handleSaveSettings = () => {
    saveConsent(consent);
  };

  if (!showBanner) return null;

  return (
    <Container fluid className={`${styles["cookie-banner"]} p-5 py-4`}>
      {!showSettings ? (
        <Row className="align-items-center">
          <Col xs={12} md={8}>
            <p className="mb-2">
              Vi använder cookies för att förbättra din upplevelse, analysera
              trafik och anpassa annonser. Genom att fortsätta använda sidan
              godkänner du användningen av cookies. Läs vår{" "}
              <Link
                to="/cookie-policy"
                className={styles["cookie-policy-link"]}
              >
                cookiepolicy
              </Link>
              .
            </p>
          </Col>
          <Col xs={12} md={4} className="d-flex flex-wrap justify-content-end">
            <Button variant="primary" className="m-1" onClick={handleAccept}>
              Godkänn
            </Button>
            <Button variant="secondary" className="m-1" onClick={handleReject}>
              Neka
            </Button>
            <Button
              variant="info"
              className="m-1"
              onClick={() => setShowSettings(true)}
            >
              Cookie Inställningar
            </Button>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col xs={12}>
            <h3>Cookie Inställningar</h3>
            <p>
              Justera dina inställningar för cookies. Observera att nödvändiga
              cookies alltid är aktiva.
            </p>
            <Form>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Nödvändiga cookies (alltid aktiva)"
                  checked
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Analyscookies"
                  checked={consent.analytics}
                  onChange={(e) =>
                    setConsent({ ...consent, analytics: e.target.checked })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Marknadsföringscookies"
                  checked={consent.marketing}
                  onChange={(e) =>
                    setConsent({ ...consent, marketing: e.target.checked })
                  }
                />
              </Form.Group>
            </Form>
            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                className="m-1"
                onClick={handleSaveSettings}
              >
                Spara inställningar
              </Button>
              <Button
                variant="secondary"
                className="m-1"
                onClick={() => setShowSettings(false)}
              >
                Tillbaka
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default CookieBanner;
