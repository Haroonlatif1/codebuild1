import React from 'react';
import { Navbar, Nav, NavDropdown, Container,Button } from 'react-bootstrap';
import logo from '../components/logo.png';
import {Link} from "react-router-dom"

function NavigationBar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <img src={logo} alt="Logo" style={{ width: 40, height: 40, marginRight: 10 }} />
          <span style={{ fontSize: 18, color: '#fff' }}>Codebuild</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link ><Link to="/offeredcourses" style={{textDecoration:"none",color:"gray"}}>Offered Courses</Link></Nav.Link>
            <Nav.Link ><Link to="/aboutus" style={{textDecoration:"none",color:"gray"}}>About Us</Link></Nav.Link>
            <Nav.Link ><Link to="/contactus" style={{textDecoration:"none",color:"gray"}}>Contact Us</Link></Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="/">
              <Button variant='outline-primary'>Enroll Now</Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;