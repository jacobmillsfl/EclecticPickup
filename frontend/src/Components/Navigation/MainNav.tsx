import { useState, useContext, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import AuthManager from "../../Utilities/AuthManager";
import { Link as ScrollLink } from 'react-scroll';

function MainNav() {
  const [collapsed, setCollapsed] = useState(true);

  const isAuthenticated = AuthManager.isAuthenticated();

  useEffect(() => {
    const hash = window.location.hash.substring(1);

    if (hash && document.getElementById(hash)) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({
          behavior: 'smooth',
        });
      }, 1200);
    }
  }, []);

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
    <Navbar
      expand="lg"
      bg="dark"
      variant="dark"
      fixed="top"
      expanded={!collapsed}
    >
      <Container>
        <Navbar.Brand href="/">EclecticPickup.com</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggle} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link>
              <ScrollLink to="home" smooth={true} offset={-70} duration={500}>
                Home
              </ScrollLink>
            </Nav.Link>
            <Nav.Link>
              <ScrollLink to="about" smooth={true} offset={-70} duration={500}>
                About
              </ScrollLink>
            </Nav.Link>
            <Nav.Link>
              <ScrollLink to="videos" smooth={true} offset={-70} duration={500}>
                Videos
              </ScrollLink>
            </Nav.Link>
            <Nav.Link>
              <ScrollLink to="shows" smooth={true} offset={-70} duration={500}>
                Shows
              </ScrollLink>
            </Nav.Link>
            <Nav.Link>
              <ScrollLink to="socials" smooth={true} offset={-70} duration={500}>
                Socials
              </ScrollLink>
            </Nav.Link>
            <Nav.Link>
              <ScrollLink to="subscribe" smooth={true} offset={-70} duration={500}>
                Subscribe
              </ScrollLink>
            </Nav.Link>
            {isAuthenticated && (
              <>
                <Nav.Link href="/admin">Admin</Nav.Link>
                <Nav.Link href="/logout">Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNav;
