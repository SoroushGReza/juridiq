import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import styles from "../styles/InlineEdit.module.css";

const InlineEdit = ({
  value,
  onSave,
  onCancel,
  sectionName,
  darkMode,
  dropdownOptions,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const textareaRef = useRef(null);

  const handleSave = async () => {
    await onSave(inputValue);
  };

  const handleCancel = () => {
    setInputValue(value); // Reset original value
    onCancel(); // Quit edit
  };

  // Adjust height based on content (only for textarea)
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Adjust height when reading and text editing
  useEffect(() => {
    if (!dropdownOptions) {
      adjustTextareaHeight();
    }
  }, [inputValue]);

  return (
    <Row className="mb-4">
      <Col lg={12} md={12} sm={12} xs={12} className="align-self-start">
        <div
          className={`${styles.inlineEdit} ${
            darkMode ? styles.darkInlineEdit : ""
          } d-flex align-items-center`}
        >
          {dropdownOptions ? (
            // Dropdown for editing
            <Form.Select
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={`${styles.input} ${darkMode ? styles.darkInput : ""}`}
            >
              {dropdownOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
          ) : (
            // Textarea for editing
            <Form.Control
              as="textarea"
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              rows={1}
              className={`${styles.input} ${darkMode ? styles.darkInput : ""}`}
              style={{ overflow: "hidden", resize: "none" }}
            />
          )}
        </div>
      </Col>
      <div className="mt-2 ms-3">
        <Button variant="success" size="sm" onClick={handleSave}>
          Spara
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCancel}
          className="ms-2"
        >
          Avbryt
        </Button>
      </div>
    </Row>
  );
};

export default InlineEdit;
