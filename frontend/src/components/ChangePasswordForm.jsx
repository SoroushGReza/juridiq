import React from "react";
import { Form, Button } from "react-bootstrap";
import styles from "../styles/Profile.module.css";

function ChangePasswordForm({ passwordData, onChange, onSubmit }) {
  return (
    <div className={styles.formWrapper}>
      <Form className={`${styles.profileForm}`} onSubmit={onSubmit}>
        <h1 className={`${styles["formHeader"]} text-center`}>
          Ändra Lösenord
        </h1>
        <Form.Group controlId="oldPassword" className="mb-3">
          <Form.Label className={`${styles.formLabel}`}>
            Gammalt lösenord
          </Form.Label>
          <Form.Control
            className={`${styles.formInput}`}
            type="password"
            name="old_password"
            value={passwordData.old_password}
            onChange={onChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="newPassword" className="mb-3">
          <Form.Label className={`${styles.formLabel}`}>
            Nytt lösenord
          </Form.Label>
          <Form.Control
            className={`${styles.formInput}`}
            type="password"
            name="new_password"
            value={passwordData.new_password}
            onChange={onChange}
            required
          />
        </Form.Group>
        <Button
          className={`${styles.updatePasswordButton} mb-3`}
          variant="warning"
          type="submit"
        >
          Byt lösenord
        </Button>
      </Form>
    </div>
  );
}

export default ChangePasswordForm;
