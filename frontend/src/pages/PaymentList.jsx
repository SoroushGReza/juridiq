import React, { useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";

function PaymentList() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await axiosReq.get("/payments/");
        setPayments(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPayments();
  }, []);

  const handlePay = async (paymentId) => {
    try {
      const { data } = await axiosReq.post(
        `/payments/${paymentId}/create_checkout_session/`
      );
      if (data.url) {
        // Redirect user to Stripe checkout
        window.location.href = data.url;
      } else {
        alert("No checkout URL returned");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating checkout session");
    }
  };

  return (
    <div>
      <h2>My Payments</h2>
      <ul>
        {payments.map((payment) => (
          <li key={payment.id}>
            <strong>Matter:</strong> {payment.matter_title} |
            <strong>Amount:</strong> {payment.amount} SEK |
            <strong>Status:</strong> {payment.status}
            {payment.status === "pending" && (
              <button onClick={() => handlePay(payment.id)}>Pay Now</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PaymentList;
