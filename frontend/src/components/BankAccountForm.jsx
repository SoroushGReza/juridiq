import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { axiosReq } from "../api/axiosDefaults";
import FormStyles from "../styles/FormStyles.module.css";

const BankAccountForm = ({ initialBankAccount }) => {
  const [bankAccount, setBankAccount] = useState(initialBankAccount || "");
  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLocalSuccess("");
    try {
      // Only update bank_account via PUT to the profile page
      await axiosReq.patch("/accounts/profile/", {
        bank_account: bankAccount,
      });
      setLocalSuccess("Bankkonto uppdaterat!");
    } catch (error) {
      console.error(error);
      setLocalError("Fel vid uppdatering av bankkonto. Försök igen.");
    }
  };

  return (
    <div className={FormStyles.formWrapper}>
      <Form onSubmit={handleSubmit} className="mt-2">
        <h1 className={`${FormStyles["formHeader"]} text-center`}>
          Bankkonto
        </h1>
        {localError && <Alert variant="danger">{localError}</Alert>}
        {localSuccess && <Alert variant="success">{localSuccess}</Alert>}
        <Form.Group controlId="bankAccount" className="mb-3">
          <Form.Label className={`${FormStyles["formLabel"]} text-start`}>
            Bankkonto (IBAN eller kontonummer)
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Ange ditt bankkonto"
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            className={`${FormStyles.formInput} text-start`}
          />
        </Form.Group>
        <Button
          className={`${FormStyles["greenBtn"]} mb-3`}
          variant="primary"
          type="submit"
        >
          Spara bankkonto
        </Button>
      </Form>
    </div>
  );
};

export default BankAccountForm;
