// src/components/GameBoard.jsx
import { useEffect, useState } from "react";
import Card from "./Card";
import { fetchAnimeCharacters } from "../api";
import '../styles/GameBoard.css';

export default function GameBoard({ score, setScore, bestScore, setBestScore }) {
  const [cards, setCards] = useState([]);
  const [clicked, setClicked] = useState([]);

  // Shuffle helper
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  // Fetch characters once
  useEffect(() => {
    async function loadCards() {
      try {
        const data = await fetchAnimeCharacters();
        setCards(shuffle(data));
      } catch (err) {
        console.error("Failed to fetch characters:", err);
      }
    }
    loadCards();
  }, []);

  const handleCardClick = (id) => {
    if (clicked.includes(id)) {
      setScore(0);
      setClicked([]);
    } else {
      const newScore = score + 1;
      setScore(newScore);
      setBestScore(Math.max(bestScore, newScore));
      setClicked([...clicked, id]);
    }
    setCards(shuffle(cards)); // reshuffle after every click
  };

  return (
    <div className="game-board">
      {cards.map((card) => (
        <Card key={card.id} card={card} onClick={handleCardClick} />
      ))}
    </div>
  );
}
