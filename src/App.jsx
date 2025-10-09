import { useEffect, useState, useRef } from "react";
import "./styles/App.css";
import { fetchAnimeCharacters } from "./api";
import loadingVideo from "./assets/pekorap.mp4";

const extraCards = [
  { id: "shadow", name: "Shadow", image: "/src/assets/shadow.jpg" },
  { id: "rimuru", name: "Rimuru", image: "/src/assets/rimuru.jpg" },
  { id: "rudes", name: "Rudes", image: "/src/assets/rudes.jpg" },
  { id: "luffy", name: "Luffy", image: "/src/assets/luffy.jpg" },
];

function App() {
  const [characters, setCharacters] = useState([]);
  const [allCharacters, setAllCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [clicked, setClicked] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [mode, setMode] = useState("easy"); // default mode

  const videoRef = useRef(null);

  // Limit video loop to 20 seconds
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

  // Fetch characters
  useEffect(() => {
    async function loadCharacters() {
      try {
        const data = await fetchAnimeCharacters();
        const combined = [...data, ...extraCards]; // extra cards can appear in easy too
        setAllCharacters(combined);
        setCharacters(shuffle(combined).slice(0, 12)); // easy mode default
      } catch (err) {
        console.error("Error fetching characters:", err);
        setError("Failed to load characters. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadCharacters();
  }, []);

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

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
    setCharacters(shuffle(characters));
  };

  // Change mode dynamically
  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
    setScore(0);
    setClicked([]);
    if (selectedMode === "easy") {
      setCharacters(shuffle(allCharacters).slice(0, 12));
    } else {
      setCharacters(shuffle(allCharacters).slice(0, 16));
    }
  };

  // Loading screen
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

  // Main game
  return (
    <div className="app-container">
      <header>
        <h1>Anime Memory Game</h1>
        <p>Score: {score} | Best Score: {bestScore}</p>
        <div className="mode-buttons">
          <button
            className={mode === "easy" ? "active" : ""}
            onClick={() => handleModeChange("easy")}
          >
            Easy (3x4)
          </button>
          <button
            className={mode === "hard" ? "active" : ""}
            onClick={() => handleModeChange("hard")}
          >
            Hard (4x4)
          </button>
        </div>
      </header>

      <div className={`game-board ${mode}`}>
        {characters.map((char) => (
          <div
            key={char.id}
            className="card"
            onClick={() => handleCardClick(char.id)}
            tabIndex={0}
            role="button"
            aria-label={`Card: ${char.name}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleCardClick(char.id);
            }}
          >
            <img src={char.image} alt={char.name} />
            <p>{char.name}</p>
          </div>
        ))}
      </div>

      <footer>
        <p>Made with React + Jikan API</p>
      </footer>
    </div>
  );
}

export default App;
