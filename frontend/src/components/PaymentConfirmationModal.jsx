import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const PaymentConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  confirmPassword,
  setConfirmPassword,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Bekräfta Betalning</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="confirmPassword">
          <Form.Label>
            Ange ditt lösenord för att komma till betalning
          </Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Avbryt
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Bekräfta
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentConfirmationModal;
