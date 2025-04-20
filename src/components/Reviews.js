import React, { useEffect, useRef, useState } from "react";
import "./css/cubecomponent.css";
import { Container } from "react-bootstrap";

const testimonials = [
  { 
    text: "I recently complete my Mern Stack course from this platform and learn lots of topics so I highly recommend this course for anyone.",
    name: "Asad amin (FSWD-Ai)"
  },
  { 
    text: "Really enjoying the AI Web Dev Full Stack. Mr Muhammad Haroon teaches in a way that makes everything easy to understand, even the tricky parts. The course is hands-on and definitely worth it.",
    name: "Hassan tanveer (FSWD-Ai)"
  },
  { 
    text: "such a wonderful journey with code build academy. I learned a lot and  work on many real time projects that help me in gaining a job. highly recommend ",
    name: "Mania malik "
  },
  { 
    text: "Outstanding course and knowledgeable Mentor highly recommended",
    name: "Furqan shiekh (FSWD-AI)"
  },
  { 
    text: "Honestly Codebuild academy is really a passionate and amazing institute. Instructors are knowledgeable and professional also they offer some amazing courses in which they cover topics in a excellant way . Their Basic to advance courses are from scratch thats why everyone can learn from it even if you a begineer or have a NON-IT background ",
    name: "Client 5"
  },
  { 
    text: "I am currently learning the Full-Stack Developer course at CodeBuild Academy, and I could be happier with my experience! The course is well-structured, covering everything from frontend to backend development in a way that is easy to understand. The instructors are knowledgeable and supportive, always ready to help with any doubts. The hands-on projects and real-world applications make learning even more engaging. If you're looking for a great place to learn full-stack development, I highly recommend CodeBuild Academy!",
    name: "Zohaib ahmad (FSWD-AI)"
  },
];

const InteractiveCards = () => {
  const cursorContainer = useRef(null);
  const cursor = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const textRefs = useRef([]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { pageX: x, pageY: y } = event;
      if (cursorContainer.current) {
        cursorContainer.current.style.transform = `translate(${x}px, ${y}px) scale(1)`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleCardMouseOver = (index, name) => {
    setHoveredCard({ index, name });
    if (cursor.current) {
      cursor.current.style.backgroundColor = `var(--animate${index + 1})`;
    }
    
    // Only start scrolling if text is long (150+ chars)
    const textElement = textRefs.current[index];
    if (textElement && textElement.textContent.length > 150) {
      textElement.style.animation = 'none';
      void textElement.offsetWidth; // Trigger reflow
      textElement.style.animation = 'scrollText 10s linear forwards';
    }
  };

  const handleCardMouseOut = () => {
    setHoveredCard(null);
    if (cursor.current) {
      cursor.current.style.backgroundColor = "var(--initial)";
    }
    
    // Reset all animations
    textRefs.current.forEach(el => {
      if (el) el.style.animation = 'none';
    });
  };

  return (<>
  <div><h1 className="text-center mt-5 mb-5" style={{fontFamily: "Dosis, sans-serif", color:"white"}}>What Codebuilders say about us</h1></div>
    <div className="interactive-container abc container">
      
      <div className="content">
      
        <div className="cards">
          {testimonials.map((item, index) => (
            <div
              className={`card ${item.text.length > 150 ? 'long-text' : ''}`}
              key={index}
              onMouseOver={() => handleCardMouseOver(index, item.name)}
              onMouseOut={handleCardMouseOut}
              aria-label={`Testimonial card ${index + 1}`}
            >
              <div className="inner-shadow">
                <div className="cursor-blur-wrapper">
                  <div className="cursor-blur"></div>
                </div>
              </div>
              <h1 
                className="card-number"
                style={{
                  fontSize: hoveredCard?.index === index ? '30px' : '70px',
                  fontFamily:"revert"
                }}
              >
                {hoveredCard?.index === index ? item.name : index + 1}
              </h1>
              <div className="text-container">
                <p 
                  className="text" 
                  ref={el => textRefs.current[index] = el}
                  data-length={item.text.length}
                >
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="cursor-container" ref={cursorContainer}>
        <div className="cursor" ref={cursor}></div>
      </div>
      <Container>
        <video src="" aria-hidden="true"></video>
      </Container>
    </div></>
  
  );
};

export default InteractiveCards;