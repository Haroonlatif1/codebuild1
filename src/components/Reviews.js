import React, { useEffect, useRef, useState } from "react";
import "./css/cubecomponent.css"; // Include the provided CSS here.

const info = [
  { text: "A calming and tranquil color, linked to serenity, trust, and stability. It often represents the sky, water, and feelings of peace or coolness."
    ,name:"Asad amin (Full stack web development student)"
   },
  { text: "A rich, luxurious color that blends the calm of blue and the energy of red. It symbolizes royalty, mystery, spirituality, and creativity." },
  { text: "A bold and intense color, often associated with passion, energy, love, and danger. It evokes strong emotions and symbolizes power and excitement." },
  { text: "A refreshing, natural color that symbolizes growth, health, and harmony. It’s often associated with nature, renewal, and balance." },
  { text: "A bright and cheerful color that represents happiness, optimism, and warmth. It often symbolizes sunshine, creativity, and positivity." },
  { text: "A vibrant, energetic color that combines the warmth of red and the cheerfulness of yellow. It often signifies enthusiasm, fun, and vitality." },
];

const InteractiveCards = () => {
  const cursorContainer = useRef(null);
  const cursor = useRef(null);
  const [cards, setCards] = useState([]);

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

  const handleCardMouseOver = (index) => {
    if (cursor.current) {
      cursor.current.style.backgroundColor = `var(--animate${index + 1})`;
    }
  };

  const handleCardMouseOut = () => {
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
              onMouseOver={() => handleCardMouseOver(index)}
              onMouseOut={handleCardMouseOut}
            >
              <div className="inner-shadow">
                <div className="cursor-blur-wrapper">
                  <div className="cursor-blur"></div>
                </div>
              </div>
              <h1>{index + 1}</h1>
              <div style={{ zIndex: 99 }}>
                <p className="text">{item.text}<br></br>{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="cursor-container" ref={cursorContainer}>
        <div className="cursor" ref={cursor}></div>
      </div>
    </div>
  );
};

export default InteractiveCards;
