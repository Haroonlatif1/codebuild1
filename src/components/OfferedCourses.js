
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import "../components/css/OfferedCo.css"
function OfferedCourses() {
  return (
    <Container fluid className="offered-courses bg-dark">
      <Row>
        <Col md={12} className="text-center mb-4">
          <h2>Offered Courses</h2>
        </Col>
        {courses.map((course, index) => (
          <Col md={4} key={index}>
            <Card className="mb-4">
              <Card.Img variant="top" src={course.image} />
              <Card.Body>
                <Card.Title>{course.name}</Card.Title>
                <Card.Text>{course.description}<br/>{course.modules.title}</Card.Text>
                <Button variant="outline-primary">Enroll Now</Button>
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
    "name": "Full Stack Web Development",
    "description": "Learn full stack web development with our expert instructors.",
    "image": "https://example.com/full-stack-web-dev.jpg",
    "modules": [
      {
        "title": "Introduction to Web Development",
        "description": "Overview of web development, front-end and back-end technologies."
      },
      {
        "title": "HTML & CSS Basics",
        "description": "Fundamentals of HTML and CSS for building static web pages."
      },
      {
        "title": "JavaScript Fundamentals",
        "description": "Introduction to JavaScript, including syntax, control structures, and functions."
      },
      {
        "title": "Advanced JavaScript",
        "description": "In-depth JavaScript concepts, including ES6+ features, asynchronous programming, and closures."
      },
      {
        "title": "ReactJS",
        "description": "Learn ReactJS for building interactive user interfaces, including components, props, state, and lifecycle methods."
      },
      {
        "title": "State Management with Redux",
        "description": "Managing application state using Redux and integrating it with React."
      },
      {
        "title": "Node.js Basics",
        "description": "Introduction to Node.js and building server-side applications with JavaScript."
      },
      {
        "title": "Express.js",
        "description": "Building RESTful APIs with Express.js and handling HTTP requests."
      },
      {
        "title": "MongoDB",
        "description": "Introduction to MongoDB, a NoSQL database, including CRUD operations and schema design."
      },
      {
        "title": "Mongoose",
        "description": "Using Mongoose for object data modeling (ODM) with MongoDB in a Node.js environment."
      },
      {
        "title": "Full Stack Integration",
        "description": "Integrating front-end (ReactJS) with back-end (Node.js, Express.js) and database (MongoDB) to build a full-stack application."
      },
      {
        "title": "Authentication & Authorization",
        "description": "Implementing user authentication and authorization using JWT and sessions."
      },
      {
        "title": "Deployment",
        "description": "Deploying your full-stack application to a cloud service such as Heroku or AWS."
      },
      {
        "title": "Testing",
        "description": "Writing tests for front-end and back-end components to ensure application reliability."
      }
    ]
  },
  
  {
    name: 'Data Analysis with Python',
    description: 'Master data analysis with Python and become a data scientist.',
    image: 'https://example.com/data-analysis-python.jpg',
  },
  {
    name: 'Business Development',
    description: 'Learn business development strategies and grow your business.',
    image: 'https://example.com/business-development.jpg',
  },
  {
    name: 'Android App Development',
    description: 'Create Android apps with our comprehensive course.',
    image: 'https://example.com/android-app-dev.jpg',
  },
  {
    name: 'MS Office',
    description: 'Master MS Office tools and become more productive.',
    image: 'https://example.com/ms-office.jpg',
  },
  {
    name: 'Ethical Hacking and Cyber Security',
    description: 'Learn ethical hacking and cyber security techniques.',
    image: '../../public/ds.jpg',
  },
];

export default OfferedCourses;
