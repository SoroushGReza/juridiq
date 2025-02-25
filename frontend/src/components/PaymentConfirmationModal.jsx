import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import styles from "../styles/PaymentConfirmationModal.module.css";

const PaymentConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  confirmPassword,
  setConfirmPassword,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className={styles.modalContainer}
    >
      <div className={styles.modalContent}>
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title>Fortsätt till betalning</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          <p className={styles.modalText}>
            Ange ditt lösenord för att gå vidare till betalningssidan.
          </p>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group controlId="username" className="d-none">
              <Form.Label>Användarnamn</Form.Label>
              <Form.Control type="text" autoComplete="username" />
            </Form.Group>

            <Form.Group controlId="confirmPassword">
              <Form.Label className={styles.formLabel}>Lösenord</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.inputField}
                autoComplete="new-password"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button className={styles.cancelButton} onClick={onHide}>
            Avbryt
          </Button>
          <Button className={styles.confirmButton} onClick={onConfirm}>
            Gå till betalning
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default PaymentConfirmationModal;
