import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import styles from "../styles/CreateUpdateModals.module.css";

function DeleteAccountModal({
  show,
  onClose,
  onDelete,
  password,
  onPasswordChange,
}) {
  return (
    <Modal
      className={`${styles.createModal}`}
      show={show}
      onHide={onClose}
      centered
    >
      <Modal.Header className={`${styles.deleteModalHeader}`} closeButton>
        <Modal.Title className={`${styles.deleteModalTitle}`}>
          Bekräfta radering
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={`${styles.deleteModalBody}`}>
        <p>Vänligen ange ditt lösenord för att radera kontot permanent.</p>
        <Form.Group controlId="deleteAccountPassword" className="mb-3">
          <Form.Label>Lösenord</Form.Label>
          <Form.Control
            className={`${styles["customInput"]} text-start`}
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className={`${styles.deleteModalFooter}`}>
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
