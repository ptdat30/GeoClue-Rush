import { useState } from 'react';
import { motion } from 'framer-motion';
import useGameStore from './hooks/useGameState';
import HomeScreen from './screens/HomeScreen';
import LobbyScreen from './screens/LobbyScreen';
import GameScreen from './screens/GameScreen';
import ResultScreen from './screens/ResultScreen';
import SettingsModal from './components/SettingsModal';
import settingsIcon from './assets/settings.png';

export default function App() {
  const phase = useGameStore(s => s.phase);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const renderScreen = () => {
    switch (phase) {
      case 'HOME':
        return <HomeScreen />;
      case 'LOBBY':
        return <LobbyScreen />;
      case 'PLAYING':
      case 'ROUND_RESULT':
        return <GameScreen />;
      case 'GAME_OVER':
        return <ResultScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <>
      {renderScreen()}

      {/* Floating Settings Gear Icon */}
      <motion.button
        onClick={() => setIsSettingsOpen(true)}
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: 'fixed',
          top: '12px',
          right: '12px',
          zIndex: 999,
          background: 'none',
          border: 'none',
          padding: 0,
          width: '52px',
          height: '52px',
          cursor: 'pointer',
          outline: 'none',
          overflow: 'hidden',
          borderRadius: '50%'
        }}
        id="btn-settings"
      >
        <img 
          src={settingsIcon} 
          alt="Cài Đặt" 
          style={{ 
            width: '100%', 
            height: 'auto',
            display: 'block',
            margin: '-12% 0',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))'
          }} 
        />
      </motion.button>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
}
