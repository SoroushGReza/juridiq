import React, { useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import styles from "../styles/RegisterLogin.module.css";
import FormStyles from "../styles/FormStyles.module.css";
import RegisterImg from "../assets/images/register.png";
import LOGO from "../assets/images/LOGO.svg";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    surname: "",
    phone_number: "",
    password: "",
    password2: "",
    gdpr_consent: false,
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

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
    if (!formData.gdpr_consent) {
      setErrors({
        gdpr_consent: "Du måste godkänna villkoren och integritetspolicyn.",
      });
      return;
    }
    try {
      await axiosReq.post("/accounts/register/", formData);
      setMessage("Kolla din e‑post för att verifiera ditt konto.");
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
      {/* ------------- Logo Images -------------  */}
      <img src={LOGO} alt="Logo Image" className={styles.LogoImage} />
      <img src={LOGO} alt="Logo Image" className={styles.LogoImage2} />
      <img src={LOGO} alt="Logo Image" className={styles.LogoImage3} />
      <img src={LOGO} alt="Logo Image" className={styles.LogoImage4} />
      <img src={LOGO} alt="Logo Image" className={styles.LogoImage5} />
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
                Registrera
              </h1>
              <Form.Group className="mt-4" controlId="formEmail">
                <Form.Label className={`${FormStyles["formLabel"]} text-start`}>
                  E-post <span className={FormStyles.labelSpan}>*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  required
                  className={`${FormStyles["formInput"]} text-start`}
                  autoComplete="username"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formName">
                <Form.Label className={`${FormStyles["formLabel"]} text-start`}>
                  Förnamn <span className={FormStyles.labelSpan}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                  required
                  className={`${FormStyles["formInput"]} text-start`}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formSurname">
                <Form.Label className={`${FormStyles["formLabel"]} text-start`}>
                  Efternamn <span className={FormStyles.labelSpan}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  isInvalid={!!errors.surname}
                  required
                  className={`${FormStyles["formInput"]} text-start`}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.surname}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPhoneNumber">
                <Form.Label className={`${FormStyles["formLabel"]} text-start`}>
                  Telefon nummer <span className={FormStyles.labelSpan}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  isInvalid={!!errors.phone_number}
                  className={`${FormStyles["formInput"]} text-start`}
                  autoComplete="tel"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone_number}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label className={`${FormStyles["formLabel"]} text-start`}>
                  Ange lösenord <span className={FormStyles.labelSpan}>*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  required
                  className={`${FormStyles["formInput"]} text-start`}
                  autoComplete="new-password"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword2">
                <Form.Label className={`${FormStyles["formLabel"]} text-start`}>
                  Verifiera lösenord{" "}
                  <span className={FormStyles.labelSpan}>*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                  isInvalid={!!errors.password2}
                  required
                  className={`${FormStyles["formInput"]} text-start`}
                  autoComplete="new-password"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password2}
                </Form.Control.Feedback>
              </Form.Group>

              {/* --- GDPR CONSENT --- */}
              <Form.Group
                className={`${styles["gdpr"]} mb-4 mt-4`}
                controlId="formGdprConsent"
              >
                <Form.Check
                  type="checkbox"
                  name="gdpr_consent"
                  label={
                    <>
                      <span className="text-white">
                        Jag har läst och godkänner{" "}
                      </span>
                      <a
                        href="/terms-and-conditions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        villkoren
                      </a>
                      <span className="text-white"> och </span>
                      <a
                        href="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        integritetspolicyn
                      </a>
                      <span className="text-danger">*</span>
                    </>
                  }
                  checked={formData.gdpr_consent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gdpr_consent: e.target.checked,
                    })
                  }
                  required
                />
              </Form.Group>

              {Object.keys(errors).length > 0 && (
                <Alert variant="danger" className="mt-4">
                  Kontrollera errors i formuläret.
                </Alert>
              )}

              {message && (
                <Alert variant="info" className="mt-4">
                  {message}
                </Alert>
              )}

              <Button
                variant="primary"
                type="submit"
                className={`${FormStyles["yellowBtn"]} text-center`}
              >
                Registrera
              </Button>

              <p className={`${styles["textAndLink"]} text-center`}>
                Har du redan ett konto? <a href="/login">Logga in</a>
              </p>
            </Form>
          </div>
        </Col>
      </Row>
      <img src={RegisterImg} alt="Login" className={styles.registerImage} />
    </Container>
  );
};

export default Register;
