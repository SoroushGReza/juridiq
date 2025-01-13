import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";

function Alerts({ successMessage, errorMessage }) {
  const [showSuccess, setShowSuccess] = useState(!!successMessage);
  const [showError, setShowError] = useState(!!errorMessage);

  useEffect(() => {
    if (successMessage) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <>
      {showSuccess && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setShowSuccess(false)}
        >
          {successMessage}
        </Alert>
      )}
      {showError && (
        <Alert variant="danger" dismissible onClose={() => setShowError(false)}>
          {errorMessage}
        </Alert>
      )}
    </>
  );
}

export default Alerts;
