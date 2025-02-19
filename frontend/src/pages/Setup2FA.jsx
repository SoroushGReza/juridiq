import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosReq } from "../api/axiosDefaults";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
  Spinner,
} from "react-bootstrap";

const Setup2FA = () => {
  const [data, setData] = useState(null);
  const [totpCode, setTotpCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSetup = async () => {
      try {
        const response = await axiosReq.get("/accounts/2fa/setup/");
        setData(response.data);
      } catch (err) {
        console.error(err);
        setError("Kunde inte hämta 2FA-setup data.");
      }
    };
    fetchSetup();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axiosReq.post("/accounts/2fa/activate/", {
        totp_code: totpCode,
      });
      setInfo(response.data.detail);
      // When successful, wait a bit and then navigate to the homepage
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Ett fel inträffade.");
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="mb-4 text-center">Ställ in tvåstegsverifiering</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              {info && <Alert variant="success">{info}</Alert>}
              {data ? (
                <>
                  <p>
                    Skanna QR-koden med din Authenticator-app (t.ex. Google
                    Authenticator eller Microsoft Authenticator) eller skriv in
                    den hemliga nyckeln nedan.
                  </p>
                  <div className="text-center mb-3">
                    <img
                      src={data.qr_code}
                      alt="QR Code"
                      className="img-fluid"
                      style={{ maxWidth: "200px" }}
                    />
                  </div>
                  <p className="mb-4">
                    <strong>Hemlig nyckel:</strong> {data.totp_secret}
                  </p>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="totpCode" className="mb-3">
                      <Form.Label>
                        Ange den TOTP‑kod som genereras av din app
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="6-siffrig kod"
                        value={totpCode}
                        onChange={(e) => setTotpCode(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <div className="d-grid">
                      <Button variant="primary" type="submit">
                        Aktivera 2FA
                      </Button>
                    </div>
                  </Form>
                </>
              ) : (
                <div className="text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Laddar...</span>
                  </Spinner>
                  <p className="mt-3">Laddar 2FA-setup data...</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Setup2FA;
