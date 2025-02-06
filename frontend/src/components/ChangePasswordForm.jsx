import React from "react";
import { Form, Button } from "react-bootstrap";
import FormStyles from "../styles/FormStyles.module.css";

function ChangePasswordForm({ passwordData, onChange, onSubmit }) {
  return (
    <div className={FormStyles.formWrapper}>
      <Form onSubmit={onSubmit}>
        <h1 className={`${FormStyles["formHeader"]} text-center`}>
          Ändra Lösenord
        </h1>
        <Form.Group controlId="oldPassword" className="mb-3">
          <Form.Label className={`${FormStyles["formLabel"]} text-start`}>
            Gammalt lösenord <span className={FormStyles.labelSpan}>*</span>
          </Form.Label>
          <Form.Control
            className={`${FormStyles["formInput"]} text-start`}
            type="password"
            name="old_password"
            value={passwordData.old_password}
            onChange={onChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="newPassword" className="mb-3">
          <Form.Label className={`${FormStyles["formLabel"]} text-start`}>
            Nytt lösenord <span className={FormStyles.labelSpan}>*</span>
          </Form.Label>
          <Form.Control
            className={`${FormStyles["formInput"]} text-start`}
            type="password"
            name="new_password"
            value={passwordData.new_password}
            onChange={onChange}
            required
          />
        </Form.Group>
        <Button
          className={`${FormStyles["yellowBtn"]} mb-3`}
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
