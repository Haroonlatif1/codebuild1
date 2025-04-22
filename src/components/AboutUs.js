import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText, Carousel } from 'react-bootstrap';
import {useNavigate} from "react-router-dom"
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Parallax } from 'react-scroll-parallax';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import "../components/css/AboutUs.css";

function AboutUs() {
  // Counter animation with smooth easing
  const [courses, setCourses] = useState(0);
  const [instructors, setInstructors] = useState(0);
  const [students, setStudents] = useState(0);
  const [successRate, setSuccessRate] = useState(0);
  const navigate=useNavigate()

  // Scroll animations
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Particle.js configuration
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const particlesLoaded = (container) => {
    console.log(container);
  };
  const handlerButton=()=>{
    navigate("/")
  }

  // Counter animation on scroll
  useEffect(() => {
    const animateCounters = () => {
      const scrollPosition = window.scrollY;
      const countersSection = document.querySelector('.counter-section');
      const sectionTop = countersSection.offsetTop;
      const sectionHeight = countersSection.offsetHeight;
      
      if (scrollPosition > sectionTop - window.innerHeight + sectionHeight / 3) {
        // Animate with easing function
        const animate = (start, end, duration, setter) => {
          let startTimestamp = null;
          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easedProgress = easeOutQuad(progress);
            setter(Math.floor(easedProgress * (end - start) + start))
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        };

        const easeOutQuad = (t) => t * (2 - t);

        animate(0, 15, 2000, setCourses);
        animate(0, 7, 2000, setInstructors);
        animate(0, 300, 2000, setStudents);
        animate(0, 92, 2000, setSuccessRate);
      }
    };

    window.addEventListener('scroll', animateCounters);
    return () => window.removeEventListener('scroll', animateCounters);
  }, []);

  const teamMembers = [
    {
      name: 'Mr Waheed Ahmad',
      role: 'Director',
      image: '../../codebui2.png',
      specialization: 'Educational Leadership',
    },
    {
      name: 'Mr Haroon',
      role: 'Lead Instructor',
      image: '../../codebui2.png',
      specialization: 'Artificial intelligence and Data science',
    },
    {
      name: 'Mr Asim',
      role: 'Student Support Manager',
      image: '../../codebui2.png',
      specialization: 'Student Counseling and Support Services',
    },
    {
      name: 'Miss Muqadas',
      role: 'Lead Instructor',
      image: '../../codebui2.png',
      specialization: 'Full stack web developer',
    },
    {
      name: 'Mr Hassan',
      role: 'Finance Incharge',
      image: '../../codebui2.png',
      specialization: 'Financial Planning and Budget Management',
    },
  ];

  // Carousel items with better descriptions
  const carouselItems = [
    {
      image: 'll.png',
      title: 'Our Founders',
      description: 'Visionaries who transformed education with technology',
      overlay: 'rgba(0, 0, 0, 0.5)'
    },
    {
      image: 'll.png',
      title: 'Our Campus',
      description: 'Where innovation meets state-of-the-art learning',
      overlay: 'rgba(0, 0, 100, 0.5)'
    },
    {
      image: 'll.png',
      title: 'Our Community',
      description: 'A diverse family of passionate learners',
      overlay: 'rgba(100, 0, 0, 0.5)'
    }
  ];

  return (
    <div className="about-us-page">
      {/* Animated Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#1a1a1a",
            },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 100,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffa500",
            },
            links: {
              color: "#ffa500",
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 60,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
      />

      {/* Hero Section with Parallax */}
      <section className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="hero-title">Building the Future of Tech Education</h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Empowering minds through innovative learning experiences
          </motion.p>
          <motion.div
            className="scroll-indicator"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span>Scroll to explore</span>
            <div className="arrow-down"></div>
          </motion.div>
        </motion.div>
        <div className="hero-overlay"></div>
      </section>

      <Container fluid className="about-us" ref={ref}>
        {/* About Us Section */}
        <motion.section 
          className="about-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <Row className="justify-content-center">
            <Col md={10} lg={8} xl={7}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Card className="glass-card">
                  <CardBody>
                    <CardTitle className="section-title">
                      <motion.h4 
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        About Us
                      </motion.h4>
                    </CardTitle>
                    <CardText className="section-text">
                      <motion.p
                        initial={{ x: 20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        Welcome to Codebuild, a premier educational institution dedicated to empowering students with knowledge and skills to succeed in their chosen careers. With a strong commitment to excellence, we offer a wide range of courses designed to meet the evolving needs of the industry.
                      </motion.p>
                    </CardText>
                  </CardBody>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </motion.section>

        {/* Our Story Section with Parallax Carousel */}
        <motion.section 
          className="story-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <Row className="justify-content-center">
            <Col md={10} lg={8} xl={7}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Card className="glass-card">
                  <CardBody>
                    <CardTitle className="section-title">
                      <motion.h4
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        Our Story
                      </motion.h4>
                    </CardTitle>
                    <CardText className="section-text">
                      <motion.p
                        initial={{ x: 20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        Our institute has grown to become a leading provider of quality education, with a focus on innovation, creativity, and critical thinking. Our team of experienced instructors and industry experts are passionate about helping students achieve their full potential.
                      </motion.p>
                    </CardText>
                    
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                    >
                      <Carousel fade indicators={false} className="cinematic-carousel">
                        {carouselItems.map((item, index) => (
                          <Carousel.Item key={index} interval={5000}>
                            <div className="carousel-image-container">
                              <img
                                className="d-block w-100"
                                src={item.image}
                                alt={item.title}
                              />
                              <div 
                                className="image-overlay"
                                style={{ backgroundColor: item.overlay }}
                              ></div>
                            </div>
                            <Carousel.Caption>
                              <h3>{item.title}</h3>
                              <p>{item.description}</p>
                            </Carousel.Caption>
                          </Carousel.Item>
                        ))}
                      </Carousel>
                    </motion.div>
                  </CardBody>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </motion.section>

        {/* Stats Counter Section */}
        <section className="counter-section">
          <Row className="justify-content-center">
            {[
              { value: courses, label: "Courses Offered", suffix: "+" },
              { value: instructors, label: "Instructors", suffix: "+" },
              { value: students, label: "Alumni Students", suffix: "+" },
              { value: successRate, label: "Success Rate", suffix: "%", decimal: true }
            ].map((stat, index) => (
              <Col key={index} xs={12} sm={6} md={3} className="counter-col">
                <motion.div
                  className="stat-card"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                >
                  <div className="stat-value">
                    {stat.decimal ? stat.value.toFixed(1) : stat.value}{stat.suffix}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              </Col>
            ))}
          </Row>
        </section>

        {/* Mission Section */}
        <motion.section 
          className="mission-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <Row className="justify-content-center">
            <Col md={10} lg={8} xl={7}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Card className="glass-card">
                  <CardBody>
                    <CardTitle className="section-title">
                      <motion.h4
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        Our Mission
                      </motion.h4>
                    </CardTitle>
                    <CardText className="section-text">
                      <motion.ul className="mission-list">
                        {[
                          "Providing high-quality education that meets industry standards",
                          "Fostering a supportive learning environment that encourages growth",
                          "Empowering students to succeed in their chosen careers",
                          "Bridging the gap between academia and industry needs"
                        ].map((item, index) => (
                          <motion.li
                            key={index}
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                          >
                            {item}
                          </motion.li>
                        ))}
                      </motion.ul>
                    </CardText>
                  </CardBody>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </motion.section>

        {/* Values Section */}
        <motion.section 
          className="values-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <Row className="justify-content-center">
            <Col md={10} lg={8} xl={7}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Card className="glass-card">
                  <CardBody>
                    <CardTitle className="section-title">
                      <motion.h4
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        Our Values
                      </motion.h4>
                    </CardTitle>
                    <CardText className="section-text">
                      <motion.div className="values-grid">
                        {[
                          { icon: "🌟", title: "Excellence", desc: "In education and outcomes" },
                          { icon: "💡", title: "Innovation", desc: "Creative problem solving" },
                          { icon: "🧠", title: "Critical Thinking", desc: "Analytical approach" },
                          { icon: "🤝", title: "Collaboration", desc: "Teamwork makes the dream work" },
                          { icon: "🎯", title: "Focus", desc: "Student-centered approach" },
                          { icon: "❤️", title: "Passion", desc: "For teaching and learning" }
                        ].map((value, index) => (
                          <motion.div 
                            key={index}
                            className="value-card"
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5 }}
                          >
                            <div className="value-icon">{value.icon}</div>
                            <h5>{value.title}</h5>
                            <p>{value.desc}</p>
                          </motion.div>
                        ))}
                      </motion.div>
                    </CardText>
                  </CardBody>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </motion.section>

        {/* Team Section */}
        <motion.section 
          className="team-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <Row className="justify-content-center">
            <Col md={10} lg={8} xl={7}>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Card className="glass-card">
                  <CardBody>
                    <CardTitle className="section-title">
                      <motion.h4
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        Meet Our Team
                      </motion.h4>
                    </CardTitle>
                    <CardText className="section-text">
                      <motion.p
                        initial={{ x: 20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        Our exceptional team of educators and professionals are committed to your success.
                      </motion.p>
                    </CardText>
                    
                    <motion.div className="team-grid">
                      {teamMembers.map((member, index) => (
                        <motion.div
                          key={index}
                          className="team-card"
                          initial={{ y: 50, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.15, duration: 0.6 }}
                          whileHover={{ y: -10, boxShadow: "0 15px 30px rgba(255, 165, 0, 0.3)" }}
                        >
                          <div className="team-image-container">
                            <img
                              src={member.image}
                              alt={member.name}
                              className="team-image"
                            />
                            <div className="image-overlay"></div>
                          </div>
                          <div className="team-info">
                            <h5>{member.name}</h5>
                            <p className="role">{member.role}</p>
                            <p className="specialization">{member.specialization}</p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardBody>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </motion.section>

        {/* Call to Action */}
        <motion.section 
          className="cta-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <Row className="justify-content-center">
            <Col md={10} lg={8} xl={7}>
              <motion.div
                className="cta-card"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h3>Ready to start your journey with us?</h3>
                <motion.button
                  className="cta-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlerButton}
                >
                  Join Codebuild Today
                </motion.button>
              </motion.div>
            </Col>
          </Row>
        </motion.section>
      </Container>
    </div>
  );
}

export default AboutUs;