// src/components/Card.jsx
import '../styles/Card.css';

export default function Card({ card, onClick }) {
  return (
    <div
      className="card"
      onClick={() => onClick(card.id)}
      role="button"
      tabIndex={0}
      aria-label={`Card for ${card.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick(card.id);
      }}
    >
      <img
        src={card.image}
        alt={card.name}
        className="card-image"
        loading="lazy"
      />
      <div className="card-text">
        <p className="char-name">{card.name}</p>
      </div>
    </div>
  );
}
