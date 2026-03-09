import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { Play, Award, TrendingUp, Target, Zap, Users, Clock, BookOpen, Brain, Star, ChevronRight, Video, Monitor } from 'lucide-react';
import './css/LectureClips.css';

const LectureClipsSection = () => {
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [beforeAfterMode, setBeforeAfterMode] = useState({});
  const [sliderPosition, setSliderPosition] = useState({});
  const [activeTestimonial, setActiveTestimonial] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const canvasRefs = useRef({});
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);

  const lectureClips = [
    {
      id: 1,
      title: "Introduction to React Hooks",
      instructor: "Sir Ahmed Khan",
      course: "Full Stack Web Development",
      duration: "12:45",
      students: "450+",
      
      // Main lecture video
      videoUrl: "https://www.youtube.com/embed/TNhaISOUy6Q",
      lectureThumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop",
      
      // Student taking notes BEFORE and AFTER the lecture
      studentBeforeLecture: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop",
      studentAfterLecture: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
      
      // Live Stats
      stats: {
        liveViewers: 145,
        averageEngagement: 94,
        questionsAsked: 23,
        completionRate: 89
      },
      
      // Parent Testimonials about THIS lecture
      parentTestimonials: [
        {
          parent: "Mrs. Ayesha Khan",
          child: "Ahmed (19 years)",
          quote: "I watched this lecture with my son. The instructor explained React so clearly, even I understood it!",
          rating: 5,
          beforeSkill: "No coding knowledge",
          afterSkill: "Built 3 React apps"
        },
        {
          parent: "Mr. Hassan Ali",
          child: "Sara (21 years)",
          quote: "Sara watched this lecture 3 times. Now she's teaching her friends React!",
          rating: 5,
          beforeSkill: "Basic HTML/CSS",
          afterSkill: "Full Stack Developer"
        }
      ],
      
      // What students learn in THIS lecture
      lectureTopics: [
        { topic: "useState Hook", mastery: 95 },
        { topic: "useEffect Hook", mastery: 90 },
        { topic: "Custom Hooks", mastery: 88 }
      ],
      
      // Student outcomes from THIS specific lecture
      lectureImpact: {
        studentsPassed: "98%",
        avgTestScore: "92/100",
        projectsCompleted: "450+"
      },
      
      // Live classroom moment from this lecture
      classroomMoment: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=450&fit=crop"
    },
    {
      id: 2,
      title: "Machine Learning Basics",
      instructor: "Dr. Fatima Ali",
      course: "Full Stack Web Dev with AI",
      duration: "18:30",
      students: "380+",
      
      videoUrl: "https://www.youtube.com/embed/ukzFI9rgwfU",
      lectureThumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=450&fit=crop",
      
      studentBeforeLecture: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
      studentAfterLecture: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      
      stats: {
        liveViewers: 128,
        averageEngagement: 92,
        questionsAsked: 31,
        completionRate: 87
      },
      
      parentTestimonials: [
        {
          parent: "Dr. Nazia Ahmed",
          child: "Bilal (22 years)",
          quote: "This lecture changed everything! Bilal went from confused to confident in just one session.",
          rating: 5,
          beforeSkill: "Zero AI knowledge",
          afterSkill: "Built ML models"
        }
      ],
      
      lectureTopics: [
        { topic: "Neural Networks", mastery: 96 },
        { topic: "TensorFlow Basics", mastery: 89 },
        { topic: "Data Preprocessing", mastery: 92 }
      ],
      
      lectureImpact: {
        studentsPassed: "96%",
        avgTestScore: "90/100",
        projectsCompleted: "380+"
      },
      
      classroomMoment: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=450&fit=crop"
    },
    {
      id: 3,
      title: "Python Data Structures",
      instructor: "Sir Bilal Hassan",
      course: "Python Programming",
      duration: "15:20",
      students: "520+",
      
      videoUrl: "https://www.youtube.com/embed/8DvywoWv6fI",
      lectureThumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=450&fit=crop",
      
      studentBeforeLecture: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&h=400&fit=crop",
      studentAfterLecture: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=400&fit=crop",
      
      stats: {
        liveViewers: 167,
        averageEngagement: 93,
        questionsAsked: 28,
        completionRate: 91
      },
      
      parentTestimonials: [
        {
          parent: "Mrs. Sana Malik",
          child: "Usman (20 years)",
          quote: "Sir Bilal makes complex topics so simple. Usman aced his Python exam after this lecture!",
          rating: 5,
          beforeSkill: "Struggled with lists",
          afterSkill: "Mastered all DS"
        }
      ],
      
      lectureTopics: [
        { topic: "Lists & Tuples", mastery: 94 },
        { topic: "Dictionaries", mastery: 91 },
        { topic: "Sets & Arrays", mastery: 89 }
      ],
      
      lectureImpact: {
        studentsPassed: "97%",
        avgTestScore: "93/100",
        projectsCompleted: "520+"
      },
      
      classroomMoment: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=450&fit=crop"
    },
    {
      id: 4,
      title: "Advanced Cyber Security",
      instructor: "Sir Usman Tariq",
      course: "Ethical Hacking",
      duration: "22:15",
      students: "290+",
      
      videoUrl: "https://www.youtube.com/embed/hkRGIovD20s",
      lectureThumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop",
      
      studentBeforeLecture: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=600&h=400&fit=crop",
      studentAfterLecture: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=400&fit=crop",
      
      stats: {
        liveViewers: 98,
        averageEngagement: 96,
        questionsAsked: 35,
        completionRate: 88
      },
      
      parentTestimonials: [
        {
          parent: "Mr. Tariq Jameel",
          child: "Zain (23 years)",
          quote: "This lecture opened my son's eyes to cybersecurity. Now he's certified!",
          rating: 5,
          beforeSkill: "Basic IT knowledge",
          afterSkill: "CEH Certified"
        }
      ],
      
      lectureTopics: [
        { topic: "Network Security", mastery: 93 },
        { topic: "Penetration Testing", mastery: 90 },
        { topic: "Security Tools", mastery: 88 }
      ],
      
      lectureImpact: {
        studentsPassed: "95%",
        avgTestScore: "91/100",
        projectsCompleted: "290+"
      },
      
      classroomMoment: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=450&fit=crop"
    },
    {
      id: 5,
      title: "Database Design Patterns",
      instructor: "Ms. Sara Mahmood",
      course: "Full Stack Development",
      duration: "16:40",
      students: "410+",
      
      videoUrl: "https://www.youtube.com/embed/ztHopE5Wnpc",
      lectureThumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=450&fit=crop",
      
      studentBeforeLecture: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=600&h=400&fit=crop",
      studentAfterLecture: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
      
      stats: {
        liveViewers: 134,
        averageEngagement: 91,
        questionsAsked: 26,
        completionRate: 90
      },
      
      parentTestimonials: [
        {
          parent: "Mrs. Amina Shah",
          child: "Hira (21 years)",
          quote: "Ms. Sara's teaching style is amazing. Hira now designs databases for real clients!",
          rating: 5,
          beforeSkill: "No DB knowledge",
          afterSkill: "Database Expert"
        }
      ],
      
      lectureTopics: [
        { topic: "SQL Queries", mastery: 95 },
        { topic: "Normalization", mastery: 88 },
        { topic: "Indexes & Views", mastery: 90 }
      ],
      
      lectureImpact: {
        studentsPassed: "96%",
        avgTestScore: "92/100",
        projectsCompleted: "410+"
      },
      
      classroomMoment: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=450&fit=crop"
    },
    {
      id: 6,
      title: "Android UI/UX Design",
      instructor: "Sir Zain Malik",
      course: "Android App Development",
      duration: "14:55",
      students: "340+",
      
      videoUrl: "https://www.youtube.com/embed/YMCmf0H7zrI",
      lectureThumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=450&fit=crop",
      
      studentBeforeLecture: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop",
      studentAfterLecture: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop",
      
      stats: {
        liveViewers: 112,
        averageEngagement: 94,
        questionsAsked: 21,
        completionRate: 89
      },
      
      parentTestimonials: [
        {
          parent: "Mr. Kashif Ali",
          child: "Danish (20 years)",
          quote: "My son learned more in this one lecture than entire semester at university!",
          rating: 5,
          beforeSkill: "Basic Java",
          afterSkill: "Published 2 apps"
        }
      ],
      
      lectureTopics: [
        { topic: "Material Design", mastery: 92 },
        { topic: "XML Layouts", mastery: 90 },
        { topic: "Responsive UI", mastery: 91 }
      ],
      
      lectureImpact: {
        studentsPassed: "97%",
        avgTestScore: "93/100",
        projectsCompleted: "340+"
      },
      
      classroomMoment: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=450&fit=crop"
    }
  ];

  // Auto-play carousel
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % lectureClips.length);
      }, 4000); // Change slide every 4 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, lectureClips.length]);

  // Animated particle background
  useEffect(() => {
    lectureClips.forEach(clip => {
      const canvas = canvasRefs.current[clip.id];
      if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const particles = [];
        for (let i = 0; i < 30; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5
          });
        }

        const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = 'rgba(255, 165, 0, 0.5)';
          
          particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();
            
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
          });
          
          requestAnimationFrame(animate);
        };
        
        animate();
      }
    });
  }, []);

  // Rotate testimonials
  useEffect(() => {
    const intervals = {};
    lectureClips.forEach(clip => {
      if (clip.parentTestimonials.length > 1) {
        intervals[clip.id] = setInterval(() => {
          setActiveTestimonial(prev => ({
            ...prev,
            [clip.id]: ((prev[clip.id] || 0) + 1) % clip.parentTestimonials.length
          }));
        }, 5000);
      }
    });

    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, []);

  const handleBeforeAfterSlider = (clipId, value) => {
    setSliderPosition(prev => ({ ...prev, [clipId]: value }));
  };

  const toggleBeforeAfter = (clipId) => {
    setBeforeAfterMode(prev => ({ ...prev, [clipId]: !prev[clipId] }));
    if (!sliderPosition[clipId]) {
      setSliderPosition(prev => ({ ...prev, [clipId]: 50 }));
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % lectureClips.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + lectureClips.length) % lectureClips.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  // 3D Card tilt effect on mouse move
  const handleCardMouseMove = (e, cardElement) => {
    if (!cardElement) return;
    
    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    cardElement.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    
    // Update mouse position for gradient
    const mouseX = (x / rect.width) * 100;
    const mouseY = (y / rect.height) * 100;
    cardElement.style.setProperty('--mouse-x', `${mouseX}%`);
    cardElement.style.setProperty('--mouse-y', `${mouseY}%`);
  };

  const handleCardMouseLeave = (cardElement) => {
    if (!cardElement) return;
    cardElement.style.transform = '';
  };

  return (
    <section className="revolutionary-lecture-section">
      <Container fluid>
        {/* Explosive Header */}
        <div className="explosive-header">
          <div className="header-burst">
            <div className="burst-circle circle-1"></div>
            <div className="burst-circle circle-2"></div>
            <div className="burst-circle circle-3"></div>
          </div>
          <h1 className="revolutionary-title">
            <span className="title-icon">🎓</span>
            <span className="title-text">Watch Our</span>
            <span className="title-highlight"> Live Lectures</span>
          </h1>
          <p className="revolutionary-subtitle">
            Real Classrooms. Real Learning. Real Transformation. 🚀
          </p>
          <div className="trust-badges">
            <div className="trust-badge">
              <Video className="trust-icon" />
              <span>Live Interactive Sessions</span>
            </div>
            <div className="trust-badge">
              <Monitor className="trust-icon" />
              <span>Record & Replay Anytime</span>
            </div>
            <div className="trust-badge">
              <Target className="trust-icon" />
              <span>95% Student Satisfaction</span>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="revolutionary-grid">
          <div className="carousel-container">
            <div 
              className="carousel-track"
              ref={carouselRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `translateX(-${currentSlide * (360 + 30)}px)`, // 360px card width + 30px gap
                transition: 'transform 0.5s ease'
              }}
            >
              {/* Duplicate cards for infinite loop effect */}
              {[...lectureClips, ...lectureClips].map((clip, index) => {
                const originalIndex = index % lectureClips.length;
                const currentTestimonial = clip.parentTestimonials[activeTestimonial[clip.id] || 0];
                const showBeforeAfter = beforeAfterMode[clip.id];
                const sliderPos = sliderPosition[clip.id] || 50;

                return (
                  <div 
                    key={`${clip.id}-${index}`}
                    className="revolutionary-card"
                    style={{ animationDelay: `${originalIndex * 0.15}s` }}
                    onMouseMove={(e) => handleCardMouseMove(e, e.currentTarget)}
                    onMouseLeave={(e) => handleCardMouseLeave(e.currentTarget)}
                  >
                    {/* Animated Background */}
                    <canvas 
                      ref={el => canvasRefs.current[clip.id] = el}
                      className="particle-canvas"
                    />

                    {/* Live Engagement Badge */}
                    <div className="live-counter">
                      <div className="live-dot"></div>
                      <span>{clip.stats.averageEngagement}% ENGAGEMENT RATE</span>
                    </div>

                    {/* Before/After Learning Showcase */}
                    <div className="before-after-container">
                      {!showBeforeAfter ? (
                        <div className="classroom-preview" onClick={() => setSelectedLecture(clip)}>
                          <img src={clip.lectureThumbnail} alt="Lecture" />
                          <div className="preview-overlay">
                            <button className="mega-play-button">
                              <div className="play-ring ring-1"></div>
                              <div className="play-ring ring-2"></div>
                              <div className="play-ring ring-3"></div>
                              <Play className="mega-play-icon" fill="currentColor" />
                            </button>
                            <span className="preview-text">▶ Watch Full Lecture</span>
                            <div className="lecture-duration-badge">
                              <Clock size={14} />
                              <span>{clip.duration}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="slider-container">
                          <div className="comparison-wrapper">
                            <img src={clip.studentAfterLecture} alt="After" className="after-image" />
                            <div 
                              className="before-overlay"
                              style={{ width: `${sliderPos}%` }}
                            >
                              <img src={clip.studentBeforeLecture} alt="Before" />
                            </div>
                            <div 
                              className="slider-handle"
                              style={{ left: `${sliderPos}%` }}
                            >
                              <div className="handle-line"></div>
                              <div className="handle-circle">
                                <ChevronRight className="handle-icon left" />
                                <ChevronRight className="handle-icon right" />
                              </div>
                            </div>
                            <div className="comparison-labels">
                              <span className="label-before">Before Lecture</span>
                              <span className="label-after">After Lecture</span>
                            </div>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={sliderPos}
                            onChange={(e) => handleBeforeAfterSlider(clip.id, e.target.value)}
                            className="comparison-slider"
                          />
                        </div>
                      )}
                    </div>

                    {/* Toggle Button */}
                    <button 
                      className="toggle-view-btn"
                      onClick={() => toggleBeforeAfter(clip.id)}
                    >
                      {showBeforeAfter ? '🎬 View Lecture Clip' : '📚 See Learning Impact'}
                    </button>

                    {/* Lecture Info */}
                    <div className="lecture-info-section">
                      <h3 className="lecture-name">{clip.title}</h3>
                      <div className="instructor-badge">
                        <div className="instructor-avatar-mini">
                          {clip.instructor.split(' ')[1].charAt(0)}
                        </div>
                        <div className="instructor-details">
                          <span className="instructor-name-text">{clip.instructor}</span>
                          <span className="course-badge-text">{clip.course}</span>
                        </div>
                      </div>
                    </div>

                    {/* Topics Covered in This Lecture */}
                    <div className="skills-progress">
                      <div className="skills-header">
                        <Brain size={16} />
                        <span>Topics Covered in Lecture</span>
                      </div>
                      {clip.lectureTopics.map((topic, idx) => (
                        <div key={idx} className="skill-bar-container">
                          <div className="skill-info">
                            <span className="skill-name">{topic.topic}</span>
                            <span className="skill-percent">{topic.mastery}% Mastered</span>
                          </div>
                          <div className="skill-bar">
                            <div 
                              className="skill-fill"
                              style={{ 
                                width: `${topic.mastery}%`,
                                animationDelay: `${idx * 0.2}s`
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Lecture Impact Stats */}
                    <div className="salary-comparison">
                      <div className="salary-header">
                        <TrendingUp size={16} />
                        <span>Lecture Impact Results</span>
                      </div>
                      <div className="impact-stats-row">
                        <div className="impact-stat">
                          <div className="impact-icon">✓</div>
                          <div className="impact-content">
                            <span className="impact-value">{clip.lectureImpact.studentsPassed}</span>
                            <span className="impact-label">Passed</span>
                          </div>
                        </div>
                        <div className="impact-stat">
                          <div className="impact-icon">⭐</div>
                          <div className="impact-content">
                            <span className="impact-value">{clip.lectureImpact.avgTestScore}</span>
                            <span className="impact-label">Avg Score</span>
                          </div>
                        </div>
                        <div className="impact-stat">
                          <div className="impact-icon">🎯</div>
                          <div className="impact-content">
                            <span className="impact-value">{clip.lectureImpact.projectsCompleted}</span>
                            <span className="impact-label">Projects</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Parent Testimonial about THIS Lecture */}
                    <div className="parent-testimonial">
                      <div className="testimonial-header">
                        <div className="parent-icon">👨‍👩‍👦</div>
                        <div className="testimonial-meta">
                          <span className="parent-name">{currentTestimonial.parent}</span>
                          <div className="star-rating">
                            {[...Array(currentTestimonial.rating)].map((_, i) => (
                              <Star key={i} size={12} fill="#ffa500" color="#ffa500" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="testimonial-quote">"{currentTestimonial.quote}"</p>
                      <div className="testimonial-outcome">
                        <div className="outcome-badge before-badge">
                          {currentTestimonial.beforeSkill}
                        </div>
                        <Zap size={14} className="outcome-arrow" />
                        <div className="outcome-badge after-badge">
                          {currentTestimonial.afterSkill}
                        </div>
                      </div>
                    </div>

                    {/* Live Lecture Stats */}
                    <div className="live-stats-grid">
                      <div className="stat-box">
                        <Users className="stat-icon" />
                        <div className="stat-content">
                          <span className="stat-number">{clip.stats.liveViewers}</span>
                          <span className="stat-label">Live Viewers</span>
                        </div>
                      </div>
                      <div className="stat-box">
                        <BookOpen className="stat-icon" />
                        <div className="stat-content">
                          <span className="stat-number">{clip.stats.questionsAsked}</span>
                          <span className="stat-label">Questions</span>
                        </div>
                      </div>
                      <div className="stat-box">
                        <Target className="stat-icon" />
                        <div className="stat-content">
                          <span className="stat-number">{clip.stats.completionRate}%</span>
                          <span className="stat-label">Completed</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button 
                      className="revolutionary-cta"
                      onClick={() => setSelectedLecture(clip)}
                    >
                      <span>🎥 Watch Complete Lecture Now</span>
                      <ChevronRight className="cta-arrow" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Carousel Navigation */}
          <div className="carousel-nav">
            <div className="carousel-dots">
              {lectureClips.map((_, index) => (
                <div
                  key={index}
                  className={`carousel-dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* Full Screen Video Modal */}
      {selectedLecture && (
        <div className="full-screen-modal" onClick={() => setSelectedLecture(null)}>
          <div className="modal-video-wrapper" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedLecture(null)}>
              <span className="close-x">✕</span>
            </button>
            <iframe
              src={`${selectedLecture.videoUrl}?autoplay=1`}
              title={selectedLecture.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="full-video-iframe"
            ></iframe>
            <div className="modal-lecture-details">
              <div className="modal-header-section">
                <h3>{selectedLecture.title}</h3>
                <div className="modal-instructor-info">
                  <div className="modal-instructor-avatar">
                    {selectedLecture.instructor.split(' ')[1].charAt(0)}
                  </div>
                  <div>
                    <p className="modal-instructor-name">{selectedLecture.instructor}</p>
                    <p className="modal-course-name">{selectedLecture.course}</p>
                  </div>
                </div>
              </div>
              <div className="modal-stats-grid">
                <div className="modal-stat">
                  <Clock size={18} />
                  <span>{selectedLecture.duration}</span>
                </div>
                <div className="modal-stat">
                  <Users size={18} />
                  <span>{selectedLecture.students} Students</span>
                </div>
                <div className="modal-stat">
                  <Target size={18} />
                  <span>{selectedLecture.stats.completionRate}% Complete</span>
                </div>
              </div>
              <p className="modal-testimonial">"{selectedLecture.parentTestimonials[0].quote}"</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LectureClipsSection;