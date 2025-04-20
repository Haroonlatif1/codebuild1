import React from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import "./css/footer.css";

const Footer = () => {
  return (
    <footer className="footer bg-dark pt-5">
      <Container>
        <Row>
          <Col md={3} className="footer-column">
            <h5>Codebuild</h5>
            <p>Learn whats matter and build amazing projects</p>
          </Col>
          <Col md={3} className="footer-column">
            <h5>Quick Links</h5>
            <ListGroup>
              <ListGroupItem><a href="/">Home</a></ListGroupItem>
              <ListGroupItem><a href="/offeredcourses">Courses</a></ListGroupItem>
              <ListGroupItem><a href="/aboutus">About Us</a></ListGroupItem>
              <ListGroupItem><a href="/contactus">Contact Us</a></ListGroupItem>
            </ListGroup>
          </Col>
          <Col md={3} className="footer-column">
            <h5>Resources</h5>
            <ListGroup>
              <ListGroupItem><a href="#">Blog</a></ListGroupItem>
              <ListGroupItem><a href="#">FAQs</a></ListGroupItem>
              <ListGroupItem><a href="#">Terms and Conditions</a></ListGroupItem>
              <ListGroupItem><a href="#">Privacy Policy</a></ListGroupItem>
            </ListGroup>
          </Col>
          <Col md={3} className="footer-column">
            <h5>Get in Touch</h5>
            <p>Address: 40-D gulshan-e-ravi near furqan Surgical Hospital, Lahore, Pakistan</p>
            <p>Phone: 0328-4452954</p>
            <p>Email: <a href="mailto:codecraft1122@gmail.com">codecraft1122@gmail.com</a></p>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="text-center copyright">
            <p>Copyright 2025 Codebuild. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
