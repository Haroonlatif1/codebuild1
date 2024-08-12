import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText,Carousel } from 'react-bootstrap';
import "../components/css/AboutUs.css"

function AboutUs() {
  const [courses, setCourses] = useState(0);
  const [instructors, setInstructors] = useState(0);
  const [students, setStudents] = useState(0);
  const [successRate, setSuccessRate] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 600) {
        setCourses(15);
        setInstructors(7);
        setStudents(300);
        setSuccessRate(95);
      }
      else{
          setCourses(0);
        setInstructors(0);
        setStudents(0);
        setSuccessRate(0);
        
        
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Container fluid className="about-us">
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={11}>
          <Card className="card-border bg-dark   ">
            <CardBody>
              <CardTitle   className="card-title  text-secondary"><h4>About Us</h4></CardTitle>
              <CardText className="card-text">
                Welcome to Codebuild, a premier educational institution dedicated to empowering students with knowledge and skills to succeed in their chosen careers. With a strong commitment to excellence, we offer a wide range of courses designed to meet the evolving needs of the industry. We have world best professional teachers who gives you real world tech industry experience
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center">
  <Col md={8} lg={6} xl={11}>
    <Card className="card-border1 bg-dark    ">
      <CardBody>
        <CardTitle   className="card-title  text-secondary"><h4>Our Story</h4></CardTitle>
        <CardText className="card-text">
          Our institute has grown to become a leading provider of quality education, with a focus on innovation, creativity, and critical thinking. Our team of experienced instructors and industry experts are passionate about helping students achieve their full potential.
        </CardText>
      
              <Carousel>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="ll.png"
                    alt="First slide"
                  />
                  <Carousel.Caption>
                    <h3>Our Founders</h3>
                    <p>Meet the team that started it all.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="ll.png"
                    alt="Second slide"
                  />
                  <Carousel.Caption>
                    <h3>Our Campus</h3>
                    <p>Take a look at our state-of-the-art facilities.</p>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src="ll.png"
                    alt="Third slide"
                  />
                  <Carousel.Caption>
                    <h3>Our Students</h3>
                    <p>Meet the students who make our institute great.</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
      </CardBody>
    </Card>
  </Col>
</Row>
      <Row className="justify-content-center counter">
        <Col xs={12} sm={6} md={4} lg={3} xl={2} className="counter-col">
          <Card className="card-border bg-dark   ">
            <CardBody>
              <CardTitle   className="card-title  text-secondary">Courses <br/>Offered:</CardTitle>
              <CardText className="card-text">
                <span className="counter-value">{courses}</span>+
              </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3} xl={2} className="counter-col">
          <Card className="card-border bg-dark   ">
            <CardBody>
              <CardTitle   className="card-title  text-secondary">Instructors:</CardTitle>
              <CardText className="card-text">
                <span className="counter-value">{instructors}</span>+
              </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3} xl={2} className="counter-col">
          <Card className="card-border bg-dark   ">
            <CardBody>
              <CardTitle   className="card-title  text-secondary"> Our Alumni Students:</CardTitle>
              <CardText className="card-text">
                <span className="counter-value">{students}</span>+
              </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3} xl={2} className="counter-col">
          <Card className="card-border bg-dark   ">
            <CardBody>
              <CardTitle   className="card-title text-secondary" >Success Rate:</CardTitle>
              <CardText className="card-text">
                <span className="counter-value">{successRate.toFixed(1)}%</span>
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={8}>
          <Card className="card-border bg-dark   ">
            <CardBody>
              <CardTitle   className="card-title  text-secondary"><h4>Our Mission</h4></CardTitle>
              <CardText className="card-text">
                At Codebuild, we are committed to:
                <ul>
                  <li>Providing high-quality education that meets industry standards</li>
                  <li>Fostering a supportive learning environment that encourages growth and development</li>
                  <li>Empowering students to succeed in their chosen careers</li>
                </ul>
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={8}>
          <Card className="card-border bg-dark   ">
            <CardBody>
              <CardTitle   className="card-title  text-secondary"><h4>Our Values</h4></CardTitle>
              <CardText className="card-text">
                <ul>
                  <li>Excellence in education</li>
                  <li>Innovation and creativity</li>
                  <li>Critical thinking and problem-solving</li>
                  <li>Collaboration and teamwork</li>
                  <li>Student-centered approach</li>
                </ul>
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={8}>
          <Card className="card-border bg-dark   ">
            <CardBody>
              <CardTitle   className="card-title  text-secondary"><h4>Meet Our Team</h4></CardTitle>
              <CardText className="card-text">
                Our team of instructors and staff are dedicated to helping students achieve their goals. Meet some of our key team members:
                <ul>
                  <li>Mr Haris ali, Director</li>
                  <li>Mr Haroon, Founder, CEO</li>
                  <li>Miss Muqadas, Lead Instructor</li>
                  <li>Mr Asim, Student Support Manager</li>
                  <li>Mr hassan, Finance incharge</li>

                </ul>
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AboutUs;