import { useEffect, useState, useRef } from "react";
import "./styles/App.css";
import { fetchAnimeCharacters } from "./api";
import loadingVideo from "./assets/pekorap.mp4";
import GameBoard from "./components/GameBoard";
import Timer from "./components/Timer";

// ✅ Import local images
import shadowImg from "./assets/shadow.jpg";
import rimuruImg from "./assets/rimuru.jpg";
import rudeusImg from "./assets/rudeus.jpg";
import luffyImg from "./assets/luffy.jpg";

const extraCards = [
  { id: "shadow", name: "Shadow", image: shadowImg },
  { id: "rimuru", name: "Rimuru", image: rimuruImg },
  { id: "rudeus", name: "Rudeus Greyrat", image: rudeusImg },
  { id: "luffy", name: "Luffy", image: luffyImg },
];

export default function App() {
  const [allCharacters, setAllCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState("easy");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [message, setMessage] = useState("");
  const [gameStatus, setGameStatus] = useState("idle"); // idle | playing | won | lost
  const [resetKey, setResetKey] = useState(0); // 🔑 forces GameBoard + Timer remount
  const videoRef = useRef(null);

  // === Limit video loop to 20 seconds ===
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= 20) {
        video.currentTime = 0;
        video.play();
      }
    };
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [loading]);

  const enableSound = () => {
    const video = videoRef.current;
    if (!video || soundEnabled) return;
    video.muted = false;
    video.play().then(() => setSoundEnabled(true));
  };

  // === Fetch characters + extras ===
  useEffect(() => {
    async function loadCharacters() {
      try {
        const data = await fetchAnimeCharacters();
        setAllCharacters([...data, ...extraCards]);
        setGameStatus("playing"); // ✅ start game automatically
      } catch (err) {
        console.error(err);
        setError("Failed to load characters. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadCharacters();
  }, []);

  // === Handle timer running out ===
  const handleTimeUp = () => {
    if (gameStatus === "playing") {
      setGameStatus("lost");
      setMessage("Time's up! You lose 😢");
    }
  };

  // === Handle Win ===
  const handleWin = () => {
    setGameStatus("won");
    setMessage("Congratulations! You won 🎉");
  };

  // === Handle Fail (duplicate click) ===
  const handleFail = () => {
    setGameStatus("lost");
    setMessage("Oops! You clicked a duplicate card 😢");
  };

  // === Restart Game ===
  const restartGame = () => {
    setMessage("");
    setGameStatus("playing");
    setResetKey((prev) => prev + 1); // 🔁 remount GameBoard + Timer
  };

  // === Loading Screen ===
  if (loading) {
    return (
      <div
        className="loading-screen"
        onClick={!soundEnabled ? enableSound : undefined}
        role="button"
        aria-label="Click to enable sound and continue loading"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") enableSound();
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="loading-video"
        >
          <source src={loadingVideo} type="video/mp4" />
        </video>

        <div className="loading-overlay">
          <h1>Loading Anime Memory Game...</h1>
          <p>Fetching your favorite characters...</p>
          {!soundEnabled && (
            <p className="sound-hint">Click anywhere to enable sound 🎵</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <header>
          <h1>Anime Memory Game</h1>
        </header>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <h1>Anime Memory Game</h1>

        {/* Mode buttons */}
        <div className="mode-buttons">
          <button
            className={mode === "easy" ? "active" : ""}
            onClick={() => {
              setMode("easy");
              restartGame();
            }}
          >
            Easy (3x4)
          </button>
          <button
            className={mode === "hard" ? "active" : ""}
            onClick={() => {
              setMode("hard");
              restartGame();
            }}
          >
            Hard (4x4)
          </button>
        </div>

        {/* Timer */}
        <Timer
          key={`timer-${resetKey}`} // ✅ remount on restart
          mode={mode}
          onTimeUp={handleTimeUp}
          gameStatus={gameStatus}
        />
      </header>

      {/* Win/Fail Message */}
      {(gameStatus === "won" || gameStatus === "lost") && (
        <div className="message-box">
          <p>{message}</p>
          <button onClick={restartGame}>Play Again</button>
        </div>
      )}

      {/* GameBoard */}
      <GameBoard
        key={`board-${resetKey}`} // ✅ remount on restart
        cards={allCharacters}
        mode={mode}
        gameStatus={gameStatus}
        onWin={handleWin}
        onFail={handleFail}
      />

      <footer>
        <p>Made with React + Jikan API</p>
      </footer>
    </div>
  );
}
