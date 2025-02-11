import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Alerts from "./Alerts";
import FormStyles from "../styles/FormStyles.module.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import animationStyles from "../styles/CancelSuccess.module.css";
import styles from "../styles/Contact.module.css";

const EmailForm = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Success & Error Messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // State to handle animations
  const [animationDone, setAnimationDone] = useState(false);
  const [showText, setShowText] = useState(false);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

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
        await response.json();
        // Default success message
        setSuccessMessage(
          "Tack! Ditt meddelande har skickats. Vi kontaktar dig vanligtvis inom 1 arbetsdag."
        );
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

  // When success message is set, run animation
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setAnimationDone(true);
        setTimeout(() => setShowText(true), 200);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      // If no successmessage reset animation
      setAnimationDone(false);
      setShowText(false);
    }
  }, [successMessage]);

  // If email is sent, render animation and message
  if (successMessage) {
    return (
      <div className={animationStyles.successContainer}>
        <div className={animationStyles.iconContainer}>
          {!animationDone ? (
            <DotLottieReact
              src="https://lottie.host/9c5beecc-ed5f-4152-b749-0ef1937d112c/zGNiGpZc11.lottie"
              autoplay
              loop={false}
              className={animationStyles.animationIcon}
            />
          ) : (
            <FontAwesomeIcon
              icon={faCheckCircle}
              className={`${animationStyles.icon} text-success`}
            />
          )}
        </div>
        <div className={styles.textContainer}>
          <p className={!showText ? styles.hidden : ""}>{successMessage}</p>
        </div>
      </div>
    );
  }

  // Otherwise show form
  return (
    <div className={FormStyles.formWrapper}>
      <Form onSubmit={handleSubmit}>
        <h1 className={`${FormStyles.formHeader} text-center`}>Via E-Post</h1>

        {/* Show success & error alerts */}
        <Alerts successMessage={successMessage} errorMessage={errorMessage} />

        <Form.Group className="mt-4" controlId="formFirstName">
          <Form.Label className={`${FormStyles.formLabel} text-start`}>
            Förnamn <span className={FormStyles.labelSpan}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className={`${FormStyles.formInput} text-start`}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formLastName">
          <Form.Label className={`${FormStyles.formLabel} text-start`}>
            Efternamn <span className={FormStyles.labelSpan}>*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className={`${FormStyles.formInput} text-start`}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label className={`${FormStyles.formLabel} text-start`}>
            E-post <span className={FormStyles.labelSpan}>*</span>
          </Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${FormStyles.formInput} text-start`}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPhone">
          <Form.Label className={`${FormStyles.formLabel} text-start`}>
            Telefonnummer
          </Form.Label>
          <Form.Control
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`${FormStyles.formInput} text-start`}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formMessage">
          <Form.Label className={`${FormStyles.formLabel} text-start`}>
            Meddelande <span className={FormStyles.labelSpan}>*</span>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={`${FormStyles.formInput} text-start`}
            required
          />
        </Form.Group>

        <Button
          className={`${FormStyles.greenBtn} text-center`}
          variant="primary"
          type="submit"
        >
          Skicka
        </Button>
      </Form>
    </div>
  );
};

export default EmailForm;
