import React from "react";
import { Form, Button } from "react-bootstrap";
import styles from "../styles/Profile.module.css";

function ProfileForm({ profileData, onChange, onSubmit }) {
  return (
    <Form className={`${styles.profileForm} mb-4`} onSubmit={onSubmit}>
      <h1 className={`${styles["formHeader"]} text-center`}>Uppdatera Profil</h1>
      <Form.Group controlId="profileEmail" className="mb-3">
        <Form.Label className={`${styles.formLabel}`}>E-post</Form.Label>
        <Form.Control
          className={`${styles.formInput}`}
          type="email"
          name="email"
          value={profileData.email}
          onChange={onChange}
          required
        />
      </Form.Group>
      <Form.Group controlId="profileName" className="mb-3">
        <Form.Label className={`${styles.formLabel}`}>Förnamn</Form.Label>
        <Form.Control
          className={`${styles.formInput}`}
          type="text"
          name="name"
          value={profileData.name}
          onChange={onChange}
        />
      </Form.Group>
      <Form.Group controlId="profileSurname" className="mb-3">
        <Form.Label className={`${styles.formLabel}`}>Efternamn</Form.Label>
        <Form.Control
          className={`${styles.formInput}`}
          type="text"
          name="surname"
          value={profileData.surname}
          onChange={onChange}
        />
      </Form.Group>
      <Form.Group controlId="profilePhone" className="mb-3">
        <Form.Label className={`${styles.formLabel}`}>Telefonnummer</Form.Label>
        <Form.Control
          className={`${styles.formInput}`}
          type="text"
          name="phone_number"
          value={profileData.phone_number}
          onChange={onChange}
        />
      </Form.Group>
      <Button
        variant="primary"
        type="submit"
        className={`${styles.updateProfileButton} mb-3`}
      >
        Uppdatera profil
      </Button>
    </Form>
  );
}

export default ProfileForm;
