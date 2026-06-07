/**
 * Scoring formula for GeoClue Rush
 * Score = 100 - (timeElapsed / 15) * 80
 * Range: 20 (at 15s) to 100 (instant)
 * First correct: +10 bonus
 * Round 5: double points
 */

export function calculateScore(timeLeftSeconds, isFirstCorrect = false, isDoubleRound = false) {
  const timeLeft = Math.max(Math.min(timeLeftSeconds, 90), 0);
  let score = Math.floor((timeLeft / 90) * 1000);
  if (isFirstCorrect) score += 100;
  if (isDoubleRound) score *= 2;
  return score;
}

export function formatScore(score) {
  return score.toLocaleString('vi-VN');
}

export function getScoreColor(score) {
  if (score >= 180) return 'var(--gold)';
  if (score >= 90) return 'var(--accent-2)';
  if (score >= 50) return 'var(--accent-1)';
  return 'var(--text-secondary)';
}
