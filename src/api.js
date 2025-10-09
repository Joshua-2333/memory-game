// src/api.js

import remImg from "./assets/rem.jpg";
import aquaImg from "./assets/aqua.jpeg";
import albedoImg from "./assets/albedo.jpg";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fallback image map
const fallbackImages = {
  Rem: remImg,
  Aqua: aquaImg,
  Albedo: albedoImg,
};

export async function fetchAnimeCharacters() {
  const characterNames = [
    "Rem",
    "Eren Yeager",
    "Frieren",
    "Satoru Gojo",
    "Tanjiro Kamado",
    "Nezuko Kamado",
    "Makima",
    "Power",
    "Rias Gremory",
    "Aqua",
    "Momo Ayase",
    "Albedo",
  ];

  const results = [];

  for (const name of characterNames) {
    try {
      // Skip API for fallback characters (use local assets directly)
      if (fallbackImages[name]) {
        results.push({
          id: name,
          name,
          anime:
            name === "Rem"
              ? "Re: Zero"
              : name === "Aqua"
              ? "Konosuba"
              : name === "Albedo"
              ? "Overlord"
              : "Unknown",
          image: fallbackImages[name],
        });
        continue;
      }

      // Fetch others from Jikan
      const res = await fetch(
        `https://api.jikan.moe/v4/characters?q=${encodeURIComponent(name)}&limit=1`
      );

      if (!res.ok) {
        console.warn(`Skipping ${name} due to rate limit or error.`);
        continue;
      }

      const data = await res.json();
      const char = data?.data?.[0];
      if (char) {
        results.push({
          id: char.mal_id || name,
          name: char.name || name,
          anime: char.animeography?.[0]?.name || "Unknown",
          image: char.images?.jpg?.image_url || fallbackImages[name],
        });
      }
    } catch (error) {
      console.error(`Error fetching ${name}:`, error);

      // Fallback if API request fails
      results.push({
        id: name,
        name,
        anime:
          name === "Rem"
            ? "Re: Zero"
            : name === "Aqua"
            ? "Konosuba"
            : name === "Albedo"
            ? "Overlord"
            : "Unknown",
        image: fallbackImages[name],
      });
    }

    // Add delay for API rate limit safety
    await delay(2000);
  }

  return results;
}
