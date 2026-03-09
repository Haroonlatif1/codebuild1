import React, { useState } from 'react';
import { Container, Row, Col, Card, Modal, Badge } from 'react-bootstrap';
import { Play, X, Award, Code, Sparkles } from 'lucide-react';
import './css/Projects.css';

const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const studentProjects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      studentName: "Ahmed Hassan",
      course: "Full Stack Web Development",
      description: "A fully functional e-commerce platform with payment integration, user authentication, and admin dashboard.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=450&fit=crop",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      achievement: "Best Project Award 2024"
    },
    {
      id: 2,
      title: "AI-Powered Chatbot",
      studentName: "Fatima Ali",
      course: "Full Stack Web Dev with Artificial Intelligence",
      description: "An intelligent customer service chatbot using natural language processing and machine learning.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=450&fit=crop",
      technologies: ["Python", "TensorFlow", "React", "Flask"],
      achievement: "Innovation Excellence"
    },
    {
      id: 3,
      title: "Mobile Fitness Tracker",
      studentName: "Bilal Khan",
      course: "Android App Development",
      description: "A comprehensive fitness tracking app with workout plans, nutrition tracking, and progress analytics.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=450&fit=crop",
      technologies: ["Kotlin", "Firebase", "Android SDK"],
      achievement: "Most Creative Project"
    },
    {
      id: 4,
      title: "Data Visualization Dashboard",
      studentName: "Sara Mahmood",
      course: "Data Analysis with Python",
      description: "Interactive dashboard for business analytics with real-time data visualization and reporting.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
      technologies: ["Python", "Pandas", "Plotly", "Dash"],
      achievement: "Top Performer"
    },
    {
      id: 5,
      title: "Social Media Web App",
      studentName: "Usman Tariq",
      course: "Frontend Web dev with react",
      description: "A modern social networking platform with real-time messaging, posts, and interactive features.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop",
      technologies: ["React", "Redux", "Socket.io", "CSS3"],
      achievement: "Outstanding Design"
    },
    {
      id: 6,
      title: "Cyber Security Tool",
      studentName: "Zainab Malik",
      course: "Ethical Hacking and Cyber Security",
      description: "Network security scanner and vulnerability assessment tool for enterprise systems.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop",
      technologies: ["Python", "Nmap", "Wireshark", "Linux"],
      achievement: "Security Excellence"
    }
  ];

  const openModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <section className="projects-section">
      <Container fluid>
        <div className="section-header">
          <div className="header-decoration">
            <Sparkles className="sparkle-icon" />
          </div>
          <h1 className="section-title">Student Success Stories</h1>
          <p className="section-subtitle">
            Discover amazing projects created by our talented students
          </p>
          <div className="title-underline"></div>
        </div>

        <Row className="justify-content-center g-4">
          {studentProjects.map((project, index) => (
            <Col key={project.id} lg={4} md={6} sm={12}>
              <Card 
                className="project-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="project-thumbnail-wrapper">
                  <img 
                    src={project.thumbnail} 
                    alt={project.title}
                    className="project-thumbnail"
                  />
                  <div className="thumbnail-overlay">
                    <button 
                      className="play-button"
                      onClick={() => openModal(project)}
                      aria-label="Play video"
                    >
                      <div className="play-button-circle">
                        <Play className="play-icon" fill="currentColor" />
                      </div>
                      <span className="play-text">Watch Demo</span>
                    </button>
                  </div>
                  {project.achievement && (
                    <div className="achievement-badge">
                      <Award size={14} />
                      <span>{project.achievement}</span>
                    </div>
                  )}
                </div>
                
                <Card.Body className="project-body">
                  <div className="project-header">
                    <h3 className="project-title">{project.title}</h3>
                    <div className="student-info">
                      <div className="student-avatar">
                        {project.studentName.charAt(0)}
                      </div>
                      <div>
                        <p className="student-name">{project.studentName}</p>
                        <p className="student-course">{project.course}</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="project-description">{project.description}</p>
                  
                  <div className="tech-stack">
                    <Code size={16} className="tech-icon" />
                    <div className="tech-tags">
                      {project.technologies.map((tech, i) => (
                        <Badge key={i} className="tech-badge">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Video Modal */}
      <Modal 
        show={isModalOpen} 
        onHide={closeModal}
        centered
        size="xl"
        className="video-modal"
      >
        <div className="modal-content-wrapper">
          <button 
            className="modal-close-button"
            onClick={closeModal}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
          
          {selectedProject && (
            <>
              <div className="modal-header-section">
                <h2 className="modal-title">{selectedProject.title}</h2>
                <div className="modal-student-info">
                  <span className="modal-student-name">
                    By {selectedProject.studentName}
                  </span>
                  <span className="modal-separator">•</span>
                  <span className="modal-course">{selectedProject.course}</span>
                </div>
              </div>
              
              <div className="video-container">
                <div className="video-wrapper">
                  <iframe
                    src={selectedProject.videoUrl}
                    title={selectedProject.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="video-iframe"
                  ></iframe>
                </div>
              </div>
              
              <div className="modal-footer-section">
                <p className="modal-description">{selectedProject.description}</p>
                <div className="modal-tech-stack">
                  {selectedProject.technologies.map((tech, i) => (
                    <Badge key={i} className="modal-tech-badge">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </section>
  );
};

export default ProjectsSection;