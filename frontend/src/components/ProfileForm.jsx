import React from "react";
import { Form, Button } from "react-bootstrap";
import styles from "../styles/Profile.module.css";
import FormStyles from "../styles/FormStyles.module.css";

function ProfileForm({ profileData, onChange, onSubmit }) {
  return (
    <div className={FormStyles.formWrapper}>
      <Form onSubmit={onSubmit}>
        <h1 className={`${FormStyles["formHeader"]} text-center`}>
          Uppdatera Profil
        </h1>
        <Form.Group controlId="profileEmail" className="mb-3">
          <Form.Label className={`${FormStyles["formLabel"]} text-start`}>E-post</Form.Label>
          <Form.Control
            className={`${FormStyles["formInput"]} text-start`}
            type="email"
            name="email"
            value={profileData.email}
            onChange={onChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="profileName" className="mb-3">
          <Form.Label className={`${FormStyles["formLabel"]} text-start`}>Förnamn</Form.Label>
          <Form.Control
            className={`${FormStyles["formInput"]} text-start`}
            type="text"
            name="name"
            value={profileData.name}
            onChange={onChange}
          />
        </Form.Group>
        <Form.Group controlId="profileSurname" className="mb-3">
          <Form.Label className={`${FormStyles["formLabel"]} text-start`}>Efternamn</Form.Label>
          <Form.Control
            className={`${FormStyles["formInput"]} text-start`}
            type="text"
            name="surname"
            value={profileData.surname}
            onChange={onChange}
          />
        </Form.Group>
        <Form.Group controlId="profilePhone" className="mb-3">
          <Form.Label className={`${FormStyles["formLabel"]} text-start`}>
            Telefonnummer
          </Form.Label>
          <Form.Control
            className={`${FormStyles["formInput"]} text-start`}
            type="text"
            name="phone_number"
            value={profileData.phone_number}
            onChange={onChange}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          className={`${FormStyles.blueButton} mb-3`}
        >
          Uppdatera profil
        </Button>
      </Form>
    </div>
  );
}

export default ProfileForm;
