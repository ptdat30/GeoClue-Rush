import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../hooks/useGameState';
import useWebSocket from '../hooks/useWebSocket';
import { renderAvatar } from './PlayerAvatar';

export default function SettingsModal({ isOpen, onClose }) {
  const volume = useGameStore(s => s.volume);
  const setVolume = useGameStore(s => s.setVolume);
  const avatar = useGameStore(s => s.avatar);
  const setAvatar = useGameStore(s => s.setAvatar);
  const phase = useGameStore(s => s.phase);
  const resetGame = useGameStore(s => s.resetGame);
  const { send, disconnect } = useWebSocket();

  const handleQuit = () => {
    if (window.confirm("Bạn có chắc chắn muốn thoát trò chơi và quay lại trang chủ không?")) {
      disconnect();
      resetGame();
      onClose();
    }
  };

  const handleAvatarChange = (newAvatar) => {
    setAvatar(newAvatar);
    if (phase !== 'HOME') {
      send('updateAvatar', { avatar: newAvatar });
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) return '🔇';
    if (volume < 0.4) return '🔈';
    if (volume < 0.7) return '🔉';
    return '🔊';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="glass-card glass-card--elevated"
            style={{
              width: '100%',
              maxWidth: '360px',
              padding: '24px',
              position: 'relative',
              zIndex: 1
            }}
          >
            <div className="stack">
              {/* Header */}
              <div className="row row--between" style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
                <h2 className="title--section" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  ⚙️ Cài Đặt
                </h2>
                <button
                  onClick={onClose}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Volume Slider */}
              <div className="stack--sm" style={{ marginTop: '12px' }}>
                <div className="row row--between">
                  <span className="label">🔊 Âm lượng</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent-2)' }}>
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <div className="row" style={{ gap: '12px', marginTop: '4px' }}>
                  <button
                    onClick={() => setVolume(volume > 0 ? 0 : 0.5)}
                    style={{
                      background: 'var(--bg-glass)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {getVolumeIcon()}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    style={{
                      flex: 1,
                      accentColor: 'var(--accent-1)',
                      height: '6px',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </div>

              {/* Avatar Selector */}
              <div className="stack--sm" style={{ marginTop: '16px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
                <div className="row row--between">
                  <span className="label">🌍 Chọn Quốc kỳ & Avatar</span>
                </div>
                <div 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(5, 1fr)', 
                    gap: '8px', 
                    marginTop: '8px' 
                  }}
                >
                  {['🧭', '🌐', '🎒', '🗺️', '📍', 'vn', 'us', 'jp', 'gb', 'fr', 'kr', 'de', 'ca', 'au', 'br'].map((item) => {
                    const isSelected = item === avatar;
                    return (
                      <button
                        key={item}
                        onClick={() => handleAvatarChange(item)}
                        style={{
                          background: isSelected ? 'rgba(255, 234, 167, 0.15)' : 'var(--bg-glass)',
                          border: isSelected ? '2px solid var(--gold)' : '1px solid var(--border-glass)',
                          borderRadius: '8px',
                          aspectRatio: '1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)',
                          boxShadow: isSelected ? '0 0 8px var(--gold-glow)' : 'none',
                          transform: isSelected ? 'scale(1.1)' : 'none',
                          outline: 'none',
                          padding: '4px'
                        }}
                      >
                        {renderAvatar(item, 24)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quit Game option */}
              {phase !== 'HOME' && (
                <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
                  <button
                    className="btn btn--danger btn--full"
                    onClick={handleQuit}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      fontWeight: 700
                    }}
                  >
                    Thoát Trò Chơi
                  </button>
                  <p className="text-center subtitle" style={{ fontSize: '0.75rem', marginTop: '6px', color: 'var(--text-muted)' }}>
                    Rời khỏi phòng đấu hiện tại và quay về Trang chủ
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
