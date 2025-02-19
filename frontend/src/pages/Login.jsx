import React, { useState } from "react";
import { axiosReq, setAuthHeader } from "../api/axiosDefaults";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
import styles from "../styles/RegisterLogin.module.css";
import FormStyles from "../styles/FormStyles.module.css";
import LoginImg from "../assets/images/login.png";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    totp_code: "",
  });
  const [errors, setErrors] = useState({});
  const [requireTOTP, setRequireTOTP] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    try {
      const response = await axiosReq.post("/accounts/login/", formData);
      // Save tokens in localStorage
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      setAuthHeader();
      if (response.data.setup_2fa_required) {
        navigate("/setup-2fa");
      } else {
        navigate("/");
        setTimeout(() => window.location.reload(), 0);
      }
    } catch (error) {
      if (error.response?.data) {
        // If error indicates that TOTP code is required or is incorrect
        if (
          error.response.data.detail &&
          (error.response.data.detail.includes("TOTP-kod krävs") ||
            error.response.data.detail.includes("Felaktig TOTP-kod"))
        ) {
          setRequireTOTP(true);
        }
        setErrors({ ...error.response.data });
      } else {
        console.error("Unexpected error:", error.message);
        setErrors({
          message: "Fel E-post eller Lösenord angivet. Försök igen.",
        });
      }
    }
  };

  // Modal state and handlers for force-reset 2FA
  const [resetData, setResetData] = useState({
    email: "",
    password: "",
  });
  const [resetError, setResetError] = useState("");
  const [resetInfo, setResetInfo] = useState("");

  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setResetData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetError("");
    try {
      const response = await axiosReq.post(
        "/accounts/2fa/force-reset/",
        resetData
      );
      setResetInfo(response.data.detail);
      setShowResetModal(false);
      // After successful reset, redirect to login page to try logging in again
      navigate("/login");
    } catch (err) {
      console.error(err);
      setResetError(err.response?.data?.detail || "Ett fel inträffade.");
    }
  };

  return (
    <Container fluid className={styles.registerContainer}>
      <Row className="justify-content-center mt-3 mb-3">
        <Col
          xs={12}
          md={10}
          lg={8}
          xl={6}
          className={`${FormStyles["formCol"]} mt-4 mb-4`}
        >
          <div className={FormStyles.formWrapper}>
            <Form onSubmit={handleSubmit}>
              <h1 className={`${FormStyles["formHeader"]} text-center`}>
                Logga in
              </h1>
              <Form.Group className="mt-4" controlId="formEmail">
                <Form.Label className={`${FormStyles["formLabel"]} text-start`}>
                  E-post
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email || !!errors.message}
                  required
                  className={`${FormStyles["formInput"]} text-start`}
                  autoComplete="username"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email || errors.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label className={`${FormStyles["formLabel"]} text-start`}>
                  Lösenord
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password || !!errors.message}
                  required
                  className={`${FormStyles["formInput"]} text-start`}
                  autoComplete="current-password"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password || errors.message}
                </Form.Control.Feedback>
              </Form.Group>

              {requireTOTP && (
                <Form.Group className="mb-3" controlId="formTotp">
                  <Form.Label
                    className={`${FormStyles["formLabel"]} text-start`}
                  >
                    Ange koden från din Authenticator-app
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="totp_code"
                    value={formData.totp_code}
                    onChange={handleChange}
                    isInvalid={!!errors.totp_code || !!errors.message}
                    className={`${FormStyles["formInput"]} text-start`}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.totp_code || errors.message}
                  </Form.Control.Feedback>
                </Form.Group>
              )}

              <Button
                variant="primary"
                type="submit"
                className={`${FormStyles["yellowBtn"]} text-center`}
              >
                Logga in
              </Button>

              <p className={`${styles["textAndLink"]} text-center`}>
                Har du inget konto? <a href="/register">Skapa konto</a>
              </p>

              {requireTOTP && (
                <p className={`${styles["textAndLink"]} text-center mt-3`}>
                  Har du tappat din authenticator?{" "}
                  <span
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => setShowResetModal(true)}
                  >
                    Återställ 2FA
                  </span>
                </p>
              )}
            </Form>
          </div>
        </Col>
      </Row>
      {/* Login Image */}
      <img src={LoginImg} alt="Login" className={styles.loginImage} />

      {/* Modal for Force Reset 2FA */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Återställ 2FA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleResetSubmit}>
            <Form.Group controlId="resetEmail">
              <Form.Label>E-post</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={resetData.email}
                onChange={handleResetChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="resetPassword" className="mt-3">
              <Form.Label>Lösenord</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={resetData.password}
                onChange={handleResetChange}
                required
              />
            </Form.Group>
            {resetError && <p className="text-danger mt-2">{resetError}</p>}
            {resetInfo && <p className="text-success mt-2">{resetInfo}</p>}
            <Button variant="primary" type="submit" className="mt-3">
              Bekräfta återställning
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Login;
