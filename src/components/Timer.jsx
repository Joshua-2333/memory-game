import { useEffect, useState } from "react";
import "../styles/Timer.css";

export default function Timer({ mode, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(mode === "hard" ? 90 : 60);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Reset timer when mode changes
  useEffect(() => {
    setTimeLeft(mode === "hard" ? 90 : 60);
    setIsTimeUp(false);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimeUp(true);
          onTimeUp(); // call parent handler
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mode, onTimeUp]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="timer-container">
      {!isTimeUp ? (
        <p className="timer">
          Time: {minutes}:{seconds}
        </p>
      ) : (
        <p className="time-up">Time's up! You lose 😢</p>
      )}
    </div>
  );
}
