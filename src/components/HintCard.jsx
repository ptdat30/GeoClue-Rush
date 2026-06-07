import { motion } from 'framer-motion';

export default function HintCard({ hint, index, revealed }) {
  if (!revealed) {
    return (
      <div className="hint-card hint-card--locked">
        <span className="hint-card__emoji">🔒</span>
        <span className="hint-card__locked-text">
          Gợi ý {index + 1} — mở sau {index * 3}s
        </span>
      </div>
    );
  }

  return (
    <motion.div
      className="hint-card hint-card--revealed"
      initial={{ opacity: 0, x: 30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <span className="hint-card__emoji">{hint.emoji}</span>
      <span className="hint-card__text">{hint.text}</span>
    </motion.div>
  );
}
