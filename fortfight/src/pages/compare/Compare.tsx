import { useState } from "react";
import { fetchFortniteStats } from "../../api/FortniteApi";
// import PlayerProfile from "../../components/playerprofile/PlayerProfile";
import "./Compare.css";
import MainButton from "../../components/mainbutton/MainButton";
import CompareGrid from "../../components/comparegrid/CompareGrid";

export default function Compare() {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [data1, setData1] = useState<any>(null);
  const [data2, setData2] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCompare = async () => {
    if (!player1.trim() || !player2.trim()) {
      setError("Fyll i båda spelarnamnen");
      return;
    }

    setLoading(true);
    setError("");
    setData1(null);
    setData2(null);

    try {
      const res1 = await fetchFortniteStats(player1.trim());
      const res2 = await fetchFortniteStats(player2.trim());
      setData1(res1.data);
      setData2(res2.data);
    } catch (err) {
      setError("Kunde inte hämta data för en eller båda spelare.");
    } finally {
      setLoading(false);
    }
    localStorage.setItem(
      "lastSearch",
      JSON.stringify({ player1, player2 })
    );
  };

  const getHighlight = (
    a: number,
    b: number
  ): "player1" | "player2" | "tie" => {
    if (a > b) return "player1";
    if (a < b) return "player2";
    return "tie";
  };

  const highlightMap:
    | { [key: string]: "player1" | "player2" | "tie" }
    | undefined =
    data1 && data2
      ? {
          wins: getHighlight(
            data1.stats.all.overall.wins,
            data2.stats.all.overall.wins
          ),
          kills: getHighlight(
            data1.stats.all.overall.kills,
            data2.stats.all.overall.kills
          ),
          matches: getHighlight(
            data1.stats.all.overall.matches,
            data2.stats.all.overall.matches
          ),
          kd: getHighlight(
            data1.stats.all.overall.kd,
            data2.stats.all.overall.kd
          ),
          winRate: getHighlight(
            data1.stats.all.overall.winRate,
            data2.stats.all.overall.winRate
          ),
          killsPerMatch: getHighlight(
            data1.stats.all.overall.killsPerMatch,
            data2.stats.all.overall.killsPerMatch
          ),
        }
      : undefined;

      const lastSearch = localStorage.getItem("lastSearch");
      const lastNameSearch = lastSearch ? JSON.parse(lastSearch) : null;
      

  return (
    <div className="compare-container">
      <h2>Jämför två spelare</h2>

      <div className="input-row">
        <input
          className="input-text"
          type="text"
          placeholder="Spelare 1 (Epic ID)"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
        />
        <input
          className="input-text"
          type="text"
          placeholder="Spelare 2 (Epic ID)"
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
        />
      </div>

      <MainButton onClick={handleCompare}>Jämför</MainButton>

      <MainButton
  onClick={() => {
    const saved = localStorage.getItem("senasteJämförelse");
    if (saved) {
      const { player1, player2 } = JSON.parse(saved);
      setPlayer1(player1);
      setPlayer2(player2);
      handleCompare();
    } else {
      alert("Ingen tidigare sökning sparad.");
    }
  }}
>
  🔁senaste sökning: {lastNameSearch?.player1} vs {lastNameSearch?.player2}
</MainButton>

      {loading && <p className="loading">Hämtar data...</p>}
      {error && <p className="error">{error}</p>}

      {data1 && data2 && highlightMap && (
        <CompareGrid
          player1={{
            name: data1.account.name,
            stats: {
              wins: data1.stats.all.overall.wins,
              kills: data1.stats.all.overall.kills,
              matches: data1.stats.all.overall.matches,
              kd: data1.stats.all.overall.kd,
              winRate: data1.stats.all.overall.winRate,
              killsPerMatch: data1.stats.all.overall.killsPerMatch,
            },
          }}
          player2={{
            name: data2.account.name,
            stats: {
              wins: data2.stats.all.overall.wins,
              kills: data2.stats.all.overall.kills,
              matches: data2.stats.all.overall.matches,
              kd: data2.stats.all.overall.kd,
              winRate: data2.stats.all.overall.winRate,
              killsPerMatch: data2.stats.all.overall.killsPerMatch,
            },
          }}
          highlights={highlightMap}
        />
      )}
    </div>
  );
}
