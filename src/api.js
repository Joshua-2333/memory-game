// src/api.js

export async function fetchAnimeCharacters() {
  // List of the 12 characters you want
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
    "Albedo"
  ];

  // Fetch data from Jikan API for each character
  const characters = await Promise.all(
    characterNames.map(async (name) => {
      const res = await fetch(
        `https://api.jikan.moe/v4/characters?q=${encodeURIComponent(name)}&limit=1`
      );
      const data = await res.json();
      const char = data.data[0];

      return {
        id: char.mal_id,                       // unique ID
        name: char.name,                        // character name
        anime: char.anime[0]?.name || "Unknown",// first anime they appear in
        image: char.images.jpg.image_url,       // character image
      };
    })
  );

  return characters;
}
