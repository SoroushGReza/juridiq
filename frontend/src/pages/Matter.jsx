import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, Button, Container, Row, Col } from "react-bootstrap";
import { axiosReq } from "../api/axiosDefaults";
import UpdateDeleteMatter from "../components/UpdateDeleteMatter";
import styles from "../styles/Matter.module.css";

const Matter = () => {
  const { id } = useParams(); // Get Matter ID from URL
  const navigate = useNavigate();
  const [matter, setMatter] = useState(null);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch specific matter
  useEffect(() => {
    const fetchMatter = async () => {
      try {
        const { data } = await axiosReq.get(`/matters/${id}`);
        setMatter(data);
      } catch (err) {
        setError("Kunde inte hämta ärendet. Försök igen senare.");
      }
    };
    fetchMatter();
  }, [id]);

  // Update Matter after update
  const handleUpdate = (updatedMatter) => {
    setMatter(updatedMatter);
    setShowEditModal(false); // Close modal
  };

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!matter) {
    return <p className="text-center mt-4">Laddar ärendet...</p>;
  }

  return (
    <Container className="mt-4">
      {/* Title & status */}
      <Row className="align-items-center mb-4">
        <Col>
          <h1 className={`${styles.title}`}>{matter.title}</h1>
          <p className={`${styles.status}`}>Status: {matter.status}</p>
        </Col>
        <Col xs="auto">
          <Button
            className={`${styles.updateBtn} me-2`}
            variant="primary"
            onClick={() => setShowEditModal(true)}
          >
            Ändra
          </Button>
          <Button
            className={`${styles.deleteBtn}`}
            variant="danger"
            onClick={() => setShowDeleteModal(true)}
          >
            Radera
          </Button>
        </Col>
      </Row>
      {/* Notes */}
      <Row className="mb-4">
        <Col>
          <h4>Noteringar</h4>
          <p>{matter.notes ? matter.notes : "Ingen notering"}</p>
        </Col>
      </Row>
      {/* Description */}
      <Row className="mb-4">
        <Col>
          <h4>Beskrivning</h4>
          <p>{matter.description}</p>
        </Col>
      </Row>
      {/* Files */}
      <Row>
        <Col>
          <h4>Filer</h4>
          {matter.files && matter.files.length > 0 ? (
            <div className={`${styles.fileList}`}>
              {matter.files.map((fileObj, index) => {
                const fileUrl =
                  typeof fileObj === "string" ? fileObj : fileObj.file;

                const isImage = /\.(jpeg|jpg|png|gif|webp)$/i.test(fileUrl);
                const isPDF = /\.pdf$/i.test(fileUrl);

                return (
                  <div key={index} className={`${styles.filePreview}`}>
                    {isImage ? (
                      // Preview of images
                      <img
                        src={fileUrl}
                        alt={`Fil ${index + 1}`}
                        className={`${styles.fileImage}`}
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    ) : isPDF ? (
                      // Preview of PDFs
                      <iframe
                        src={fileUrl}
                        title={`PDF ${index + 1}`}
                        className={`${styles.fileIframe}`}
                        style={{
                          width: "100%",
                          height: "500px",
                          border: "none",
                        }}
                      ></iframe>
                    ) : (
                      // If filetype not supported
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
            <p>Inga uppladdade filer</p>
          )}
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
            setError("Kunde inte uppdatera ärendet. Försök igen senare.");
          }
        }}
        onDeleteSuccess={() => navigate("/user-matters")}
        handleUpdate={handleUpdate}
      />
    </Container>
  );
};

export default Matter;
