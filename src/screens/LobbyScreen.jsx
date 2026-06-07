import { motion } from 'framer-motion';
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

  const handleStart = () => {
    send('startGame');
  };

  const handleLeave = () => {
    disconnect();
    resetGame();
  };

  return (
    <div className="screen">
      <div className="container">
        <div className="stack--xl">
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
                👥 Người chơi ({players.length}/40)
              </span>
              <span className="subtitle" style={{ fontSize: '0.85rem' }}>
                <span className="waiting-dots">Đang chờ</span>
              </span>
            </div>

            <div className="player-list">
              {players.map((player, i) => (
                <motion.div
                  key={player.id}
                  className={`player-chip ${player.isHost ? 'player-chip--host' : ''}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
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
    </div>
  );
}
