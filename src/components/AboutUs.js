import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Carousel } from 'react-bootstrap';
import "../components/css/AboutUs.css";

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
        setSuccessRate(92);
      } else {
        setCourses(0);
        setInstructors(0);
        setStudents(0);
        setSuccessRate(0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const teamMembers = [
    {
      name: 'Mr Waheed Ahmad',
      role: 'Director',
      image: '../../codebui2.png', // Replace with actual image path
      specialization: 'Educational Leadership ',
    },
    {
      name: 'Mr Haroon',
      role: 'Lead Instructor',
      image: '../../codebui2.png', // Replace with actual image path
      specialization: 'Artificial intelligence and Data science',
    },
    {
      
      name: 'Mr Asim',
      role: 'Student Support Manager',
      image: '../../codebui2.png', // Replace with actual image path
      specialization: 'Student Counseling and Support Services',
    },
    {
      name: 'Miss Muqadas',
      role: 'Lead Instructor',
      image: '../../codebui2.png', // Replace with actual image path
      specialization: 'Full stack web developer',
    },
    {
      name: 'Mr Hassan',
      role: 'Finance Incharge',
      image: '../../codebui2.png', // Replace with actual image path
      specialization: 'Financial Planning and Budget Management',
    },
  ];

  return (
    <Container fluid className="about-us">
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={11}>
          <Card className="card-border1 ">
            <CardBody>
              <CardTitle className="card-title text-secondary"><h4>About Us</h4></CardTitle>
              <CardText className="card-text">
                Welcome to Codebuild, a premier educational institution dedicated to empowering students with knowledge and skills to succeed in their chosen careers. With a strong commitment to excellence, we offer a wide range of courses designed to meet the evolving needs of the industry. We have world best professional teachers who gives you real world tech industry experience.
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={11}>
          <Card className="card-border1 ">
            <CardBody>
              <CardTitle className="card-title text-secondary"><h4>Our Story</h4></CardTitle>
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
          <Card className="card-border12 bg-dark">
            <CardBody>
              <CardTitle className="card-title text-secondary">Courses Offered:</CardTitle>
              <CardText className="card-text">
                <span className="counter-value">{courses}</span>+
              </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3} xl={2} className="counter-col">
          <Card className="card-border12 bg-dark">
            <CardBody>
              <CardTitle className="card-title text-secondary">Instructors:</CardTitle>
              <CardText className="card-text">
                <span className="counter-value">{instructors}</span>+
              </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3} xl={2} className="counter-col">
          <Card className="card-border12 bg-dark">
            <CardBody>
              <CardTitle className="card-title text-secondary">Our Alumni Students:</CardTitle>
              <CardText className="card-text">
                <span className="counter-value">{students}</span>+
              </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col xs={12} sm={6} md={4} lg={3} xl={2} className="counter-col">
          <Card className="card-border12 bg-dark">
            <CardBody>
              <CardTitle className="card-title text-secondary">Success Rate:</CardTitle>
              <CardText className="card-text">
                <span className="counter-value">{successRate.toFixed(1)}%</span>
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={8}>
          <Card className="card-border1 ">
            <CardBody>
              <CardTitle className="card-title text-secondary"><h4>Our Mission</h4></CardTitle>
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
          <Card className="card-border1 ">
            <CardBody>
              <CardTitle className="card-title text-secondary"><h4>Our Values</h4></CardTitle>
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

      {/* Meet Our Team Section */}
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={8}>
          <Card className="cardd ">
            <CardBody>
              <CardTitle className="card-title text-secondary"><h4>Meet Our Team</h4></CardTitle>
              <Row>
                {teamMembers.map((member, index) => (
                  <Col key={index} xs={12} sm={8} md={6} xl={4} className="mb-4">
                    <Card className="card-border-team bg-secondary">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="img-fluid rounded-circle mx-auto d-block mt-3"
                        style={{ width: '150px', height: '150px' }}
                      />
                      <CardBody>
                        <CardTitle className="text-center">{member.name}</CardTitle>
                        <CardText className="text-center txt2"><strong>{member.role}</strong></CardText>
                        <CardText className="text-center txt2">{member.specialization}</CardText>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AboutUs;
