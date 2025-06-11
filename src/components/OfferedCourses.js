import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faStar, faRocket, faGraduationCap, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import "../components/css/OfferedCo.css";

function OfferedCourses() {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(null);
  const containerRef = useRef(null);
  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  const outlinehandler = () => {
    alert("Updated course outlines are not available. Contact us on WhatsApp. Redirecting you to the contact page.");
    setTimeout(() => {
      navigate('/contactus');
    }, 1000);
  };

  const clickHandler = (title) => {
    navigate('/', { state: { title } });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const hoverVariants = {
    rest: { scale: 1, zIndex: 1 },
    hover: { 
      scale: 1.05, 
      zIndex: 10,
      transition: {
        duration: 0.4,
        ease: [0.6, 0.01, -0.05, 0.95]
      }
    }
  };

  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 }
  };

  return (
    <ParallaxProvider>
      <div className="cinematic-courses-container">
        {/* Animated Background Particles */}
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            particles: {
              number: {
                value: 40,
                density: {
                  enable: true,
                  value_area: 800
                }
              },
              color: {
                value: ["#3a86ff", "#8338ec", "#ff006e"]
              },
              shape: {
                type: "circle"
              },
              opacity: {
                value: 0.5,
                random: true,
                anim: {
                  enable: true,
                  speed: 1,
                  opacity_min: 0.1,
                  sync: false
                }
              },
              size: {
                value: 3,
                random: true,
                anim: {
                  enable: true,
                  speed: 2,
                  size_min: 0.3
                }
              },
              line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.2,
                width: 1
              },
              move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                  enable: true,
                  rotateX: 600,
                  rotateY: 1200
                }
              }
            },
            interactivity: {
              detect_on: "canvas",
              events: {
                onhover: {
                  enable: true,
                  mode: "grab"
                },
                onclick: {
                  enable: true,
                  mode: "push"
                },
                resize: true
              },
              modes: {
                grab: {
                  distance: 140,
                  line_linked: {
                    opacity: 0.5
                  }
                },
                push: {
                  particles_nb: 4
                }
              }
            },
            retina_detect: true
          }}
        />

        {/* Parallax Scrolling Header */}
        <div className="parallax-header">
          <Parallax speed={-10}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="header-content"
            >
              <h1 className="cinematic-title">
                <span className="title-line">Transform Your Future</span>
                <span className="title-line">With Our Premium Courses</span>
              </h1>
              <motion.p 
                className="cinematic-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                Industry-leading programs taught by experts
              </motion.p>
            </motion.div>
          </Parallax>
        </div>

        {/* Main Content */}
        <Container fluid className="courses-main-container">
          <Row className="justify-content-center">
            <Col xs={12} className="text-center mb-5">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="section-title">
                  <FontAwesomeIcon icon={faGraduationCap} className="title-icon" />
                  Explore Our Catalog
                  <FontAwesomeIcon icon={faGraduationCap} className="title-icon" />
                </h2>
                <p className="section-description">
                  Hover over cards for details or scroll to discover more
                </p>
              </motion.div>
            </Col>
          </Row>

          {/* Courses Grid */}
          <motion.div
            ref={containerRef}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            className="courses-grid-container"
          >
            <Row className="g-4 justify-content-center">
              {courses.map((course, index) => (
                <Col xs={12} sm={6} md={4} lg={6} xl={4} key={index}>
                  <motion.div
                    variants={itemVariants}
                    whileHover="hover"
                    whileTap={{ scale: 0.98 }}
                    initial="rest"
                    animate="rest"
                    className="course-card-wrapper"
                    onMouseEnter={() => setActiveCard(index)}
                    onMouseLeave={() => setActiveCard(null)}
                  >
                    <motion.div 
                      variants={hoverVariants}
                      className={`course-card ${activeCard === index ? 'active' : ''}`}
                    >
                      <div className="card-image-container">
                        <motion.div
                          variants={imageVariants}
                          className="image-overlay"
                        />
                        <Card.Img 
                          variant="top" 
                          src={course.image} 
                          alt={course.name}
                          className="card-image"
                        />
                        <div className="card-badge">
                          <FontAwesomeIcon icon={faStar} className="me-1" />
                          Featured
                        </div>
                      </div>
                      <Card.Body className="card-content">
                        <Card.Title className="card-title">
                          {course.name}
                          <motion.div 
                            className="title-underline"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                          />
                        </Card.Title>
                        <Card.Text className="card-body">
                          {course.description}
                          <div className="course-meta">
                            <span className="duration">
                              <FontAwesomeIcon icon={faRocket} className="me-2" />
                              {course.duration} months intensive
                            </span>
                          </div>
                        </Card.Text>
                        <div className="card-actions">
                          <motion.div 
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }}
                            className="action-button"
                          >
                            <Button
                              onClick={() => clickHandler(course.name)}
                              className="enroll-button"
                            >
                              Enroll Now <FontAwesomeIcon icon={faChevronRight} />
                            </Button>
                          </motion.div>
                          <motion.div 
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }}
                            className="action-button"
                          >
                            <Button
                              className="outline-button"
                              onClick={outlinehandler}
                            >
                              <FontAwesomeIcon icon={faDownload} className="me-2" />
                              Syllabus
                            </Button>
                          </motion.div>
                        </div>
                      </Card.Body>
                    </motion.div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="cta-section"
          >
            <h3>Ready to start your journey?</h3>
            <Button className="cta-button">
             <Link to="/contactus">Contact Our Advisors <FontAwesomeIcon icon={faChevronRight} /></Link> 
            </Button>
          </motion.div>
        </Container>
      </div>
    </ParallaxProvider>
  );
}

const courses = [
  {
    name: "Full Stack Web Development",
    description: "Master both frontend and backend technologies to build complete web applications from scratch with modern frameworks.",
    image: "../../webdev.png",
    duration: 6
  },
  {
    name: 'Data Science with Python',
    description: 'Harness Python for data manipulation, visualization, and machine learning with real-world datasets.',
    image: '../../ds.jpg',
    duration: 6
  },
  {
    name: 'Business Development Mastery',
    description: 'Develop strategic thinking and practical skills to grow businesses exponentially in competitive markets.',
    image: '../../bd.jpg',
    duration: 3
  },
  {
    name: 'Mobile App Development',
    description: 'Create professional Android and iOS applications using modern cross-platform development practices.',
    image: '../../and.jpg',
    duration: 6
  },
  {
    name: 'Microsoft Office Professional',
    description: 'Become proficient in all MS Office applications for maximum productivity in business environments.',
    image: '../../ms.jpg',
    duration: 3
  },
  {
    name: 'Cybersecurity & Ethical Hacking',
    description: 'Learn cybersecurity techniques to protect systems and networks from sophisticated digital attacks.',
    image: '../../ethical.jpg',
    duration: 6
  },
  {
    name: 'Frontend Development with React',
    description: 'Build dynamic, responsive user interfaces with React, Redux, and modern JavaScript (ES6+).',
    image: '../../frontend.jpg',
    duration: 3
  },
  {
    name: 'Python Programming Bootcamp',
    description: 'From fundamentals to advanced concepts - become a Python programming expert with hands-on projects.',
    image: '../../python.jpg',
    duration: 2
  },
];

export default OfferedCourses;