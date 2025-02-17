import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosReq, setAuthHeader } from "../api/axiosDefaults";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../styles/VerifyEmail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

const VerifyEmail = () => {
  const { key } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(
    "Verifierar din e‑post, vänligen vänta..."
  );
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axiosReq.get(`/accounts/verify-email/${key}/`);
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        setAuthHeader();

        setMessage("Ditt konto är verifierat! Du loggas in automatiskt...");
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } catch (error) {
        console.error("Verifiering misslyckades:", error);
        setIsError(true);
        setMessage(
          "Verifiering misslyckades. Kontakta support om felet kvarstår."
        );
      }
    };
    verifyEmail();
  }, []);

  // Display icon based och error or success
  const icon = isError ? faExclamationTriangle : faCheckCircle;

  return (
    <Container fluid className={styles.fullHeight}>
      <Row className="justify-content-center align-items-center h-100">
        <Col md={6} className="text-center">
          <div className={styles.animatedText}>
            <FontAwesomeIcon
              icon={icon}
              size="3x"
              className={styles.iconSpacing}
            />
            <p>{message}</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyEmail;
