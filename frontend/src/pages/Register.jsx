import React, { useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import styles from "../styles/Register.module.css";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    surname: "",
    phone_number: "",
    password: "",
    password2: "",
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
      const response = await axiosReq.post("/accounts/register/", formData);
      // Save tokens in localStorage
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      // Redirect to another page after successful registration
      navigate("/login");
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
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
              <h1 className={`${styles["formHeader"]} text-center`}>
                Register
              </h1>
              <Form.Group className="mt-4" controlId="formEmail">
                <Form.Label className={`${styles["customLabel"]} text-start`}>
                  Email
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  required
                  className={`${styles["customInput"]} text-start`}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formName">
                <Form.Label className={`${styles["customLabel"]} text-start`}>
                  First Name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                  required
                  className={`${styles["customInput"]} text-start`}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formSurname">
                <Form.Label className={`${styles["customLabel"]} text-start`}>
                  Surname
                </Form.Label>
                <Form.Control
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  isInvalid={!!errors.surname}
                  required
                  className={`${styles["customInput"]} text-start`}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.surname}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPhoneNumber">
                <Form.Label className={`${styles["customLabel"]} text-start`}>
                  Phone Number
                </Form.Label>
                <Form.Control
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  isInvalid={!!errors.phone_number}
                  required
                  className={`${styles["customInput"]} text-start`}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone_number}
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
                  isInvalid={!!errors.password}
                  required
                  className={`${styles["customInput"]} text-start`}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword2">
                <Form.Label className={`${styles["customLabel"]} text-start`}>
                  Confirm Password
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                  isInvalid={!!errors.password2}
                  required
                  className={`${styles["customInput"]} text-start`}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password2}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className={`${styles["customBtn"]} text-center`}
              >
                Register
              </Button>

              <p className={`${styles["textAndLink"]} text-center`}>
                Already have an account? <a href="/login">Login here</a>
              </p>
            </Form>
          </div>
          {Object.keys(errors).length > 0 && (
            <Alert variant="danger" className="mt-3">
              Please check the form for errors.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
