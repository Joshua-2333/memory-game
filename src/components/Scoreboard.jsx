// src/components/Scoreboard.jsx
import '../styles/Scoreboard.css';

export default function Scoreboard({ score, bestScore }) {
  return (
    <div className="scoreboard" role="region" aria-label="Game Scores">
      <h1 className="scoreboard-title">Anime Memory Game</h1>
      <div className="scores">
        <p className="current-score">Score: <span>{score}</span></p>
        <p className="best-score">Best Score: <span>{bestScore}</span></p>
      </div>
    </div>
  );
}
