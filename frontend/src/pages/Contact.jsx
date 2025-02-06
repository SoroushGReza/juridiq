import React, { useState } from "react";
import Alerts from "../components/Alerts";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
// Styles
import FormStyles from "../styles/FormStyles.module.css";
import styles from "../styles/Contact.module.css";
// Images
import FbImg from "../assets/images/facebook.png";
import EmailImage from "../assets/images/email.png";
import PhoneImage from "../assets/images/phone.png";
import LinkedinImg from "../assets/images/linkedin.png";

function Contact() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Success and Error messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("http://localhost:8000/api/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(JSON.stringify(errorData));
      } else {
        const data = await response.json();
        setSuccessMessage(data.message);
        // Reset form
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          message: "",
        });
      }
    } catch (error) {
      setErrorMessage("Något gick fel, försök igen senare.");
    }
  };

  return (
    <Container fluid className={FormStyles.pageContainer}>
      {/* --------------- Background Image --------------- */}
      <div className={styles.contactBackground}>
        {/* --------------- Logo Images --------------- */}
        <img src={FbImg} alt="Facebook Logo" className={styles.fbImage} />
        <img src={EmailImage} alt="Email Logo" className={styles.emailImage} />
        <img src={PhoneImage} alt="Phone Logo" className={styles.phoneImage} />
        <img src={LinkedinImg} alt="Phone Logo" className={styles.LIImg} />
      </div>
      <Row className="justify-content-center">
        <Col
          xs={12}
          md={8}
          lg={6}
          xl={4}
          className={`${FormStyles["formCol"]} mt-4 mb-4`}
        >
          <h1 className={`${FormStyles.pageHeader} mb-4 text-center`}>
            Kontakta oss
          </h1>

          {/* ---------- Alerts ---------- */}
          <Alerts successMessage={successMessage} errorMessage={errorMessage} />

          <div className={FormStyles.formWrapper}>
            <Form onSubmit={handleSubmit}>
              <h1 className={`${FormStyles["formHeader"]} text-center`}>
                Via E-Post
              </h1>
              <Form.Group className="mt-4" controlId="formFirstName">
                <Form.Label className={`${FormStyles["formLabel"]} text-start`}>
                  Förnamn (obligatoriskt)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`${FormStyles["formInput"]} text-start`}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formLastName">
                <Form.Label className={`${FormStyles["formLabel"]} text-start`}>
                  Efternamn (obligatoriskt)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`${FormStyles["formInput"]} text-start`}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label className={`${FormStyles["formLabel"]} text-start`}>
                  E-post (obligatoriskt)
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${FormStyles["formInput"]} text-start`}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPhone">
                <Form.Label className={`${FormStyles["formLabel"]} text-start`}>
                  Telefonnummer (valfritt)
                </Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`${FormStyles["formInput"]} text-start`}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formMessage">
                <Form.Label className={`${FormStyles["formLabel"]} text-start`}>
                  Meddelande
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`${FormStyles["formInput"]} text-start`}
                  required
                />
              </Form.Group>

              <Button
                className={`${FormStyles["greenBtn"]} text-center`}
                variant="primary"
                type="submit"
              >
                Skicka
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Contact;
