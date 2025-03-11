import React, { useState, useEffect } from "react";
import { Button, Alert } from "react-bootstrap";
import { axiosReq } from "../api/axiosDefaults";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus";
import styles from "../styles/PaymentButton.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import PaymentConfirmationModal from "./PaymentConfirmationModal";

const PaymentButton = () => {
  const { id } = useParams(); // Matter ID
  const navigate = useNavigate();
  const { userId, isAdmin, isDelegatedAdmin } = useAuthStatus();
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

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
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      console.debug(
        "Initiating extra autentisering for payment id:",
        payment.id
      );
      const { data } = await axiosReq.post(
        `/payments/${payment.id}/create_checkout_session/`,
        { confirm_password: confirmPassword }
      );
      window.location.href = data.url; // Navigate to Stripe Checkout
    } catch (err) {
      setError(
        "Kunde inte skapa Stripe-session. Kontrollera lösenordet och försök igen."
      );
    }
    setShowConfirmModal(false);
    setConfirmPassword("");
  };

  const handleRequestPayment = () => {
    navigate(`/admin-create-payment?matter_id=${id}`);
  };

  return (
    <>
      {loading ? (
        <Button className={styles.button} variant="secondary" disabled>
          Laddar...
        </Button>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : payment?.status === "paid" ? (
        <Button className={`${styles.paidContainer} me-3`} disabled>
          Betald{" "}
          <FontAwesomeIcon icon={faCheckCircle} className={styles.paidIcon} />
        </Button>
      ) : isAdmin ? (
        <Button
          className={`${styles.adminBtns} me-3`}
          disabled={!!payment}
          onClick={handleRequestPayment}
        >
          {payment ? "Betalning Begärd" : "Begär Betalning"}
        </Button>
      ) : isDelegatedAdmin ? (
        // If user is delegated admin, show a similar scenario as admin:
        !payment ? (
          <Button
            className={`${styles.adminBtns} me-3`}
            onClick={handleRequestPayment}
          >
            Begär Betalning
          </Button>
        ) : (
          <Button className={`${styles.adminBtns} me-3`} disabled>
            Betalning redan begärd
          </Button>
        )
      ) : payment && payment.status === "pending" && payment.user === userId ? (
        <Button className={`${styles.payBtn} me-3`} onClick={handlePay}>
          Betala
        </Button>
      ) : (
        <Button className={`${styles.payBtn} me-3`} disabled>
          Betala
        </Button>
      )}
      <PaymentConfirmationModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
      />
    </>
  );
};

export default PaymentButton;
