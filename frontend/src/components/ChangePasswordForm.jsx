import React from "react";
import { Form, Button } from "react-bootstrap";

function ChangePasswordForm({ passwordData, onChange, onSubmit }) {
  return (
    <Form onSubmit={onSubmit}>
      <Form.Group controlId="oldPassword" className="mb-3">
        <Form.Label>Gammalt lösenord</Form.Label>
        <Form.Control
          type="password"
          name="old_password"
          value={passwordData.old_password}
          onChange={onChange}
          required
        />
      </Form.Group>
      <Form.Group controlId="newPassword" className="mb-3">
        <Form.Label>Nytt lösenord</Form.Label>
        <Form.Control
          type="password"
          name="new_password"
          value={passwordData.new_password}
          onChange={onChange}
          required
        />
      </Form.Group>
      <Button variant="warning" type="submit">
        Byt lösenord
      </Button>
    </Form>
  );
}

export default ChangePasswordForm;
