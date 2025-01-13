import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

function DeleteAccountModal({
  show,
  onClose,
  onDelete,
  password,
  onPasswordChange,
}) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Bekräfta radering</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Vänligen ange ditt lösenord för att radera kontot permanent.</p>
        <Form.Group controlId="deleteAccountPassword" className="mb-3">
          <Form.Label>Lösenord</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Avbryt
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Radera
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteAccountModal;
