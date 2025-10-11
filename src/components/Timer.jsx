import { useEffect, useState, useRef } from "react";
import "../styles/Timer.css";

export default function Timer({ mode, onTimeUp, gameStatus }) {
  const [timeLeft, setTimeLeft] = useState(mode === "hard" ? 90 : 60);
  const intervalRef = useRef(null);

  // Reset timer whenever mode changes or a new game starts
  useEffect(() => {
    // Stop any existing timer first
    clearInterval(intervalRef.current);

    // Only start countdown if game is actively playing
    if (gameStatus === "playing") {
      const startingTime = mode === "hard" ? 90 : 60;
      setTimeLeft(startingTime);

      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Clean up on unmount or status change
    return () => clearInterval(intervalRef.current);
  }, [mode, gameStatus, onTimeUp]);

  // Format minutes/seconds for display
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="timer-container">
      {gameStatus === "lost" && timeLeft === 0 ? (
        <p className="time-up">Time’s up! You lose 😢</p>
      ) : (
        <p className="timer">
          Time: {minutes}:{seconds}
        </p>
      )}
    </div>
  );
}
