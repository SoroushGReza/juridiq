import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { axiosRes } from "../api/axiosDefaults";

// Fetch matter details (inc. files)
const fetchMatterDetail = async (id) => {
  const { data } = await axiosRes.get(`/matters/${id}/`);
  return data;
};

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

  // New files to upload
  const [newFiles, setNewFiles] = useState([]);
  // List of exisitng files
  const [existingFiles, setExistingFiles] = useState([]);
  // Files to delete by ID
  const [removeFileIds, setRemoveFileIds] = useState([]);

  // Get matter info when modal opens
  useEffect(() => {
    const loadMatter = async () => {
      if (matter && showEditModal) {
        try {
          const detail = await fetchMatterDetail(matter.id);
          setEditTitle(detail.title || "");
          setEditDescription(detail.description || "");
          setExistingFiles(detail.files || []);
          setNewFiles([]);
          setRemoveFileIds([]);
        } catch (err) {
          setError("Kunde inte hämta ärendedetaljer.");
        }
      }
    };
    if (showEditModal) {
      loadMatter();
    }
  }, [matter, showEditModal, setError]);

  // Change titel/description
  const handleChangeTitle = (e) => setEditTitle(e.target.value);
  const handleChangeDescription = (e) => setEditDescription(e.target.value);

  // Add new files
  const handleFileChange = (e) => {
    const fileList = Array.from(e.target.files);
    setNewFiles(fileList);
  };

  // Add a files ID to removeFileIds
  const handleRemoveExistingFile = (fileId) => {
    setRemoveFileIds((prev) => [...prev, fileId]);
  };

  // ---- Save changes (PATCH) ----
  const handleUpdateMatter = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("description", editDescription);

      removeFileIds.forEach((id) => {
        formData.append("remove_file_ids", id);
      });

      newFiles.forEach((file) => {
        formData.append("new_files", file);
      });

      await axiosRes.patch(`/matters/${matter.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update list of matters
      fetchMatters();

      handleCloseEdit();
    } catch (err) {
      setError("Kunde inte uppdatera ärendet. Försök igen senare.");
    }
  };

  // ---- DELETE WHOLE MATTER ----
  const handleDeleteMatter = async () => {
    try {
      await axiosRes.delete(`/matters/${matter.id}/`);
      // Uppdate list of matters
      fetchMatters();
      handleCloseDelete();
    } catch (err) {
      setError("Kunde inte ta bort ärendet. Försök igen senare.");
    }
  };

  const visibleExistingFiles = existingFiles.filter(
    (f) => !removeFileIds.includes(f.id)
  );

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
                  onChange={handleChangeTitle}
                  required
                />
              </Form.Group>

              <Form.Group controlId="editDescription">
                <Form.Label>Beskrivning</Form.Label>
                <Form.Control
                  as="textarea"
                  value={editDescription}
                  onChange={handleChangeDescription}
                  required
                />
              </Form.Group>

              {/* List existing files */}
              {visibleExistingFiles.length > 0 && (
                <div className="mt-3">
                  <h5>Befintliga filer:</h5>
                  {visibleExistingFiles.map((fileObj) => (
                    <Alert
                      key={fileObj.id}
                      variant="info"
                      className="d-flex justify-content-between align-items-center"
                    >
                      <a
                        href={fileObj.file}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {fileObj.file.split("/").pop()} {/* Show file name */}
                      </a>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveExistingFile(fileObj.id)}
                      >
                        Ta bort
                      </Button>
                    </Alert>
                  ))}
                </div>
              )}

              {/* Upload new files */}
              <Form.Group controlId="editFile" className="mt-3">
                <Form.Label>Lägg till nya filer (valfritt)</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
              </Form.Group>

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
