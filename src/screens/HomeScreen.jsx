import { useState } from 'react';
import { motion } from 'framer-motion';
import useWebSocket from '../hooks/useWebSocket';
import useGameStore from '../hooks/useGameState';

import logo from '../assets/logo.png';
import playGameImg from '../assets/play_game.png';
import createRoomImg from '../assets/create_room.png';
import joinRoomImg from '../assets/join_room.png';
import backImg from '../assets/back.png';

export default function HomeScreen() {
  const [mode, setMode] = useState(null); // 'create' | 'join'
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const { connect, send } = useWebSocket();
  const setNickStore = useGameStore(s => s.setNickname);
  const avatar = useGameStore(s => s.avatar);

  const handleCreate = () => {
    if (!nickname.trim()) {
      setError('Vui lòng nhập tên của bạn');
      return;
    }
    setError('');
    setNickStore(nickname.trim());
    const ws = connect();
    send('createRoom', { nickname: nickname.trim(), avatar });
  };

  const handleJoin = () => {
    if (!nickname.trim()) {
      setError('Vui lòng nhập tên của bạn');
      return;
    }
    if (!roomCode.trim() || roomCode.trim().length < 5) {
      setError('Mã phòng phải có 5 ký tự');
      return;
    }
    setError('');
    setNickStore(nickname.trim());
    const ws = connect();
    send('joinRoom', { nickname: nickname.trim(), roomId: roomCode.trim().toUpperCase(), avatar });
  };

  return (
    <div className="screen">
      <div className="container screen__content">
        {/* Hero */}
        <motion.div
          className="text-center stack--lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <img
              src={logo}
              alt="GeoClue Rush"
              style={{
                maxHeight: '160px',
                width: 'auto',
                display: 'block',
                margin: '0 auto 16px auto',
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))'
              }}
            />
          </div>
        </motion.div>

        {/* Mode Selection */}
        {!mode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ width: '100%', maxWidth: '320px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0px' }}
          >
            <motion.button
              onClick={() => setMode('create')}
              id="btn-create-room"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                width: '100%',
                display: 'block',
                outline: 'none',
                borderRadius: '16px',
                overflow: 'hidden',
                margin: '0px'
              }}
            >
              <img
                src={playGameImg}
                alt="Tạo Phòng Mới"
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
              onClick={() => setMode('join')}
              id="btn-join-room"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                width: '100%',
                display: 'block',
                outline: 'none',
                borderRadius: '16px',
                overflow: 'hidden',
                margin: '0px'
              }}
            >
              <img
                src={joinRoomImg}
                alt="Tham Gia Phòng"
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
        )}

        {/* Nickname + Action Form */}
        {mode && (
          <motion.div
            className="stack"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="glass-card glass-card--elevated" style={{ padding: '24px' }}>
              <div className="stack">
                <h2 className="title--section" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                  {mode === 'create' ? 'Create Room' : 'Join Room'}
                </h2>

                <hr className="divider" />

                <div className="stack--sm">
                  <label className="label" htmlFor="nickname-input">Name</label>
                  <input
                    id="nickname-input"
                    type="text"
                    className="input input--large"
                    placeholder="Enter name..."
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={20}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        mode === 'create' ? handleCreate() : (roomCode.length >= 5 && handleJoin());
                      }
                    }}
                  />
                </div>

                {mode === 'join' && (
                  <div className="stack--sm">
                    <label className="label" htmlFor="room-code-input">Room Code</label>
                    <input
                      id="room-code-input"
                      type="text"
                      className="input input--large"
                      placeholder="Enter room code"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      maxLength={5}
                      style={{ letterSpacing: '0.2em', fontWeight: 700, textAlign: 'center' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleJoin();
                      }}
                    />
                  </div>
                )}

                {error && (
                  <p style={{ color: 'var(--red)', fontSize: '0.9rem', fontWeight: 500 }}>
                    ⚠️ {error}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', width: '100%', marginTop: '8px' }}>
                  <motion.button
                    onClick={mode === 'create' ? handleCreate : handleJoin}
                    id="btn-submit"
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
                      src={mode === 'create' ? createRoomImg : joinRoomImg} 
                      alt={mode === 'create' ? "Create Room" : "Join Game"} 
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
                    onClick={() => { setMode(null); setError(''); }}
                    id="btn-back"
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
                      alt="Back" 
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
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ paddingBottom: '20px' }}
        >
        </motion.div>
      </div>
    </div>
  );
}
