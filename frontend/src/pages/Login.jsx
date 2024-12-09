import React, { useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import styles from "../styles/Register.module.css";

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
      // Redirect after successful login to the home page
      navigate("/");
    } catch (error) {
      if (error.response?.data) {
        setErrors({ ...error.response.data });
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <Container fluid className={styles.loginContainer}>
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
              <h1 className={`${styles["formHeader"]} text-center`}>Login</h1>
              <Form.Group className="mt-4" controlId="formEmail">
                <Form.Label className={`${styles["customLabel"]} text-start`}>
                  Email
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
                  Password
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
                Login
              </Button>
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
    </Container>
  );
};

export default Login;
