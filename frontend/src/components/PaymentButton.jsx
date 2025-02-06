import React, { useState, useEffect } from "react";
import { Button, Alert } from "react-bootstrap";
import { axiosReq } from "../api/axiosDefaults";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus";
import styles from "../styles/PaymentButton.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const PaymentButton = () => {
  const { id } = useParams(); // Matter ID
  const navigate = useNavigate();
  const { userId, isAdmin } = useAuthStatus();
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const { data: payments } = await axiosReq.get(
          `/payments/?matter=${id}`
        );
        if (payments.length > 0) {
          setPayment(payments[0]);
        } else {
          setPayment(null);
        }
      } catch (err) {
        setError("Kunde inte hämta betalningsstatus.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);

  const handlePay = async () => {
    if (!payment || payment.status !== "pending") return;

    try {
      const { data } = await axiosReq.post(
        `/payments/${payment.id}/create_checkout_session/`
      );
      window.location.href = data.url; // Navigate user to Stripe Checkout
    } catch (err) {
      setError("Kunde inte skapa Stripe-session.");
    }
  };

  const handleRequestPayment = () => {
    navigate(`/admin-create-payment?matter_id=${id}`);
  };

  if (loading)
    return (
      <Button className={styles.button} variant="secondary" disabled>
        Laddar...
      </Button>
    );
  if (error) return <Alert variant="danger">{error}</Alert>;

  if (payment?.status === "paid") {
    return (
      <Button className={`${styles.paidContainer} me-3`}disabled>
        Betald{" "}
        <FontAwesomeIcon icon={faCheckCircle} className={styles.paidIcon} />
      </Button>
    );
  }

  if (isAdmin) {
    return (
      <Button
        className={`${styles.adminBtns} me-3`}
        disabled={!!payment}
        onClick={handleRequestPayment}
      >
        {payment ? "Betalning Begärd" : "Begär Betalning"}
      </Button>
    );
  }

  if (payment && payment.status === "pending" && payment.user === userId) {
    return (
      <Button className={`${styles.payBtn} me-3`} onClick={handlePay}>
        Betala
      </Button>
    );
  }

  return (
    <Button className={`${styles.payBtn} me-3`} disabled>
      Betala
    </Button>
  );
};

export default PaymentButton;
