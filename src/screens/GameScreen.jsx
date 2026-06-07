import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Timer from '../components/Timer';
import HintStack from '../components/HintStack';
import AnswerInput from '../components/AnswerInput';
import Scoreboard from '../components/Scoreboard';
import RoundIndicator from '../components/RoundIndicator';
import useGameStore from '../hooks/useGameState';
import useWebSocket from '../hooks/useWebSocket';
import useSound from '../hooks/useSound';

export default function GameScreen() {
  const phase = useGameStore(s => s.phase);
  const currentRound = useGameStore(s => s.currentRound);
  const isDoubleRound = useGameStore(s => s.isDoubleRound);
  const hasGuessedThisRound = useGameStore(s => s.hasGuessedThisRound);
  const lastAnswerResult = useGameStore(s => s.lastAnswerResult);
  const correctAnswer = useGameStore(s => s.correctAnswer);
  const currentFlag = useGameStore(s => s.currentFlag);
  const roundScores = useGameStore(s => s.roundScores);
  const playerId = useGameStore(s => s.playerId);
  const maskedName = useGameStore(s => s.maskedName);
  const { send } = useWebSocket();
  const { playCorrect, playWrong, playWhoosh } = useSound();

  const [showScoreFly, setShowScoreFly] = useState(null);

  // Play whoosh on round start
  useEffect(() => {
    if (phase === 'PLAYING') {
      playWhoosh();
    }
  }, [currentRound, phase]);

  const handleSubmitAnswer = useCallback((answer) => {
    if (hasGuessedThisRound && lastAnswerResult?.correct) return;
    send('submitAnswer', { answer, timestamp: Date.now() });
  }, [hasGuessedThisRound, lastAnswerResult, send]);

  // Sound & score animation on answer result
  useEffect(() => {
    if (lastAnswerResult) {
      if (lastAnswerResult.correct) {
        playCorrect();
        setShowScoreFly(`+${lastAnswerResult.scoreGained}`);
        setTimeout(() => setShowScoreFly(null), 1500);
      } else {
        playWrong();
      }
    }
  }, [lastAnswerResult]);

  const handleTimeUp = useCallback(() => {
    // Timer expired - just wait for server roundEnd
  }, []);

  if (phase === 'ROUND_RESULT') {
    return (
      <div className="screen">
        <div className="container">
          <div className="stack--xl" style={{ paddingTop: '20px' }}>
            <RoundIndicator />

            {/* Correct Answer Reveal */}
            {correctAnswer && (
              <motion.div
                className="correct-reveal"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <div className="correct-reveal__flag">{correctAnswer.flag}</div>
                <div className="correct-reveal__name">{correctAnswer.name}</div>
                <p className="subtitle" style={{ marginTop: '4px' }}>{correctAnswer.nameVi}</p>
              </motion.div>
            )}

            {/* Round Scores */}
            <div className="stack--sm">
              <span className="label">📊 Kết quả lượt {currentRound}</span>
              <Scoreboard />
            </div>

            <div className="text-center">
              <p className="subtitle">
                {currentRound < 5
                  ? '⏳ Lượt tiếp theo sắp bắt đầu...'
                  : '🏁 Đang tổng kết...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="container">
        <div className="stack" style={{ paddingTop: '10px' }}>
          {/* Round + Flag */}
          <div className="row row--between" style={{ alignItems: 'flex-start' }}>
            <RoundIndicator />
            {currentFlag && (
              <motion.span
                style={{ fontSize: '2.5rem' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                {currentFlag}
              </motion.span>
            )}
          </div>

          {/* Timer */}
          <Timer active={phase === 'PLAYING'} duration={90} onComplete={handleTimeUp} />

          {/* Masked Country Name */}
          <div 
            className="glass-card" 
            style={{ 
              padding: '16px', 
              textAlign: 'center', 
              margin: '8px 0',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '6px',
              minHeight: '70px'
            }}
          >
            {maskedName && maskedName.map((char, index) => {
              if (char === ' ') {
                return (
                  <span 
                    key={index} 
                    style={{ 
                      width: '24px', 
                      height: '32px',
                      display: 'inline-block' 
                    }} 
                  />
                );
              }
              return (
                <span 
                  key={index} 
                  style={{ 
                    fontSize: '1.8rem', 
                    fontWeight: '800', 
                    borderBottom: '3px solid var(--accent-1)', 
                    padding: '0 4px', 
                    display: 'inline-block', 
                    minWidth: '24px', 
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    color: char === '_' ? 'transparent' : 'var(--accent-2)',
                    textShadow: char === '_' ? 'none' : '0 0 10px var(--accent-2-glow)'
                  }}
                >
                  {char === '_' ? ' ' : char}
                </span>
              );
            })}
          </div>

          {/* Double Points Banner */}
          <AnimatePresence>
            {isDoubleRound && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,234,167,0.15), rgba(243,156,18,0.15))',
                  border: '1px solid rgba(255,234,167,0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px',
                }}
              >
                <span style={{ fontWeight: 700, color: 'var(--gold)' }}>
                  ⚡ LƯỢT CUỐI — NHÂN ĐÔI ĐIỂM! ⚡
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hints */}
          <HintStack />

          {/* Answer Feedback */}
          <AnimatePresence>
            {lastAnswerResult && (
              <motion.div
                className={`answer-feedback ${
                  lastAnswerResult.correct ? 'answer-feedback--correct' : 'answer-feedback--wrong'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {lastAnswerResult.correct ? (
                  <>
                    Chính xác! +{lastAnswerResult.scoreGained} điểm
                    {lastAnswerResult.isFirst && ' (Nhanh nhất!)'}
                  </>
                ) : (
                  <>Sai rồi! Thử lại nhé</>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          <AnswerInput
            onSubmit={handleSubmitAnswer}
            disabled={hasGuessedThisRound && lastAnswerResult?.correct}
          />

          {/* Mini Scoreboard */}
          <Scoreboard compact />

          {/* Score Fly Animation */}
          <AnimatePresence>
            {showScoreFly && (
              <motion.div
                className="score-fly"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.5 }}
              >
                {showScoreFly}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
