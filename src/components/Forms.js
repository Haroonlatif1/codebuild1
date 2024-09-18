import React, { useState } from 'react';
import { Card, CardBody, CardTitle, Container, Row, Col, Form, Button } from "react-bootstrap";
import "../components/css/Form.css";
import { useLocation } from 'react-router-dom';
import SuccessModal from "./SuccessModal"

const Forms = () => {
  const location = useLocation();
  const [result, setResult] = useState(""); // Changed to useState instead of React.useState
  const title = location.state?.title; // Access title from state
  const [selectedOption, setSelectedOption] = useState(title); // Initialize state with auto-selected title
  const [paymentSuccessModalOpen, setPaymentSuccessModalOpen] = useState(false); //login popup control

  const handleChange = (event) => {
    setSelectedOption(event.target.value); // Update state on change
  };

  const onSubmit = async (event) => {
    
    event.preventDefault();
    if (!selectedOption)
    {
      setResult("Fill the fields ");

    }
    else{
      setResult("Sending....");
    }
    setPaymentSuccessModalOpen(true);

    setTimeout(() => {
      setPaymentSuccessModalOpen(false);
      setResult("")
    }, 2000);
  
    const formData = new FormData(event.target);
    formData.append("access_key", "bee286f3-0072-4c0e-ba9b-bf28ff0728e7");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <Container fluid className="enroll-form">
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={4}>
          <Card className="card-border bg-dark text-white">
            <CardBody>
              <CardTitle className="card-title">Enroll Now</CardTitle>
              <Form className='form-cl' onSubmit={onSubmit}>
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="name" placeholder="Enter your name" />
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" placeholder="Enter your email" />
                </Form.Group>
                <Form.Group controlId="phone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="tel" name="phone" placeholder="Enter your phone number" />
                </Form.Group>
                <Form.Group controlId="course">
                  <Form.Label>Preferred Course</Form.Label>
                  <Form.Control as="select" name="course" value={selectedOption} onChange={handleChange}>
                    <option>Full Stack Web Development</option>
                    <option>Full Stack Web Dev with Artificial Intelligence</option>
                    <option>Machine Learning from Scratch</option>
                    <option>Data Analysis with Python</option>
                    <option>Business Development</option>
                    <option>Android App Development</option>
                    <option>MS Office</option>
                    <option>Ethical Hacking and Cyber Security</option>
                    <option>Frontend Web dev with react</option>
                    <option>Python programming from zero to hero</option>


                  </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit">Enroll Now</Button>
                <SuccessModal isOpen={paymentSuccessModalOpen} />               </Form>
              {result && <p className="mt-3">{result}</p>}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Forms;
