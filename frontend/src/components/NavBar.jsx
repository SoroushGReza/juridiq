import React, { useState, useRef, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus";
import styles from "../../src/styles/NavBar.module.css";
import LogoImg from "../assets/images/JQ.svg";

const NavBar = () => {
  const { isAuthenticated } = useAuthStatus();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navbarRef = useRef(null);

  const handleLogout = () => {
    // Delete tokens from localStorage
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    // Reload the page or navigate to the home page to re-evaluate auth status
    window.location.href = "/";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <Navbar
      ref={navbarRef}
      bg="dark"
      variant="dark"
      expand="lg"
      expanded={isMenuOpen}
    >
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <img
            src={LogoImg}
            alt="Logo"
            style={{ height: "60px", width: "auto" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="navbarNav"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto">
            <Nav.Link
              as={NavLink}
              to="/"
              className={`${styles["navBarLinks"]}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Hem
            </Nav.Link>
            {isAuthenticated ? (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/profile"
                  className={`${styles["navBarLinks"]}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profil
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/user-matters"
                  className={`${styles["navBarLinks"]}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ärenden
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/contact"
                  className={`${styles["navBarLinks"]}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kontakt
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/about"
                  className={`${styles["navBarLinks"]}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Om oss
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/prices"
                  className={`${styles["navBarLinks"]}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Priser
                </Nav.Link>
                <Nav.Link
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className={`${styles["navBarLinks"]}`}
                >
                  Logga ut
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/login"
                  className={`${styles["navBarLinks"]}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Logga in
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/register"
                  className={`${styles["navBarLinks"]}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrera
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/contact"
                  className={`${styles["navBarLinks"]}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kontakt
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/about"
                  className={`${styles["navBarLinks"]}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Om oss
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/prices"
                  className={`${styles["navBarLinks"]}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Priser
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
