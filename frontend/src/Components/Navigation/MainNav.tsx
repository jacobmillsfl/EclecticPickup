import { useState, useContext, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link as ScrollLink } from 'react-scroll';

import appContext from "../../Contexts/AppContext";

function MainNav() {
  const [collapsed, setCollapsed] = useState(true);
  const [ isHomepage, setIsHomepage ] = useState(true);
  const { loggedIn } = useContext(appContext);

  useEffect(() => {

  }, []);


  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({
          behavior: 'smooth',
        });
      }, 1200);
    }

    const currentPath = window.location.pathname;
    if (currentPath !== "/") {
      setIsHomepage(false);
    } else {
      setIsHomepage(true);
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
          {isHomepage && (
              <>
              <ScrollLink to="home" role="button" className="nav-link" smooth={true} offset={-70} duration={500}>
                Home
              </ScrollLink>
              <ScrollLink to="about" role="button" className="nav-link" smooth={true} offset={-70} duration={500}>
                About
              </ScrollLink>
              <ScrollLink to="videos" role="button" className="nav-link" smooth={true} offset={-70} duration={500}>
                Videos
              </ScrollLink>
              <ScrollLink to="shows" role="button" className="nav-link" smooth={true} offset={-70} duration={500}>
                Shows
              </ScrollLink>
              <ScrollLink to="socials" role="button" className="nav-link" smooth={true} offset={-70} duration={500}>
                Socials
              </ScrollLink>
              <ScrollLink to="subscribe" role="button" className="nav-link" smooth={true} offset={-70} duration={500}>
                Subscribe
              </ScrollLink>
              </>
              )}
              {!isHomepage && (
              <>
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/#about">About</Nav.Link>
                <Nav.Link href="/#videos">Videos</Nav.Link>
                <Nav.Link href="/#shows">Shows</Nav.Link>
                <Nav.Link href="/#socials">Socials</Nav.Link>
                <Nav.Link href="/#subscribe">Subscribe</Nav.Link>
              </>
            )}
            {loggedIn && (
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
