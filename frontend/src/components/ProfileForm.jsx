import React from "react";
import { Form, Button } from "react-bootstrap";

function ProfileForm({ profileData, onChange, onSubmit }) {
  return (
    <Form onSubmit={onSubmit}>
      <Form.Group controlId="profileEmail" className="mb-3">
        <Form.Label>E-post</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={profileData.email}
          onChange={onChange}
          required
        />
      </Form.Group>
      <Form.Group controlId="profileName" className="mb-3">
        <Form.Label>Förnamn</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={profileData.name}
          onChange={onChange}
        />
      </Form.Group>
      <Form.Group controlId="profileSurname" className="mb-3">
        <Form.Label>Efternamn</Form.Label>
        <Form.Control
          type="text"
          name="surname"
          value={profileData.surname}
          onChange={onChange}
        />
      </Form.Group>
      <Form.Group controlId="profilePhone" className="mb-3">
        <Form.Label>Telefonnummer</Form.Label>
        <Form.Control
          type="text"
          name="phone_number"
          value={profileData.phone_number}
          onChange={onChange}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Uppdatera profil
      </Button>
    </Form>
  );
}

export default ProfileForm;
