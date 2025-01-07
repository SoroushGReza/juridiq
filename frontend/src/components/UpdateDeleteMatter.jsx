import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { axiosRes } from "../api/axiosDefaults";
import styles from "../styles/CreateUpdateModals.module.css";

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
  onDeleteSuccess,
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

  // Truncate file name
  const trimFileName = (fileName, maxLength = 35) => {
    if (fileName.length > maxLength) {
      return `${fileName.substring(0, maxLength)}...`;
    }
    return fileName;
  };

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
      fetchMatters(); // Update list of matters
      handleCloseDelete(); // Close Modal

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
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
      <Modal
        className={`${styles.createModal}`}
        show={showEditModal && matter !== null}
        onHide={handleCloseEdit}
      >
        <Modal.Header className={`${styles.modalHeader}`} closeButton>
          <Modal.Title className={`${styles.modalTitle}`}>
            Redigera Ärende
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${styles.modalBody}`}>
          {!matter ? (
            <p>Något gick fel – inget ärende valt.</p>
          ) : (
            <Form onSubmit={handleUpdateMatter}>
              <Form.Group controlId="editTitle" className="mb-3">
                <Form.Label className={`${styles.modalLabel}`}>
                  Titel
                </Form.Label>
                <Form.Control
                  className={`${styles.customInput}`}
                  type="text"
                  value={editTitle}
                  onChange={handleChangeTitle}
                  required
                />
              </Form.Group>

              <Form.Group controlId="editDescription">
                <Form.Label className={`${styles.modalLabel}`}>
                  Beskrivning
                </Form.Label>
                <Form.Control
                  className={`${styles.customInput}`}
                  as="textarea"
                  value={editDescription}
                  onChange={handleChangeDescription}
                  required
                />
              </Form.Group>

              {/* List existing files */}
              {visibleExistingFiles.length > 0 && (
                <div className="mt-3">
                  <h5 className={`${styles.modalLabel}`}>Befintliga filer:</h5>
                  {visibleExistingFiles.map((fileObj) => (
                    <Alert
                      key={fileObj.id}
                      variant="dark"
                      className="d-flex justify-content-between align-items-center"
                    >
                      <a
                        className={`${styles.fileName}`}
                        href={fileObj.file}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {trimFileName(
                          decodeURIComponent(fileObj.file.split("/").pop())
                        )}
                      </a>
                      <Button
                        className={`${styles.deleteFromList}`}
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
                <Form.Label className={`${styles.modalLabel}`}>
                  Lägg till nya filer (valfritt)
                </Form.Label>
                <Form.Control
                  className={`${styles.customInput} ${styles.customFileInput}`}
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
              </Form.Group>

              <Button
                type="submit"
                className={`${styles.updateBtn} mt-4 w-100`}
              >
                Spara Ändringar
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* DELETE MATTER MODAL */}
      <Modal
        className={`${styles.createModal}`}
        show={showDeleteModal && matter !== null}
        onHide={handleCloseDelete}
      >
        <Modal.Header className={`${styles.deleteModalHeader}`} closeButton>
          <Modal.Title className={`${styles.deleteModalTitle}`}>
            Bekräfta Radering
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${styles.deleteModalBody}`}>
          <p>Är du säker på att du vill ta bort ärendet?</p>
        </Modal.Body>
        <Modal.Footer className={`${styles.deleteModalFooter}`}>
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
