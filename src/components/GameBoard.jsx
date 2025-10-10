// src/components/GameBoard.jsx
import { useState, useEffect } from "react";
import Card from "./Card";

export default function GameBoard({ cards = [], mode = "easy" }) {
  const [clicked, setClicked] = useState([]);
  const [displayedCards, setDisplayedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  useEffect(() => {
    const limit = mode === "easy" ? 12 : 16;
    setDisplayedCards(shuffle(cards).slice(0, limit));
    setClicked([]);
    setScore(0);
  }, [cards, mode]);

  const handleCardClick = (id) => {
    if (clicked.includes(id)) {
      setScore(0);
      setClicked([]);
    } else {
      const newScore = score + 1;
      setScore(newScore);
      setBestScore((prev) => Math.max(prev, newScore));
      setClicked([...clicked, id]);
    }
    setDisplayedCards(shuffle(displayedCards));
  };

  return (
    <div className="game-board-container">
      <div className="scoreboard">
        <p>Score: {score}</p>
        <p>Best Score: {bestScore}</p>
      </div>

      <div className={`game-board ${mode}`}>
        {displayedCards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
}