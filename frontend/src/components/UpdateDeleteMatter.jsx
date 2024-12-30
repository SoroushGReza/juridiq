import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { axiosRes } from "../api/axiosDefaults";

const UpdateDeleteMatter = ({
  matter,
  showEditModal,
  showDeleteModal,
  handleCloseEdit,
  handleCloseDelete,
  fetchMatters,
  setError,
}) => {
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [hasFile, setHasFile] = useState(false);

  // Re-initialize local states each time edit-modal opens
  useEffect(() => {
    if (showEditModal && matter) {
      setEditTitle(matter.title || "");
      setEditDescription(matter.description || "");
      setHasFile(!!matter.file);
      setEditFile(null);
    }
  }, [showEditModal, matter]);

  const handleTitleChange = (e) => {
    setEditTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setEditDescription(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEditFile(file);
    setHasFile(!!file);
  };

  // ---- UPDATE MATTER ----
  const handleUpdateMatter = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", editTitle);
    formData.append("description", editDescription);

    if (editFile) {
      formData.append("file", editFile);
    }

    try {
      await axiosRes.patch(`/matters/${matter.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchMatters();
      handleCloseEdit();
    } catch (err) {
      setError("Kunde inte uppdatera ärendet. Försök igen senare.");
    }
  };

  // ---- DELETE FILE ONLY ----
  const handleDeleteFile = async () => {
    try {
      await axiosRes.patch(
        `/matters/${matter.id}/`,
        { file: null },
        { headers: { "Content-Type": "application/json" } }
      );
      setHasFile(false);
      fetchMatters();
    } catch (err) {
      setError("Kunde inte ta bort filen. Försök igen senare.");
    }
  };

  // ---- DELETE WHOLE MATTER ----
  const handleDeleteMatter = async () => {
    try {
      await axiosRes.delete(`/matters/${matter.id}/`);
      fetchMatters();
      handleCloseDelete();
    } catch (err) {
      setError("Kunde inte ta bort ärendet. Försök igen senare.");
    }
  };

  return (
    <>
      {/* EDIT MODAL */}
      <Modal show={showEditModal && matter !== null} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Redigera Ärende</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!matter ? (
            <p>Något gick fel – inget ärende valt.</p>
          ) : (
            <Form onSubmit={handleUpdateMatter}>
              <Form.Group controlId="editTitle" className="mb-3">
                <Form.Label>Titel</Form.Label>
                <Form.Control
                  type="text"
                  value={editTitle}
                  onChange={handleTitleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="editDescription">
                <Form.Label>Beskrivning</Form.Label>
                <Form.Control
                  as="textarea"
                  value={editDescription}
                  onChange={handleDescriptionChange}
                  required
                />
              </Form.Group>

              {hasFile ? (
                <Alert
                  variant="info"
                  className="mt-3 d-flex justify-content-between"
                >
                  <span>Nuvarande fil uppladdad</span>
                  <Button variant="danger" size="sm" onClick={handleDeleteFile}>
                    Ta bort fil
                  </Button>
                </Alert>
              ) : (
                <Form.Group controlId="editFile" className="mt-3">
                  <Form.Label>Lägg till/ändra fil (valfritt)</Form.Label>
                  <Form.Control type="file" onChange={handleFileChange} />
                </Form.Group>
              )}

              <Button type="submit" className="mt-3">
                Spara Ändringar
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* DELETE MATTER MODAL */}
      <Modal
        show={showDeleteModal && matter !== null}
        onHide={handleCloseDelete}
      >
        <Modal.Header closeButton>
          <Modal.Title>Bekräfta Radering</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Är du säker på att du vill ta bort ärendet?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Avbryt
          </Button>
          <Button variant="danger" onClick={handleDeleteMatter}>
            Ta bort
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateDeleteMatter;
