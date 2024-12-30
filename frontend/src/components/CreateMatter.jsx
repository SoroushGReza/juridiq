import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { axiosReq } from "../api/axiosDefaults";

const CreateMatter = ({ show, handleClose, fetchMatters, setError }) => {
  const [newMatter, setNewMatter] = useState({
    title: "",
    description: "",
    file: null,
  });

  const handleTitleChange = (e) => {
    setNewMatter((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  const handleDescriptionChange = (e) => {
    setNewMatter((prev) => ({
      ...prev,
      description: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setNewMatter((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  const handleCreateMatter = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newMatter.title);
    formData.append("description", newMatter.description);
    if (newMatter.file) {
      formData.append("file", newMatter.file);
    }

    try {
      await axiosReq.post("/matters/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Update list of matters
      fetchMatters();
      // Reset form
      setNewMatter({ title: "", description: "", file: null });
      handleClose();
    } catch (err) {
      setError(
        "Kunde inte skapa ärende. Kontrollera din data och försök igen."
      );
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Skapa Ärende</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleCreateMatter}>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label>Titel</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ange en kort titel"
              value={newMatter.title}
              onChange={handleTitleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Beskrivning</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Vad gäller ärendet?"
              value={newMatter.description}
              onChange={handleDescriptionChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="file" className="mt-3">
            <Form.Label>Fil (valfritt)</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>

          <Button type="submit" className="mt-3">
            Skapa Ärende
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateMatter;
