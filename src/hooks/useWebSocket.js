import { useEffect, useCallback } from 'react';
import { getMockWebSocket, resetMockWebSocket } from '../mock/mockWebSocket';
import useGameStore from './useGameState';

/**
 * Singleton WebSocket connection
 * Shared across all components via module-level variable
 */
let wsInstance = null;
let isListenerBound = false;

function bindListeners(ws) {
  if (isListenerBound) return;
  isListenerBound = true;

  ws.on('message', (data) => {
    const store = useGameStore.getState();
    switch (data.type) {
      case 'roomCreated':
        store.setRoomInfo(data.roomId, data.playerId, true);
        store.setPhase('LOBBY');
        break;

      case 'joinedRoom':
        store.setRoomInfo(data.roomId, data.playerId, false);
        store.setPhase('LOBBY');
        break;

      case 'playerJoined':
        store.updatePlayers(data.players);
        break;

      case 'gameStarting':
        // Brief countdown before game
        break;

      case 'roundStart':
        store.startRound(data);
        break;

      case 'hint':
        store.addHint(data);
        break;

      case 'revealLetter':
        store.revealLetter(data.index, data.letter);
        break;

      case 'answerResult':
        store.setGuessed(data);
        break;

      case 'playerAnswered':
        store.updatePlayerScore(data);
        break;

      case 'roundEnd':
        store.endRound(data);
        break;

      case 'gameOver':
        store.endGame(data);
        break;

      default:
        console.log('Unhandled message:', data);
    }
  });
}

export default function useWebSocket() {
  const connect = useCallback(() => {
    if (wsInstance) {
      resetMockWebSocket();
      isListenerBound = false;
    }
    wsInstance = getMockWebSocket();
    bindListeners(wsInstance);
    return wsInstance;
  }, []);

  const send = useCallback((action, payload = {}) => {
    if (wsInstance) {
      wsInstance.send(JSON.stringify({ action, ...payload }));
    } else {
      console.warn('WebSocket not connected. Call connect() first.');
    }
  }, []);

  const disconnect = useCallback(() => {
    resetMockWebSocket();
    wsInstance = null;
    isListenerBound = false;
  }, []);

  return { connect, send, disconnect };
}
