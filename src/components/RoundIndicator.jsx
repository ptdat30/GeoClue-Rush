import useGameStore from '../hooks/useGameState';

export default function RoundIndicator() {
  const currentRound = useGameStore(s => s.currentRound);
  const totalRounds = useGameStore(s => s.totalRounds);

  return (
    <div className="row" style={{ alignItems: 'center' }}>
      <span className="label">
        Lượt {currentRound}/{totalRounds}
      </span>
      <div className="round-indicator">
        {Array.from({ length: totalRounds }, (_, i) => {
          const round = i + 1;
          const isDouble = round === totalRounds;
          let className = 'round-dot ';

          if (round < currentRound) {
            className += 'round-dot--done';
          } else if (round === currentRound) {
            className += isDouble ? 'round-dot--double round-dot--active' : 'round-dot--active';
          } else {
            className += isDouble ? 'round-dot--double' : 'round-dot--upcoming';
          }

          return <div key={i} className={className} />;
        })}
      </div>
      {currentRound === totalRounds && (
        <span className="double-badge">⚡ 2X ĐIỂM</span>
      )}
    </div>
  );
}
