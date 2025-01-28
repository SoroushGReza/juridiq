import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { axiosReq } from "../api/axiosDefaults";

const AdminCreatePayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const matterId = searchParams.get("matter_id"); // Get matter_id from URL
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
      // Check if a payment already exists
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

      // Create payment
      await axiosReq.post(`/payments/create/${matterId}/`, {
        amount: parseFloat(amount),
      });

      setSuccess("Betalningsbegäran skapad!");

      // Update localStorage to disable the button
      localStorage.setItem(`payment_status_${matterId}`, "pending");

      setTimeout(() => {
        navigate(`/matters/${matterId}`);
      }, 1500);
    } catch (err) {
      setError("Misslyckades att skapa betalningen. Kontrollera backend.");
    }
  };

  return (
    <div>
      <h2>Skapa Betalning</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <label>Belopp:</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={handleCreatePayment}>Skapa Betalning</button>
    </div>
  );
};

export default AdminCreatePayment;
