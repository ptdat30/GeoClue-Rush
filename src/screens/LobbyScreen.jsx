import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRDisplay from '../components/QRDisplay';
import useGameStore from '../hooks/useGameState';
import useWebSocket from '../hooks/useWebSocket';
import logo from '../assets/logo.png';
import playGameImg from '../assets/play_game.png';
import backImg from '../assets/back.png';
import { renderAvatar } from '../components/PlayerAvatar';

export default function LobbyScreen() {
  const roomId = useGameStore(s => s.roomId);
  const players = useGameStore(s => s.players);
  const isHost = useGameStore(s => s.isHost);
  const playerId = useGameStore(s => s.playerId);
  const resetGame = useGameStore(s => s.resetGame);
  const { send, disconnect } = useWebSocket();

  const [showAllPlayers, setShowAllPlayers] = useState(false);

  const handleStart = () => {
    send('startGame');
  };

  const handleLeave = () => {
    disconnect();
    resetGame();
  };

  // Limit visible players in lobby chip grid to prevent overflow
  const MAX_VISIBLE_PLAYERS = 5;
  let visiblePlayers = [];
  let remainingCount = 0;

  if (players.length <= MAX_VISIBLE_PLAYERS + 1) {
    visiblePlayers = players;
    remainingCount = 0;
  } else {
    const host = players.find(p => p.isHost);
    const me = players.find(p => p.id === playerId);
    
    const selected = [];
    if (host) selected.push(host);
    if (me && me.id !== host?.id) selected.push(me);
    
    for (const player of players) {
      if (selected.length >= MAX_VISIBLE_PLAYERS) break;
      if (player.id !== host?.id && player.id !== me?.id) {
        selected.push(player);
      }
    }
    
    visiblePlayers = selected;
    remainingCount = players.length - visiblePlayers.length;
  }

  return (
    <div className="screen">
      <div className="container">
        <div className="stack stack--xl">
          {/* Header */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="logo" style={{ justifyContent: 'center', marginBottom: '8px' }}>
              <img
                src={logo}
                alt="GeoClue Rush"
                style={{
                  maxHeight: '50px',
                  width: 'auto',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                }}
              />
            </div>
            <h1 className="title--section">Phòng Chờ</h1>
          </motion.div>

          {/* QR Code */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <QRDisplay roomCode={roomId} />
          </motion.div>

          {/* Player List */}
          <motion.div
            className="stack"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="row row--between">
              <span className="label">
                Người chơi ({players.length}/40)
              </span>
              <span className="subtitle" style={{ fontSize: '0.85rem' }}>
                <span className="waiting-dots">Đang chờ</span>
              </span>
            </div>

            <div className="player-list">
              {visiblePlayers.map((player, i) => (
                <motion.div
                  key={player.id}
                  className={`player-chip ${player.isHost ? 'player-chip--host' : ''}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', flexShrink: 0 }}>
                    {renderAvatar(player.avatar, 20)}
                  </span>
                  <span>{player.name}</span>
                  {player.isHost && <span>👑</span>}
                  {player.id === playerId && (
                    <span style={{ color: 'var(--accent-2)', fontSize: '0.8rem' }}>(Bạn)</span>
                  )}
                </motion.div>
              ))}

              {remainingCount > 0 && (
                <motion.button
                  onClick={() => setShowAllPlayers(true)}
                  className="player-chip"
                  whileHover={{ scale: 1.05, backgroundColor: 'var(--bg-glass-hover)', borderColor: 'var(--accent-2)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px dashed var(--accent-2)',
                    color: 'var(--accent-2)',
                    fontWeight: '700',
                    cursor: 'pointer',
                    outline: 'none',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  <span>+{remainingCount}</span>
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Action Buttons */}
          {isHost ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="stack"
            >
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', width: '100%', maxWidth: '320px', margin: '0 auto' }}>
                <motion.button
                  onClick={handleStart}
                  disabled={players.length < 1}
                  id="btn-start-game"
                  whileHover={players.length >= 1 ? { scale: 1.05, y: -2 } : {}}
                  whileTap={players.length >= 1 ? { scale: 0.95 } : {}}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: players.length >= 1 ? 'pointer' : 'not-allowed',
                    flex: '1',
                    maxWidth: '140px',
                    outline: 'none',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    opacity: players.length >= 1 ? 1 : 0.5
                  }}
                >
                  <img 
                    src={playGameImg} 
                    alt="Bắt Đầu" 
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      display: 'block',
                      margin: '-18% 0',
                      filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))'
                    }}
                  />
                </motion.button>

                <motion.button
                  onClick={handleLeave}
                  id="btn-leave-room"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    flex: '1',
                    maxWidth: '140px',
                    outline: 'none',
                    borderRadius: '16px',
                    overflow: 'hidden'
                  }}
                >
                  <img 
                    src={backImg} 
                    alt="Rời Phòng" 
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      display: 'block',
                      margin: '-18% 0',
                      filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))'
                    }}
                  />
                </motion.button>
              </div>
              <p className="text-center subtitle" style={{ marginTop: '8px', fontSize: '0.8rem' }}>
                Tất cả người chơi sẽ nhận được thông báo
              </p>
            </motion.div>
          ) : (
            <div className="stack">
              <motion.div
                className="text-center glass-card"
                style={{ padding: '20px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="subtitle">
                  ⏳ Đang chờ chủ phòng bắt đầu trò chơi...
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}
              >
                <motion.button
                  onClick={handleLeave}
                  id="btn-leave-room"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    width: '100%',
                    maxWidth: '200px',
                    outline: 'none',
                    borderRadius: '16px',
                    overflow: 'hidden'
                  }}
                >
                  <img 
                    src={backImg} 
                    alt="Rời Phòng" 
                    style={{ 
                      width: '100%', 
                      height: 'auto', 
                      display: 'block',
                      margin: '-18% 0',
                      filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))'
                    }}
                  />
                </motion.button>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAllPlayers && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(5, 7, 15, 0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999,
              padding: '20px'
            }}
            onClick={() => setShowAllPlayers(false)}
          >
            <motion.div
              className="glass-card glass-card--elevated"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              style={{
                width: '100%',
                maxWidth: '400px',
                maxHeight: '70vh',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                overflow: 'hidden'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="row row--between" style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
                <h3 className="title--section" style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>
                  Danh Sách Người Chơi ({players.length})
                </h3>
                <button
                  onClick={() => setShowAllPlayers(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '1.8rem',
                    cursor: 'pointer',
                    padding: '0 4px',
                    lineHeight: 1,
                    outline: 'none'
                  }}
                >
                  &times;
                </button>
              </div>

              <div style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                paddingRight: '6px',
                marginTop: '4px'
              }}>
                {players.map((player) => (
                  <div
                    key={player.id}
                    className={`player-chip ${player.isHost ? 'player-chip--host' : ''}`}
                    style={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      padding: '10px 16px',
                      animation: 'none'
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', flexShrink: 0 }}>
                      {renderAvatar(player.avatar, 20)}
                    </span>
                    <span style={{ flex: 1, textAlign: 'left', marginLeft: '10px', fontSize: '0.95rem' }}>
                      {player.name}
                    </span>
                    {player.isHost && <span>👑</span>}
                    {player.id === playerId && (
                      <span style={{ color: 'var(--accent-2)', fontSize: '0.8rem', marginLeft: '6px' }}>(Bạn)</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
