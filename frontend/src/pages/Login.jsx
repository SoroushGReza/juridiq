import React, { useState } from "react";
import { axiosReq, setAuthHeader } from "../api/axiosDefaults";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
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
      // Reload the page to re-initialize application state
      window.location.reload();
    } catch (error) {
      if (error.response?.data) {
        setErrors({ ...error.response.data });
      } else {
        console.error("An unexpected error occurred:", error);
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
              <h1 className={`${styles["formHeader"]} text-center`}>Logga in</h1>
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
          {Object.keys(errors).length > 0 && (
            <Alert variant="danger" className="mt-3">
              {errors.message
                ? errors.message
                : "Please check the form for errors."}
            </Alert>
          )}
        </Col>
      </Row>
      {/* Login Image */}
      <img src={LoginImg} alt="Login" className={styles.loginImage} />
    </Container>
  );
};

export default Login;
