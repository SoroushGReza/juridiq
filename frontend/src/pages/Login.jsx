import React, { useState } from "react";
import { axiosReq, setAuthHeader } from "../api/axiosDefaults";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import styles from "../styles/Register.module.css";
import LoginImg from "../assets/images/login.png";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
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
      // Redirect after successful login to the home page
      navigate("/");
      setTimeout(() => window.location.reload(), 0);
      // Reload the page to re-initialize application state
    } catch (error) {
      if (error.response?.data) {
        setErrors({ ...error.response.data });
      } else {
        console.error("Unexpected error:", error.message);
        setErrors({ message: "Fel E-post eller Lösenord angivet. Försök igen." });
      }
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
          className={`${styles["formCol"]} mt-4 mb-4`}
        >
          <div className={styles.formWrapper}>
            <Form onSubmit={handleSubmit}>
              <h1 className={`${styles["formHeader"]} text-center`}>
                Logga in
              </h1>
              <Form.Group className="mt-4" controlId="formEmail">
                <Form.Label className={`${styles["customLabel"]} text-start`}>
                  E-post
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email || !!errors.message}
                  required
                  className={`${styles["customInput"]} text-start`}
                  autoComplete="username"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email || errors.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label className={`${styles["customLabel"]} text-start`}>
                  Lösenord
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password || !!errors.message}
                  required
                  className={`${styles["customInput"]} text-start`}
                  autoComplete="current-password"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password || errors.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className={`${styles["customBtn"]} text-center`}
              >
                Logga in
              </Button>

              <p className={`${styles["textAndLink"]} text-center`}>
                Har du inget konto? <a href="/register">Skapa konto</a>
              </p>
            </Form>
          </div>
        </Col>
      </Row>
      {/* Login Image */}
      <img src={LoginImg} alt="Login" className={styles.loginImage} />
    </Container>
  );
};

export default Login;
