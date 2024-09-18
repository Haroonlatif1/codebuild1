import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faWhatsapp, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import "../components/css/ContactUs.css";
import { Form, Button } from 'react-bootstrap';

function ContactUs() {
  return (
    <div className="contact-us">
      <h1>Contact Us</h1>
      <div className="social-links">
        <a href="https://www.instagram.com/codebuild1" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faInstagram} size="2x" color="#E1306C" />
        </a>
        <a href="https://www.facebook.com/profile.php?id=61563588339796" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faFacebook} size="2x" color="#4267B2" />
        </a>
        <a href="https://wa.me/+923284452954" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faWhatsapp} size="2x" color="#25D366" />
        </a>
        <a href="https://www.linkedin.com/in/your-linkedin-handle" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faLinkedin} size="2x" color="#2867B2" />
        </a>
      </div>
      <div className="contact-info">
        <p>Phone: 0328-4452954</p>
        <p>Email: codecraft1122@gmail.com</p>
        <p>Address: 40-D near Furqan Surgical Hospital Gulshan-e-Ravi, Lahore, Pakistan</p>
      </div>
      <Form className="contact-us-form">
        <Form.Group controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter name" />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group controlId="formBasicMessage">
          <Form.Label>Message</Form.Label>
          <Form.Control as="textarea" rows={3} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default ContactUs;
