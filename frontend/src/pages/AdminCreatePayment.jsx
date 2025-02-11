import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { axiosReq } from "../api/axiosDefaults";
import styles from "../styles/AdminCreatePayment.module.css";
import formStyles from "../styles/FormStyles.module.css";
import stripeLogo from "../assets/images/stripe.svg";

const AdminCreatePayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const matterId = searchParams.get("matter_id");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!matterId) {
      setError("Fel: Ingen ärende-ID hittades.");
    }
  }, [matterId]);

  const handleCreatePayment = async () => {
    if (!matterId || !amount) {
      setError("Vänligen ange ett belopp.");
      return;
    }

    try {
      const { data: payments } = await axiosReq.get(
        `/payments/?matter=${matterId}`
      );
      const existingPayment = payments.find(
        (p) => p.matter === parseInt(matterId) && p.status === "pending"
      );

      if (existingPayment) {
        setError(
          "Det finns redan en aktiv betalningsbegäran för detta ärende."
        );
        return;
      }

      await axiosReq.post(`/payments/create/${matterId}/`, {
        amount: parseFloat(amount),
      });

      setSuccess("Betalningsbegäran skapad!");
      localStorage.setItem(`payment_status_${matterId}`, "pending");

      setTimeout(() => {
        navigate(`/matters/${matterId}`);
      }, 1500);
    } catch (err) {
      setError("Misslyckades att skapa betalningen. Kontrollera backend.");
    }
  };

  return (
    <Container fluid className={styles.paymentContainer}>
      {/* --------------- Background Image --------------- */}
      <div className={styles.paymentBackground}></div>

      <Row className="justify-content-center">
        <Col
          xs={9}
          md={6}
          lg={5}
          xl={4}
          className={`${styles.formCol} mt-4 mb-4`}
        >
          <h1 className={`${styles.pageHeader} text-center mb-4`}>
            Begär Betalning
          </h1>
          {/* Success Massage */}
          {success && <Alert variant="success">{success}</Alert>}
          
          <div className={formStyles.formWrapper}>
            <Form className={`${formStyles.profileForm}`}>
              {/* Stripe Payment Methods Image */}
              <div className="text-center mb-3">
                <img
                  src={stripeLogo}
                  alt="Stripe Logo"
                  className={styles.stripeLogo}
                />
              </div>
              <Form.Group className="mb-3">
                <Form.Label className={`${formStyles.formLabel}`}>
                  Ange Belopp (SEK)
                </Form.Label>
                <Form.Control
                  className={`${formStyles.formInput}`}
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  isInvalid={!!error}
                />
                {error && (
                  <Form.Text className="text-danger">{error}</Form.Text>
                )}
              </Form.Group>

              <Button
                className={`${styles.createPaymentButton} mb-3`}
                onClick={handleCreatePayment}
              >
                Skapa Betalning
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminCreatePayment;
