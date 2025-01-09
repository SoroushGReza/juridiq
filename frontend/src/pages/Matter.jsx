import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, Button, Container, Row, Col } from "react-bootstrap";
import { axiosReq } from "../api/axiosDefaults";
import UpdateDeleteMatter from "../components/UpdateDeleteMatter";
import styles from "../styles/Matter.module.css";
import TXTViewer from "../components/TXTViewer";
import Status from "../components/Status";
import LoadingSpinner from "../components/LoadingSpinner";

const Matter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [matter, setMatter] = useState(null);
  const [localError, setLocalError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Set Page Theme
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true"; // Dark mode as default
  });

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
      <Row>
        {/* Status */}
        <Col
          lg={2}
          md={3}
          sm={4}
          xs={5}
          className="d-flex justify-content-start"
        >
          <p className={`${styles.status} text-center mt-4`}>
            <span className="fw-bold">Status: </span>
            <Status status={matter.status} />
          </p>
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
      <Row className="align-items-center mb-4">
        <Col lg={10} md={9} sm={11} xs={11} className="align-self-start">
          <h1 className={`${styles.title} me-2`}>{matter.title}</h1>
        </Col>
      </Row>

      {/* Description */}
      <Row className="mb-4">
        <Col lg={11} md={10} sm={11} xs={11} className="align-self-start">
          <h5 className="fw-bold ms-3">Beskrivning</h5>
          <p className={`${styles.description}`}>{matter.description}</p>
        </Col>
      </Row>

      {/* Files */}
      <Row>
        <Col lg={12} md={12} sm={12} xs={12} className="align-self-start">
          <h5 className="fw-bold ms-3">Filer</h5>
          {matter.files && matter.files.length > 0 ? (
            <div className={`${styles.fileList}`}>
              {matter.files.map((fileObj, index) => {
                const fileUrl =
                  typeof fileObj === "string" ? fileObj : fileObj.file;
                const isImage = /\.(jpeg|jpg|png|gif|webp)$/i.test(fileUrl);
                const isPDF = /\.pdf$/i.test(fileUrl);
                const isTxt = /\.txt$/i.test(fileUrl);

                return (
                  <div key={index} className={`${styles.filePreview} mb-4`}>
                    {isImage ? (
                      <img
                        src={fileUrl}
                        alt={`Fil ${index + 1}`}
                        className={`${styles.imagePreview} img-fluid`}
                      />
                    ) : isPDF ? (
                      <iframe
                        src={fileUrl}
                        title={`PDF ${index + 1}`}
                        className={`${styles.pdfPreview}`}
                      />
                    ) : isTxt ? (
                      <div className={`${styles.txtPreview}`}>
                        <TXTViewer fileUrl={fileUrl} />
                      </div>
                    ) : (
                      <div className={`${styles.unsupportedFile}`}>
                        <p>Kan inte förhandsvisa denna filtyp.</p>
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ladda ner filen här
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className={`${styles.noFiles} ms-3`}>Inga uppladdade filer</p>
          )}
        </Col>
      </Row>

      {/* Notes */}
      <Row className="mb-4">
        <Col
          lg={11}
          md={11}
          sm={11}
          xs={11}
          className={`${styles.notesCol} align-self-start ms-3`}
        >
          <h5 className={`${styles.notesHeader} fw-bold mt-4`}>Noteringar</h5>
          <p className={`${styles.notes} mb-4`}>
            {matter.notes ? matter.notes : "Ingen notering"}
          </p>
        </Col>
      </Row>

      {/* Divider Line */}
      <div className={`${styles.dividerLine} mx-auto`}></div>

      {/* Action Buttons */}
      <Row className="mt-3">
        <Col className="justify-content-center d-flex">
          <Button
            className={`me-2 ${styles.updateBtn}`}
            variant="primary"
            onClick={() => setShowEditModal(true)}
          >
            Ändra
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
