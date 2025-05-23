import { useState } from "react";
import { fetchFortniteStats } from "../../api/FortniteApi";
import "./PlayerSearch.css";
import PlayerProfile from "../playerprofile/PlayerProfile";
import { motion } from "framer-motion";

export default function PlayerSearch() {
  const [epicId, setEpicId] = useState("");
  const [playerData, setPlayerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!epicId.trim()) {
      setError("Vänligen skriv in ett Epic Games ID");
      return;
    }

    const saveRecentSearch = (id: string) => {
      const existing = JSON.parse(localStorage.getItem("recentSearches") || "[]");
      const updated = [id, ...existing.filter((x: string) => x !== id)].slice(0, 5);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    };
    
    saveRecentSearch(epicId.trim());

    setLoading(true);
    setError("");
    setPlayerData(null);

    try {
      const data = await fetchFortniteStats(epicId.trim());
      setPlayerData(data.data);
    } catch (err) {
      setError("Kunde inte hämta data för spelaren.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="player-search">
      <h1>Sök Fortnite-spelare</h1>
      <input
        type="text"
        value={epicId}
        onChange={(e) => setEpicId(e.target.value)}
        placeholder="Skriv Epic Games ID"
      />
      <button onClick={handleSearch}>Sök</button>

      {loading && <p className="loading">Hämtar data...</p>}
      {error && <p className="error">{error}</p>}

      {playerData && (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    <PlayerProfile
      name={playerData.account.name}
      wins={playerData.stats.all.overall.wins}
      kills={playerData.stats.all.overall.kills}
      matches={playerData.stats.all.overall.matches}
      kd={playerData.stats.all.overall.kd}
      winRate={playerData.stats.all.overall.winRate}
      killsPerMatch={playerData.stats.all.overall.killsPerMatch}
    />
  </motion.div>
)}
    </div>
  );
}