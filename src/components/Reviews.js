import React, { useEffect, useRef, useState } from "react";
import "./css/cubecomponent.css"; 
import { Container } from "react-bootstrap";

const info = [
  { 
    text: "iff dfhdof dfdfdfd f dfdf df dfd",
    name: "Asad amin (FSWD-Ai)"
  },
  { 
    text: "Outstanding course and knowledgeable Mentor highly recommended",
    name: "Asad amin (FSWD-Ai)"
  },
  { 
    text: "A bold and intense color, often associated with passion, energy, love, and danger. It evokes strong emotions and symbolizes power and excitement.",
    name: ""
  },
  { 
    text: "A refreshing, natural color that symbolizes growth, health, and harmony. It’s often associated with nature, renewal, and balance.",
    name: ""
  },
  { 
    text: "A bright and cheerful color that represents happiness, optimism, and warmth. It often symbolizes sunshine, creativity, and positivity.",
    name: ""
  },
  { 
    text: "A vibrant, energetic color that combines the warmth of red and the cheerfulness of yellow. It often signifies enthusiasm, fun, and vitality.",
    name: ""
  },
];

const InteractiveCards = () => {
  const cursorContainer = useRef(null);
  const cursor = useRef(null);
  const [cards, setCards] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setCards(info);
    const handleMouseMove = (event) => {
      const { pageX: x, pageY: y } = event;
      if (cursorContainer.current) {
        cursorContainer.current.style.transform = `translate(${x}px, ${y}px) scale(1)`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleCardMouseOver = (index, name) => {
    setHoveredCard({ index, name });
    if (cursor.current) {
      cursor.current.style.backgroundColor = `var(--animate${index + 1})`;
    }
  };

  const handleCardMouseOut = () => {
    setHoveredCard(null);
    if (cursor.current) {
      cursor.current.style.backgroundColor = "var(--initial)";
    }
  };

  return (
    <div className="interactive-container abc container">
      <div className="content">
        <div className="cards">
          {cards.map((item, index) => (
            <div
              className="card"
              key={index}
              onMouseOver={() => handleCardMouseOver(index, item.name)}
              onMouseOut={handleCardMouseOut}
            >
              <div className="inner-shadow">
                <div className="cursor-blur-wrapper">
                  <div className="cursor-blur"></div>
                </div>
              </div>
              <h1 
                style={{
                  fontSize: hoveredCard && hoveredCard.index === index ? '15px' : '80px',
                  transition: 'font-size 0.5s ease-in-out',
                }}
              >
                {hoveredCard && hoveredCard.index === index ? item.name : index + 1}
              </h1>
              <div style={{ zIndex: 99 }}>
                <p className="text">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="cursor-container" ref={cursorContainer}>
        <div className="cursor" ref={cursor}></div>
      </div>
      <Container>
        <video src="">

        </video>
      </Container>
    </div>
  );
};

export default InteractiveCards;