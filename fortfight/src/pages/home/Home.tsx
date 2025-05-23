import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PlayerSearch from "../../components/playersearch/PlayerSearch";
import MainButton from "../../components/mainbutton/MainButton";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

useEffect(() => {
  const stored = JSON.parse(localStorage.getItem("recentSearches") || "[]");
  setRecentSearches(stored);
}, []);

  return (
    <div className="home-container">
      <h1 className="home-title">Välkommen till FortFight</h1>
      <p className="home-intro">
        Jämför Fortnite-statistik med dina vänner, skapa tävlingar och se vem som regerar!
      </p>

      <div className="home-actions">
        <MainButton onClick={() => setShowSearch(true)} >
          🔍 Sök spelare
        </MainButton>
        <MainButton onClick={() => navigate("/jamfor")} >
          ⚔️ Jämför två spelare
        </MainButton>
        <MainButton onClick={() => navigate("/tavlingar")} >
          🏆 Skapa tävling
        </MainButton>
      </div>
      {showSearch && (
  <motion.div
    className="search-wrapper"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    <PlayerSearch />
  </motion.div>
)}
      {recentSearches.length > 0 && (
  <div className="recent-searches">
    <h3>Senaste sökningar</h3>
    <ul>
      {recentSearches.map((name, index) => (
        <li key={index}>{name}</li>
      ))}
    </ul>
  </div>
)}
    </div>
  );
}