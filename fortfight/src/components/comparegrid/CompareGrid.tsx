import "./CompareGrid.css";

interface CompareGridProps {
  player1: {
    name: string;
    stats: Record<string, number>;
  };
  player2: {
    name: string;
    stats: Record<string, number>;
  };
  highlights: {
    [key: string]: "player1" | "player2" | "tie";
  };
}

export default function CompareGrid({ player1, player2, highlights }: CompareGridProps) {
  const statLabels: { [key: string]: string } = {
    wins: "Vinster",
    kills: "Kills",
    matches: "Matcher",
    kd: "K/D",
    winRate: "Winrate",
    killsPerMatch: "Kills/Match",
  };

  return (
    <div className="compare-grid">
      <div className="compare-header">
        <h3>{player1.name}</h3>
        <h3>Statistik</h3>
        <h3>{player2.name}</h3>
      </div>

      {Object.keys(statLabels).map((key) => {
        const val1 = player1.stats[key];
        const val2 = player2.stats[key];
        const total = val1 + val2 || 1;
        const percent1 = Math.round((val1 / total) * 100);
        const percent2 = 100 - percent1;

        return (
          <div className="compare-row" key={key}>
            <div className={`value ${highlights[key] === "player1" ? "highlight" : ""}`}>
              <span className="player-name">{player1.name}</span>
              {val1}
              <div className="bar-wrapper">
                <div className="compare-bar bar-blue" style={{ width: `${percent1}%` }}></div>
              </div>
            </div>
            <div className="label">{statLabels[key]}</div>
            <div className={`value ${highlights[key] === "player2" ? "highlight" : ""}`}>
              <span className="player-name">{player2.name}</span>
              {val2}
              <div className="bar-wrapper">
                <div className="compare-bar bar-red" style={{ width: `${percent2}%` }}></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
