import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, Button, Container, Row, Col } from "react-bootstrap";
import { axiosReq } from "../api/axiosDefaults";
import UpdateDeleteMatter from "../components/UpdateDeleteMatter";
import styles from "../styles/Matter.module.css";
import TXTViewer from "../components/TXTViewer";
import Status from "../components/Status";
import LoadingSpinner from "../components/LoadingSpinner";
import InlineEdit from "../components/InlineEdit";
import "@fortawesome/fontawesome-free/css/all.min.css";
import useAuthStatus from "../hooks/useAuthStatus";
import StatusSection from "../components/StatusSection";
import TitleSection from "../components/TitleSection";
import DescriptionSection from "../components/DescriptionSection";
import NotesSection from "../components/NotesSection";
import FilesSection from "../components/FilesSection";
import PaymentButton from "../components/PaymentButton";

const Matter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [matter, setMatter] = useState(null);
  const { isAdmin, userId } = useAuthStatus();
  const [localError, setLocalError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  // Set Page Theme
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true"; // Dark mode as default
  });

  // Status Change
  const handleStatusChange = (newStatus) => {
    setMatter((prev) => ({ ...prev, status: newStatus }));
  };

  // Title Change
  const handleTitleSave = async (newTitle) => {
    await axiosReq.patch(`/matters/${id}/`, { title: newTitle });
    setMatter((prev) => ({ ...prev, title: newTitle }));
    setEditingSection(null);
  };

  // Description change
  const handleDescriptionSave = async (newDescription) => {
    await axiosReq.patch(`/matters/${id}/`, { description: newDescription });
    setMatter((prev) => ({ ...prev, description: newDescription }));
    setEditingSection(null);
  };

  // Handle files
  const handleUploadFile = async (newFiles) => {
    try {
      const formData = new FormData();
      newFiles.forEach((file) => formData.append("new_files", file));

      const { data } = await axiosReq.patch(`/matters/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (Array.isArray(data.new_files)) {
        setMatter((prev) => ({
          ...prev,
          files: [...prev.files, ...data.new_files], // Add new files
        }));
      } else if (Array.isArray(data.files)) {
        setMatter((prev) => ({
          ...prev,
          files: data.files,
        }));
      } else {
        console.warn(
          "Inga giltiga fildata i API-svaret. Kontrollera backend-svaret:",
          data
        );
      }
    } catch (err) {
      console.error("Fel vid uppladdning av filer:", err);
    }
  };

  // Notes change
  const handleNotesSave = async (newNotes) => {
    await axiosReq.patch(`/matters/${id}/`, { notes: newNotes });
    setMatter((prev) => ({ ...prev, notes: newNotes }));
    setEditingSection(null);
  };

  // Fetch specific matter
  useEffect(() => {
    const fetchMatter = async () => {
      try {
        const { data } = await axiosReq.get(`/matters/${id}`);
        setMatter(data);
      } catch (err) {
        setLocalError("Kunde inte hämta ärendet. Försök igen senare.");
      }
    };
    fetchMatter();
  }, [id]);

  // Theme
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Update Matter after update
  const handleUpdate = (updatedMatter) => {
    setMatter(updatedMatter);
    setShowEditModal(false); // Close modal
  };

  if (localError) {
    return <Alert variant="danger">{localError}</Alert>;
  }

  if (!matter) {
    return <LoadingSpinner />;
  }

  return (
    <Container
      fluid
      className={`${styles.pageContainer} ${darkMode ? styles.dark : ""}`}
    >
      {/* Status & Page Theme */}
      <Row>
        {/* Status */}
        <Col lg={2} md={3} sm={4} xs={5}>
          <StatusSection
            matter={matter}
            isAdmin={isAdmin}
            editingSection={editingSection}
            setEditingSection={setEditingSection}
            onStatusChange={handleStatusChange}
          />
        </Col>

        {/* Page Theme */}
        <Col className="d-flex justify-content-end mt-4 me-3">
          <Button
            className={`${styles.modeBtn} text-center`}
            variant={darkMode ? "light" : "dark"}
            onClick={() => setDarkMode((prev) => !prev)}
          >
            {darkMode ? "☀️ Ljust läge" : "🌙 Mörkt läge"}
          </Button>
        </Col>
      </Row>
      {/* Title */}
      <Row className="align-items-center mt-4 mb-4">
        <Col lg={12} md={12} sm={12} xs={12} className="align-self-start">
          <TitleSection
            title={matter.title}
            isEditing={editingSection === "title"}
            darkMode={darkMode}
            setEditingSection={setEditingSection}
            onSaveTitle={handleTitleSave}
          />
        </Col>
      </Row>

      {/* Description */}
      <Row className="mb-4">
        <Col lg={12} md={12} sm={12} xs={12} className="align-self-start">
          <DescriptionSection
            description={matter.description}
            isEditing={editingSection === "description"}
            darkMode={darkMode}
            setEditingSection={setEditingSection}
            onSaveDescription={handleDescriptionSave}
          />
        </Col>
      </Row>

      {/* Divider Line */}
      <div className={`${styles.dividerLine} mx-auto`}></div>

      {/* Files */}
      <Row>
        <Col lg={12} md={12} sm={12} xs={12} className="align-self-start">
          <FilesSection
            files={matter.files}
            darkMode={darkMode}
            onDeleteFile={async (fileId) => {
              try {
                await axiosReq.patch(`/matters/${id}/`, {
                  remove_file_ids: [fileId],
                });
                setMatter((prev) => ({
                  ...prev,
                  files: prev.files.filter((file) => file.id !== fileId),
                }));
              } catch (err) {
                console.error("Kunde inte ta bort filen:", err);
              }
            }}
            onUploadFile={handleUploadFile}
          />
        </Col>
      </Row>

      {/* Divider Line */}
      <div className={`${styles.dividerLine} mx-auto`}></div>

      {/* Notes */}
      <Row className="mb-4">
        <Col lg={12} md={12} sm={12} xs={12} className="align-self-start">
          <NotesSection
            notes={matter.notes}
            isEditing={editingSection === "notes"}
            isAdmin={isAdmin}
            darkMode={darkMode}
            setEditingSection={setEditingSection}
            onSaveNotes={handleNotesSave}
          />
        </Col>
      </Row>

      {/* Divider Line */}
      <div className={`${styles.dividerLine} mx-auto`}></div>

      {/* Action Buttons */}
      <Row className="mt-3">
        <Col className={`d-flex justify-content-center ${styles.buttonGroup}`}>
          {/* Payment Button */}
          <PaymentButton />
          <Button
            className={`${styles.backBtn} me-3`}
            variant="secondary"
            onClick={() => navigate("/user-matters")}
          >
            Tillbaka
          </Button>
          <Button
            className={styles.deleteBtn}
            variant="danger"
            onClick={() => setShowDeleteModal(true)}
          >
            Radera
          </Button>
        </Col>
      </Row>

      {/* Modals */}
      <UpdateDeleteMatter
        showEditModal={showEditModal}
        showDeleteModal={showDeleteModal}
        matter={matter}
        handleCloseEdit={() => setShowEditModal(false)}
        handleCloseDelete={() => setShowDeleteModal(false)}
        fetchMatters={async () => {
          try {
            const { data } = await axiosReq.get(`/matters/${id}`);
            setMatter(data);
          } catch (err) {
            setLocalError("Kunde inte uppdatera ärendet. Försök igen senare.");
          }
        }}
        onDeleteSuccess={() => navigate("/user-matters")}
        handleUpdate={handleUpdate}
      />
    </Container>
  );
};

export default Matter;
