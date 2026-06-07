import HintCard from './HintCard';
import useGameStore from '../hooks/useGameState';

export default function HintStack() {
  const revealedHints = useGameStore(s => s.revealedHints);

  // Always show 5 slots
  const slots = Array.from({ length: 5 }, (_, i) => {
    const hint = revealedHints[i];
    return (
      <HintCard
        key={i}
        index={i}
        hint={hint}
        revealed={!!hint}
      />
    );
  });

  return <div className="stack--sm">{slots}</div>;
}
