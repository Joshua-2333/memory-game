// src/components/GameBoard.jsx
import { useState, useEffect } from "react";
import Card from "./Card";

export default function GameBoard({ cards = [], mode = "easy", gameOver, onWin, onFail }) {
  const [clicked, setClicked] = useState([]);
  const [displayedCards, setDisplayedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  // Initialize displayed cards when cards or mode changes
  useEffect(() => {
    const limit = mode === "easy" ? 12 : 16;
    setDisplayedCards(shuffle(cards).slice(0, limit));
    setClicked([]);
    setScore(0);
  }, [cards, mode]);

  // Reset clicked cards when game ends
  useEffect(() => {
    if (gameOver) setClicked([]);
  }, [gameOver]);

  const handleCardClick = (id) => {
    if (gameOver) return; // Prevent clicks after game over

    if (clicked.includes(id)) {
      // Duplicate click → fail
      onFail();
      return;
    }

    const newClicked = [...clicked, id];
    setClicked(newClicked);
    const newScore = score + 1;
    setScore(newScore);
    setBestScore((prev) => Math.max(prev, newScore));

    const totalCards = mode === "easy" ? 12 : 16;
    if (newClicked.length === totalCards) {
      // All cards clicked without duplicates → win
      onWin();
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
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
    </div>
  );
}
