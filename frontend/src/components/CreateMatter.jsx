import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { axiosReq } from "../api/axiosDefaults";
import styles from "../styles/CreateUpdateModals.module.css";

const CreateMatter = ({ show, handleClose, fetchMatters, setError }) => {
  const [newMatter, setNewMatter] = useState({
    title: "",
    description: "",
    files: [],
  });
  const [localError, setLocalError] = useState("");

  // Reset error whene modal closes
  useEffect(() => {
    if (!show) {
      setLocalError("");
    }
  }, [show]);

  const handleChange = (e) => {
    setNewMatter((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle several files with "multiple"
  const handleFileChange = (e) => {
    const fileList = Array.from(e.target.files); // FileList -> Array
    setNewMatter((prev) => ({
      ...prev,
      files: fileList,
    }));
  };

  const handleCreateMatter = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", newMatter.title);
      formData.append("description", newMatter.description);
      newMatter.files.forEach((file) => {
        formData.append("new_files", file);
      });

      await axiosReq.post("/matters/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update list of matters
      fetchMatters();

      // Reset form
      setNewMatter({ title: "", description: "", files: [] });
      setLocalError("");
      handleClose();
    } catch (err) {
      if (err.response?.status >= 400 && err.response?.status < 500) {
        const errorData = err.response.data;
        let combinedError = "";

        if (errorData.new_files) {
          Object.values(errorData.new_files).forEach((errorArray) => {
            if (Array.isArray(errorArray)) {
              combinedError += errorArray.join(" ") + " ";
            }
          });
        }
        if (errorData.non_field_errors) {
          combinedError += errorData.non_field_errors.join(" ") + " ";
        }

        setLocalError(
          combinedError.trim() || "Kunde inte skapa ärende. Försök igen."
        );
      } else {
        setLocalError(
          "Kunde inte skapa ärende. Kontrollera data och försök igen."
        );
      }
    }
  };

  return (
    <Modal className={`${styles.createModal}`} show={show} onHide={handleClose}>
      <Modal.Header className={`${styles.modalHeader}`} closeButton>
        <Modal.Title className={`${styles.modalTitle}`}>
          Skapa Ärende
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={`${styles.modalBody}`}>
        {localError && <Alert variant="danger">{localError}</Alert>}
        <Form onSubmit={handleCreateMatter}>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label className={`${styles.modalLabel}`}>Titel</Form.Label>
            <Form.Control
              className={`${styles.customInput}`}
              type="text"
              placeholder="Ange en kort titel"
              name="title"
              value={newMatter.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label className={`${styles.modalLabel}`}>
              Beskrivning
            </Form.Label>
            <Form.Control
              className={`${styles.customInput}`}
              as="textarea"
              name="description"
              placeholder="Vad gäller ärendet?"
              value={newMatter.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="files" className="mt-3">
            <Form.Label className={`${styles.modalLabel}`}>
              Filer (valfritt)
            </Form.Label>
            <Form.Control
              className={`${styles.customInput} ${styles.customFileInput}`}
              type="file"
              multiple
              onChange={handleFileChange}
            />
          </Form.Group>

          <Button type="submit" className={`${styles.createBtn} mt-4 w-100`}>
            Skapa Ärende
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateMatter;
