interface Props {
    player: any;
  }
  
  export default function CompareBox({ player }: Props) {
    const stats = player.stats.all.overall;
    return (
      <div>
        <h3>{player.account.name}</h3>
        <ul>
          <li>Vinster: {stats.wins}</li>
          <li>Kills: {stats.kills}</li>
          <li>K/D: {stats.kd.toFixed(2)}</li>
          <li>Matcher: {stats.matches}</li>
          <li>Winrate: {stats.winRate.toFixed(1)}%</li>
        </ul>
      </div>
    );
  }
  