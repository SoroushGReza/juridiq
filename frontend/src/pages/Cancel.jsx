import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/CancelSuccess.module.css";

function Cancel() {
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
              src="https://lottie.host/73fb8e5a-a1a3-4089-905f-ace706bf26ad/64pXTRbTcn.lottie"
              autoplay
              loop={false}
              className={styles.animationXIcon}
            />
          ) : (
            <FontAwesomeIcon
              icon={faTimesCircle}
              className={`${styles.icon} text-danger`}
            />
          )}
        </div>
        <div className={styles.textContainer}>
          <h2 className={!showText ? styles.hidden : ""}>
            Betalning avbruten.
          </h2>
        </div>
      </Col>
    </Row>
  );
}

export default Cancel;
