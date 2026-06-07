import useTimer from '../hooks/useTimer';
import useSound from '../hooks/useSound';
import { useEffect, useRef } from 'react';

export default function Timer({ active, duration = 15, onComplete }) {
  const { timeRemaining, progress } = useTimer(duration, active, onComplete);
  const { playTick } = useSound();
  const lastTickRef = useRef(null);

  // Play tick sound in last 5 seconds
  useEffect(() => {
    if (active && timeRemaining <= 5 && timeRemaining > 0 && timeRemaining !== lastTickRef.current) {
      lastTickRef.current = timeRemaining;
      playTick();
    }
  }, [timeRemaining, active, playTick]);

  const getBarClass = () => {
    if (progress > 0.5) return 'timer-bar__fill--safe';
    if (progress > 0.25) return 'timer-bar__fill--warning';
    return 'timer-bar__fill--danger';
  };

  return (
    <div className="stack--sm">
      <div className="row row--between">
        <span className="label">Thời gian</span>
        <span style={{
          fontWeight: 700,
          fontSize: '1.1rem',
          fontVariantNumeric: 'tabular-nums',
          color: progress <= 0.25 ? 'var(--red)' : 'var(--text-primary)',
        }}>
          {timeRemaining}s
        </span>
      </div>
      <div className="timer-bar">
        <div
          className={`timer-bar__fill ${getBarClass()}`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
