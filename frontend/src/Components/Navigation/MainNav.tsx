import { useState, useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

function MainNav() {
  const [collapsed, setCollapsed] = useState(true);

  const toggle = () => {
    setCollapsed((collapsed) => !collapsed);
  };

  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    if (
      document.body.scrollTop > 40 ||
      document.documentElement.scrollTop > 40
    ) {
      if (!collapsed) {
        setCollapsed(true);
      }
    }
  }

  return (
    <Navbar expand="lg" bg="dark" variant="dark" fixed="top" expanded={!collapsed}>
      <Container>
        <Navbar.Brand href="/">EclecticPickup.com</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggle} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
			<Nav.Link href="#home">Home</Nav.Link>
			<Nav.Link href="#about">About</Nav.Link>
			<Nav.Link href="#videos">Videos</Nav.Link>
			<Nav.Link href="#shows">Shows</Nav.Link>
			<Nav.Link href="#socials">Socials</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNav;