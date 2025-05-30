import { useEffect, useState } from "react";
import { db } from "../../firebase/Firebase";

import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../../firebase/UseAuth";
import LoginButton from "../../components/loginbutton/LoginButton";
import { fetchFortniteStats } from "../../api/FortniteApi";
import "./Tournaments.css";
import MainButton from "../../components/mainbutton/MainButton";
import { useUserData } from "../../hooks/useUserData";
import type { Tournaments } from "../../types/tournaments";

export const Category = {
  Wins: "wins",
  Kills: "kills",
  KillsDeath : "kd",
  KillsPerMatch : "killsPerMatch",
  AveragePlacement: "placetop", 
  Score: "score",
} as const;

export type Category = typeof Category[keyof typeof Category];

export default function Tournaments() {
  const user = useAuth();
  const { data: userData } = useUserData();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>(Category.Wins);
  const [players, setPlayers] = useState<string[]>([""]);
  const [endDate, setEndDate] = useState("");
  const [tournaments, setTournaments] = useState<Tournaments[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournaments | null>(null);
  const [results, setResults] = useState<any[]>([]);

  const handleAddPlayer = () => setPlayers([...players, ""]);
  const handleChangePlayer = (value: string, index: number) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };
  const handleRemovePlayer = (index: number) => {
    const updated = [...players];
    updated.splice(index, 1);
    setPlayers(updated);
  };
  const handleDeleteTournament = async (id: string) => {
    if (confirm("Är du säker på att du vill ta bort denna tävling?")) {
      try {
        await deleteDoc(doc(db, "tournaments", id));
      } catch (err) {
        console.error("Kunde inte ta bort tävling:", err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Du måste vara inloggad för att skapa tävling!");
  
    if (!userData?.epicId) return alert("Ditt Epic Games ID saknas. Koppla det i profilen först.");
  
    const epicId = userData.epicId; 
    const allPlayers = [
      epicId,
      ...players.filter((p) => p.trim() !== "" && p.trim() !== epicId),
    ];
  
    const startStats: { name: string; value: number }[] = [];
  
    for (const player of allPlayers) {
      try {
        const res = await fetchFortniteStats(player);
        const stats = res.data.stats.all.overall;
  
        let value = 0;
        switch (category) {
          case "wins":
            value = stats.wins;
            break;
          case "kills":
            value = stats.kills;
            break;
          case "kd":
            value = stats.kd;
            break;
          case "killsPerMatch":
            value = stats.killsPerMatch;
            break;
          case "placetop":
            value = stats.top10 + stats.top25;
            break;
          case "score":
            value = stats.score;
            break;
          default:
            value = 0;
        }
  
        startStats.push({ name: player, value });
      } catch {
        startStats.push({ name: player, value: 0 });
      }
    }
  
    try {
      await addDoc(collection(db, "tournaments"), {
        title,
        category,
        players: allPlayers, 
        startStats,
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
        const stats = res.data.stats.all.overall;
  
        let current = 0;
        switch (tournament.category) {
          case "wins":
            current = stats.wins;
            break;
          case "kills":
            current = stats.kills;
            break;
          case "kd":
            current = stats.kd;
            break;
          case "killsPerMatch":
            current = stats.killsPerMatch;
            break;
          case "placetop":
            current = stats.top10 + stats.top25;
            break;
          case "score":
            current = stats.score;
            break;
          default:
            current = 0;
        }
  
        const start = tournament.startStats?.find((s: any) => s.name === player)?.value || 0;
        const value = current - start;
  
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
      const items:Tournaments [] = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Tournaments, "id">), }));
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
  <option value={Category.Wins}>Flest vinster</option>
  <option value={Category.Kills}>Flest kills</option>
  <option value={Category.KillsDeath}>Bäst K/D</option>
  <option value={Category.KillsPerMatch}>Kills per match</option>
  <option value={Category.AveragePlacement}>Bäst placering</option>
  <option value={Category.Score}>Högst poäng</option>
</select>

        {players.map((player, index) => (
           <div key={index} className="player-input-row">
          <input
            type="text"
            placeholder={`motståndare ${index + 1}`}
            value={player}
            onChange={(e) => handleChangePlayer(e.target.value, index)}
            required
          />
            {players.length > 1 && (
      <button
        type="button"
        onClick={() => handleRemovePlayer(index)}
        className="remove-player-button"
      >
        ❌
      </button>
        )}
        </div>
        ))}

        <MainButton type="button" onClick={handleAddPlayer}>
          + Lägg till spelare
        </MainButton>
        <h3>välj slutdatum för tävlingen</h3>
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
            <p>Startade: {t.createdAt.toDate().toLocaleDateString()}</p>
            <p>Slutar: {t.endDate.toDate().toLocaleDateString()}</p>
            <div className="tournaments-list-buttons"><MainButton onClick={() => handleViewResults(t)}>Visa resultat</MainButton>
            <MainButton onClick={() => handleDeleteTournament(t.id)}>
        🗑 Ta bort
      </MainButton></div>
          </li>
        ))}
      </ul>

      {selectedTournament && (
        <div className="tournament-results-box">
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
