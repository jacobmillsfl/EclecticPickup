import { useState, useContext, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation } from "react-router-dom";
import appContext from "../../Contexts/AppContext";

function MainNav() {
  const [expanded, setExpanded] = useState(false);
  const { loggedIn } = useContext(appContext);
  const location = useLocation();

  useEffect(() => {
    setExpanded(false);
    if (location.hash) {
      const frame = requestAnimationFrame(() => {
        document.getElementById(location.hash.slice(1))?.scrollIntoView();
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [location.pathname, location.hash]);

  return (
    <Navbar
      expand="lg"
      variant="dark"
      className="site-nav"
      expanded={expanded}
      onToggle={setExpanded}
      aria-label="Main navigation"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="brand"
          onClick={() => setExpanded(false)}
        >
          ECLECTIC<span>PICKUP</span>
          <span className="brand-dot" aria-hidden="true">
            .
          </span>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="site-navigation"
          aria-expanded={expanded}
          label="Toggle navigation"
        />
        <Navbar.Collapse id="site-navigation">
          <Nav className="ms-auto" onSelect={() => setExpanded(false)}>
            <Nav.Link href="/#shows">Shows</Nav.Link>
            <Nav.Link href="/#about">The band</Nav.Link>
            <Nav.Link href="/#videos">Watch</Nav.Link>
            <Nav.Link href="/#subscribe" className="nav-subscribe">
              Stay in the loop <span aria-hidden="true">&#8599;</span>
            </Nav.Link>
            {loggedIn && (
              <>
                <Nav.Link as={Link} to="/admin">
                  Admin
                </Nav.Link>
                <Nav.Link as={Link} to="/logout">
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNav;
