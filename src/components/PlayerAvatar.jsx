export default function PlayerAvatar({ name, isHost }) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div className="player-avatar">
      <div className="player-avatar__badge">{initial}</div>
      <span className="player-avatar__name">{name}</span>
      {isHost && <span className="player-avatar__host">👑 Chủ phòng</span>}
    </div>
  );
}
