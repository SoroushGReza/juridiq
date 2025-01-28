import React, { useState, useEffect } from "react";
import { Button, Alert } from "react-bootstrap";
import { axiosReq } from "../api/axiosDefaults";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus";

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
      <Button variant="secondary" disabled>
        Laddar...
      </Button>
    );
  if (error) return <Alert variant="danger">{error}</Alert>;

  if (isAdmin) {
    return (
      <Button
        variant="warning"
        disabled={!!payment}
        onClick={handleRequestPayment}
      >
        {payment ? "Betalning Begärd" : "Begär Betalning"}
      </Button>
    );
  }

  if (payment && payment.status === "pending" && payment.user === userId) {
    return (
      <Button variant="primary" onClick={handlePay}>
        Betala
      </Button>
    );
  }

  return (
    <Button variant="secondary" disabled>
      {payment?.status === "paid" ? "Betald" : "Betala"}
    </Button>
  );
};

export default PaymentButton;
