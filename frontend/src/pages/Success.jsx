import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/CancelSuccess.module.css";

function Success() {
  const [animationDone, setAnimationDone] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationDone(true);
      setTimeout(() => setShowText(true), 200);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Row className={styles.pageContainer}>
      <Col xs={12} md={6} className="text-center">
        <div className={styles.iconContainer}>
          {!animationDone ? (
            <DotLottieReact
              src="https://lottie.host/9c5beecc-ed5f-4152-b749-0ef1937d112c/zGNiGpZc11.lottie"
              autoplay
              loop={false}
              className={styles.animationIcon}
            />
          ) : (
            <FontAwesomeIcon icon={faCheckCircle} className={`${styles.icon} text-success`} />
          )}
        </div>
        <div className={styles.textContainer}>
          <h2 className={!showText ? styles.hidden : ""}>Betalning genomförd!</h2>
        </div>
      </Col>
    </Row>
  );
}

export default Success;
