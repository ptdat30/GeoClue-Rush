export function renderAvatar(avatar, size = 20) {
  const flags = ['vn', 'us', 'jp', 'gb', 'fr', 'kr', 'de', 'ca', 'au', 'br'];
  if (flags.includes(avatar)) {
    return (
      <img
        src={`https://flagcdn.com/w40/${avatar}.png`}
        alt={avatar}
        style={{
          width: `${size}px`,
          height: `${Math.round(size * 0.75)}px`,
          borderRadius: '3px',
          objectFit: 'cover',
          display: 'inline-block',
          verticalAlign: 'middle',
          boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
        }}
      />
    );
  }
  return <span style={{ fontSize: `${size}px`, display: 'inline-block', verticalAlign: 'middle' }}>{avatar || '🧭'}</span>;
}

export default function PlayerAvatar({ name, isHost, avatar }) {
  return (
    <div 
      className={`player-avatar ${isHost ? 'player-chip--host' : ''}`} 
      style={isHost ? {
        borderColor: 'var(--gold)',
        boxShadow: '0 0 12px var(--gold-glow), inset 0 0 8px var(--gold-glow)',
        background: 'rgba(255, 234, 167, 0.1)'
      } : {}}
    >
      <div className="player-avatar__badge" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {renderAvatar(avatar, 20)}
      </div>
      <span className="player-avatar__name">{name}</span>
      {isHost && <span className="player-avatar__host">👑 Chủ phòng</span>}
    </div>
  );
}
