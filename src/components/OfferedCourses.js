import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import "../components/css/OfferedCo.css";

function OfferedCourses() {
  const navigate = useNavigate(); // Initialize useNavigate

  const outlinehandler = () => {
    alert("Updated course outlines are not available. Contact us on WhatsApp. Redirecting you to the contact page.");
    setTimeout(() => {
      navigate('/contactus');
    }, 1000);
  };

  const clickHandler = (title) => {
    navigate('/', { state: { title } }); // Pass title as state
  };

  return (
    <Container fluid className="offered-courses-container bg-dark">
      <Row>
        <Col xs={12} className="text-center text-white">
          <h1>Offered Courses</h1>
        </Col>
        {courses.map((course, index) => (
          <Col xs={12} sm={6} md={4} lg={3} xl={4} key={index} className="mb-4">
            <Card className="card">
              <Card.Img variant="top" src={course.image} alt='course' height={250} />
              <Card.Body className="card-content">
                <Card.Title className="card-title text-white">{course.name}</Card.Title>
                <Card.Text className="card-body text-white">{course.description}<br/>Duration: {course.duration} months</Card.Text>
                <Button
                  onClick={() => clickHandler(course.name)}
                  variant="outline-primary"
                  className="button"
                  style={{ marginRight: '10px', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                >
                  Enroll now
                </Button>
                <Button
                  variant="outline-warning"
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                  onClick={outlinehandler} // Attach the onClick handler to the Button
                >
                  <FontAwesomeIcon icon={faDownload} style={{ marginRight: '5px' }} />
                  Course outlines
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

const courses = [
  {
    name: "Full Stack Web Development",
    description: "Learn full stack web development with our expert instructors.",
    image: "../../webdev.png",
    duration:6
  },
  {
    name: 'Data Analysis with Python',
    description: 'Master data analysis with Python and become a data scientist.',
    image: '../../ds.jpg',
    duration:6

  },
  {
    name: 'Business Development',
    description: 'Learn business development strategies and grow your business.',
    image: '../../bd.jpg',
    duration:3

  },
  {
    name: 'Android App Development',
    description: 'Create Android apps with our comprehensive course.',
    image: '../../and.jpg',
    duration:6

  },
  {
    name: 'MS Office',
    description: 'Master MS Office tools and become more productive.',
    image: '../../ms.jpg',
    duration:3

  },
  {
    name: 'Ethical Hacking and Cyber Security',
    description: 'Learn ethical hacking and cyber security techniques.',
    image: '../../ethical.jpg',
    duration:6

  },
  {
    name: 'Frontend web development With react',
    description: 'Learn frontend web development with react, git, github',
    image: '../../frontend.jpg',
    duration:3

  },
  {
    name: 'Python programming',
    description: 'Learn python from Zero to hero level and start coding',
    image: '../../python.jpg',
    duration:2

  },
];

export default OfferedCourses;
