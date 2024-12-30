import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus"
import styles from "../../src/styles/NavBar.module.css";
import LogoImg from "../assets/images/JQ.svg";

const NavBar = () => {
  const { isAuthenticated } = useAuthStatus();

  const handleLogout = () => {
    // Delte tokens from localStorage
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    // Reload the page or navigate to the home page to re-evaluate auth status
    window.location.href = "/";
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <img
            src={LogoImg}
            alt="Logo"
            style={{ height: "60px", width: "auto" }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" className={`${styles["navBarLinks"]}`}>
              Hem
            </Nav.Link>
            {isAuthenticated ? (
              <>
                <Nav.Link as={NavLink} to="/profile" className={`${styles["navBarLinks"]}`}>
                  Profil
                </Nav.Link>
                <Nav.Link as={NavLink} to="/cases" className={`${styles["navBarLinks"]}`}>
                  Ärenden
                </Nav.Link>
                <Nav.Link as={NavLink} to="/contact" className={`${styles["navBarLinks"]}`}>
                  Kontakt
                </Nav.Link>
                <Nav.Link as={NavLink} to="/about" className={`${styles["navBarLinks"]}`}>
                  Om oss
                </Nav.Link>
                <Nav.Link onClick={handleLogout} className={`${styles["navBarLinks"]}`}>Logga ut</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login" className={`${styles["navBarLinks"]}`}>
                  Logga in
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register" className={`${styles["navBarLinks"]}`}>
                  Registrera
                </Nav.Link>
                <Nav.Link as={NavLink} to="/contact" className={`${styles["navBarLinks"]}`}>
                  Kontakt
                </Nav.Link>
                <Nav.Link as={NavLink} to="/about" className={`${styles["navBarLinks"]}`}>
                  Om oss
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
