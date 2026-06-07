import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ConfettiOverlay from '../components/ConfettiOverlay';
import Scoreboard from '../components/Scoreboard';
import useGameStore from '../hooks/useGameState';
import useSound from '../hooks/useSound';
import logo from '../assets/logo.png';

export default function ResultScreen() {
  const finalScores = useGameStore(s => s.finalScores);
  const winner = useGameStore(s => s.winner);
  const playerId = useGameStore(s => s.playerId);
  const resetGame = useGameStore(s => s.resetGame);
  const { playVictory } = useSound();

  const [showConfetti, setShowConfetti] = useState(false);
  const isWinner = winner?.id === playerId;

  useEffect(() => {
    // Delay confetti for dramatic effect
    const timer = setTimeout(() => {
      setShowConfetti(true);
      playVictory();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayAgain = () => {
    resetGame();
  };

  return (
    <div className="screen">
      <ConfettiOverlay trigger={showConfetti} />

      <div className="container screen__content">
        <div className="stack--xl">
          {/* Trophy */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className="result-crown">👑</div>
          </motion.div>

          {/* Winner */}
          <motion.div
            className="text-center stack--sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="title--section" style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
              🏆 Nhà vô địch
            </h1>
            <div className="result-winner">
              {winner?.name || 'Không xác định'}
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 900,
              color: 'var(--gold)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              ⭐ {winner?.score || 0} điểm
            </div>
            {isWinner && (
              <motion.p
                className="subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                style={{ color: 'var(--accent-2)' }}
              >
                🎉 Chúc mừng bạn! Bạn là người giỏi nhất!
              </motion.p>
            )}
          </motion.div>

          {/* Final Leaderboard */}
          <motion.div
            className="stack--sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <span className="label text-center">📊 Bảng Xếp Hạng Cuối Cùng</span>
            <Scoreboard />
          </motion.div>

          {/* Actions */}
          <motion.div
            className="stack"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <button
              className="btn btn--primary btn--large btn--full"
              onClick={handlePlayAgain}
              id="btn-play-again"
            >
              🔄 Chơi Lại
            </button>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <img 
                src={logo} 
                alt="GeoClue Rush" 
                style={{ 
                  maxHeight: '32px', 
                  width: 'auto',
                  opacity: 0.8
                }} 
              />
              <p className="subtitle" style={{ fontSize: '0.8rem', marginTop: 0 }}>
                Đấu trường Địa lý Real-time 🌍
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
