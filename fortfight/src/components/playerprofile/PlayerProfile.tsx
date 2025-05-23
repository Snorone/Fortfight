// import React from "react";
import "./PlayerProfile.css";

interface PlayerProfileProps {
    name: string;
    wins: number;
    kills: number;
    matches: number;
    kd?: number;
    winRate?: number;
    killsPerMatch?: number;
    highlight?: {
      wins: boolean | undefined;
      kills: boolean | undefined;
      matches: boolean | undefined;
      kd: boolean | undefined;
      winRate: boolean | undefined;
      killsPerMatch: boolean | undefined;
    };
  }

  function getStatIcon(value: boolean | undefined) {
    if (value === true) return <span style={{ color: "green", fontWeight: "bold" }}> 🔺</span>;
    if (value === false) return <span style={{ color: "red", fontWeight: "bold" }}> 🔻</span>;
    return null;
  }
export default function PlayerProfile({
  name,
  wins,
  kills,
  matches,
  highlight,
  kd,
  winRate,
  killsPerMatch
}: PlayerProfileProps) {
  return (
    <div className="player-profile">
      <h2 className="player-name">{name}</h2>
      <ul className="stats-list">
      <li className={highlight?.wins ? "highlight" : ""}>
  Vinster: {wins}{getStatIcon(highlight?.wins)}
</li>
<li className={highlight?.kills ? "highlight" : ""}>
  Kills: {kills}{getStatIcon(highlight?.kills)}
</li>
<li className={highlight?.matches ? "highlight" : ""}>
  Matcher: {matches}{getStatIcon(highlight?.matches)}
</li>
<li className={highlight?.kd ? "highlight" : ""}>
  K/D: {kd?.toFixed(2)}{getStatIcon(highlight?.kd)}
</li>
<li className={highlight?.winRate ? "highlight" : ""}>
  Winrate: {winRate?.toFixed(1)}%{getStatIcon(highlight?.winRate)}
</li>
<li className={highlight?.killsPerMatch ? "highlight" : ""}>
  Kills/Match: {killsPerMatch?.toFixed(2)}{getStatIcon(highlight?.killsPerMatch)}
</li>

      </ul>
    </div>
  );
}

