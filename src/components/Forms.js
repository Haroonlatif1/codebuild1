import React from 'react'
import { Card,CardBody,CardTitle,Container,Row,Col,Form ,Button} from "react-bootstrap";
import "../components/css/Form.css"
const Forms = () => {
  return (
    <Container fluid className="enroll-form">
  <Row className="justify-content-center">
    <Col md={8} lg={6} xl={4}>
      <Card className="card-border bg-dark text-white">
        <CardBody>
          <CardTitle className="card-title">Enroll Now</CardTitle>
          <Form className='form-cl'>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter your name" />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter your email" />
            </Form.Group>
            <Form.Group controlId="phone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="tel" placeholder="Enter your phone number" />
            </Form.Group>
            <Form.Group controlId="course">
              <Form.Label>Preferred Course</Form.Label>
              <Form.Control as="select">
                <option>Full Stack Web Development</option>
                <option>Data Analysis with Python</option>
                <option>Business Development</option>
                <option>Android App Development</option>
                <option>MS Office</option>
                <option>Ethical Hacking and Cyber Security</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">Enroll Now</Button>
          </Form>
        </CardBody>
      </Card>
    </Col>
  </Row>
</Container>
  )
}

export default Forms