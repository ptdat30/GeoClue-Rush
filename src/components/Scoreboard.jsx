import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../hooks/useGameState';

export default function Scoreboard({ compact = false }) {
  const players = useGameStore(s => s.players);
  const playerId = useGameStore(s => s.playerId);

  const sorted = [...players].sort((a, b) => b.score - a.score);
  const displayPlayers = compact ? sorted.slice(0, 5) : sorted;

  const getRankClass = (index) => {
    if (index === 0) return 'scoreboard__rank--1';
    if (index === 1) return 'scoreboard__rank--2';
    if (index === 2) return 'scoreboard__rank--3';
    return 'scoreboard__rank--other';
  };

  const getRankIcon = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return index + 1;
  };

  return (
    <div className="scoreboard glass-card">
      {compact && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="label">🏆 Bảng xếp hạng</span>
        </div>
      )}
      <AnimatePresence mode="popLayout">
        {displayPlayers.map((player, index) => (
          <motion.div
            key={player.id}
            className={`scoreboard__item ${
              player.id === playerId ? 'scoreboard__item--me' : ''
            } ${index === 0 ? 'scoreboard__item--first' : ''}`}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className={`scoreboard__rank ${getRankClass(index)}`}>
              {getRankIcon(index)}
            </div>
            <span className="scoreboard__name">
              {player.name}
              {player.id === playerId && ' (Bạn)'}
            </span>
            <span className="scoreboard__score" style={{
              color: index === 0 ? 'var(--gold)' : 'var(--text-primary)',
            }}>
              ⭐ {player.score}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
