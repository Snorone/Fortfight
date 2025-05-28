import { useEffect, useState } from "react";
import { db } from "../../firebase/Firebase";

import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  onSnapshot,
  // doc,
  // getDoc,
} from "firebase/firestore";
import { useAuth } from "../../firebase/UseAuth";
import LoginButton from "../../components/loginbutton/LoginButton";
import { fetchFortniteStats } from "../../api/FortniteApi";
import "./Tournaments.css";
import MainButton from "../../components/mainbutton/MainButton";


enum Category {
  Wins= "wins",
  Kills= "kills",
  KillsDeath = "kd",
  KillsPerMatch = "kills",
}

export default function Tournaments() {
  const user = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>(Category.Wins);
  const [players, setPlayers] = useState<string[]>([""]);
  const [endDate, setEndDate] = useState("");
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<any | null>(null);
  const [results, setResults] = useState<any[]>([]);

  const handleAddPlayer = () => setPlayers([...players, ""]);
  const handleChangePlayer = (value: string, index: number) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Du måste vara inloggad för att skapa tävling!");

    try {
      await addDoc(collection(db, "tournaments"), {
        title,
        category,
        players: players.filter((p) => p.trim() !== ""),
        endDate: Timestamp.fromDate(new Date(endDate)),
        createdAt: Timestamp.now(),
        createdBy: user.uid,
      });

      setTitle("");
      setCategory(Category.Wins);
      setPlayers([""]);
      setEndDate("");
    } catch (err) {
      console.error("Fel vid sparande av tävling:", err);
    }
  };

  const handleViewResults = async (tournament: any) => {
    setSelectedTournament(tournament);
    const fetchedResults = [];
    for (const player of tournament.players) {
      try {
        const res = await fetchFortniteStats(player);
        const value = res.data.stats.all.overall[tournament.category] || 0;
        fetchedResults.push({ name: player, value });
      } catch {
        fetchedResults.push({ name: player, value: 0 });
      }
    }
    fetchedResults.sort((a, b) => b.value - a.value);
    setResults(fetchedResults);
  };

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "tournaments"),
      where("createdBy", "==", user.uid)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTournaments(items);
    });
    return () => unsub();
  }, [user]);

  if (!user) {
    return (
      <div className="tournament-container">
        <h2>Logga in för att skapa tävlingar</h2>
        <LoginButton />
      </div>
    );
  }

  return (
    <div className="tournament-container">
      <h2>Skapa tävling</h2>
      <form className="tournament-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tävlingens namn"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
          <option value={Category.Wins}>Vinster</option>
          <option value={Category.Kills}>Kills</option>
          <option value= {Category.KillsDeath}>K/D</option>
          <option value={Category.KillsPerMatch}   >Kills/Match</option>
        </select>

        {players.map((player, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Spelare ${index + 1}`}
            value={player}
            onChange={(e) => handleChangePlayer(e.target.value, index)}
            required
          />
        ))}

        <MainButton type="button" onClick={handleAddPlayer}>
          + Lägg till spelare
        </MainButton>

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />

        <MainButton type="submit">
          ✅ Skapa tävling
        </MainButton>
      </form>

      <h3>Mina tävlingar</h3>
      <ul className="tournament-list">
        {tournaments.map((t) => (
          <li key={t.id} className="tournament-card">
            <h4>{t.title}</h4>
            <p>Kategori: {t.category}</p>
            <p>Spelare: {t.players.join(", ")}</p>
            <p>Slutar: {t.endDate.toDate().toLocaleDateString()}</p>
            <button onClick={() => handleViewResults(t)}>Visa resultat</button>
          </li>
        ))}
      </ul>
      {selectedTournament && (
        <div className="results-box">
          <h3>Resultat för: {selectedTournament.title}</h3>
          <ul>
            {results.map((r, i) => (
              <li key={i}>
                {i + 1}. {r.name} - {r.value} {selectedTournament.category}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
