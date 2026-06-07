/**
 * Mock WebSocket for local development
 * Simulates server behavior for the full game loop
 */
import { generateRoomCode } from '../utils/roomCode';
import { calculateScore } from '../utils/scoring';

class MockWebSocket {
  constructor() {
    this.listeners = {};
    this.roomId = null;
    this.players = new Map();
    this.currentRound = 0;
    this.countries = [];
    this.roundCountries = [];
    this.roundStartTime = null;
    this.timers = [];
    this.firstCorrectThisRound = false;
    this.myConnectionId = 'local_' + Math.random().toString(36).substr(2, 9);
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  send(message) {
    const msg = typeof message === 'string' ? JSON.parse(message) : message;
    setTimeout(() => this._handleMessage(msg), 100);
  }

  async _loadCountries() {
    if (this.countries.length > 0) return;
    try {
      const res = await fetch('/countries.json');
      this.countries = await res.json();
    } catch (e) {
      console.error('Failed to load countries:', e);
    }
  }

  _handleMessage(msg) {
    switch (msg.action) {
      case 'createRoom':
        this._createRoom(msg);
        break;
      case 'joinRoom':
        this._joinRoom(msg);
        break;
      case 'startGame':
        this._startGame();
        break;
      case 'submitAnswer':
        this._submitAnswer(msg);
        break;
      default:
        console.warn('Unknown action:', msg.action);
    }
  }

  _createRoom(msg) {
    this.roomId = generateRoomCode();
    this.players.clear();
    this.players.set(this.myConnectionId, {
      name: msg.nickname,
      score: 0,
      hasGuessedThisRound: false,
      isHost: true,
    });
    this.emit('message', {
      type: 'roomCreated',
      roomId: this.roomId,
      playerId: this.myConnectionId,
    });
    this.emit('message', {
      type: 'playerJoined',
      players: this._getPlayersArray(),
    });

    // Add mock bot players
    this._addBotPlayers();
  }

  _joinRoom(msg) {
    if (!this.roomId) {
      // Simulate auto-creating room for testing
      this.roomId = msg.roomId || generateRoomCode();
    }
    this.players.set(this.myConnectionId, {
      name: msg.nickname,
      score: 0,
      hasGuessedThisRound: false,
      isHost: this.players.size === 0,
    });
    this.emit('message', {
      type: 'joinedRoom',
      roomId: this.roomId,
      playerId: this.myConnectionId,
    });
    this.emit('message', {
      type: 'playerJoined',
      players: this._getPlayersArray(),
    });

    // Add mock bot players
    this._addBotPlayers();
  }

  _addBotPlayers() {
    const botNames = ['GeoNerd🌍', 'MapMaster🗺️', 'WorldRunner🏃'];
    botNames.forEach((name, i) => {
      setTimeout(() => {
        const botId = 'bot_' + i;
        this.players.set(botId, {
          name,
          score: 0,
          hasGuessedThisRound: false,
          isHost: false,
        });
        this.emit('message', {
          type: 'playerJoined',
          players: this._getPlayersArray(),
        });
      }, 1000 * (i + 1));
    });
  }

  async _startGame() {
    await this._loadCountries();

    // Select 5 random countries for rounds
    const shuffled = [...this.countries].sort(() => Math.random() - 0.5);
    this.roundCountries = shuffled.slice(0, 5);
    this.currentRound = 0;

    this.emit('message', {
      type: 'gameStarting',
      totalRounds: 5,
    });

    setTimeout(() => this._startRound(), 2000);
  }

  _startRound() {
    this.currentRound++;
    this.firstCorrectThisRound = false;
    const isDoubleRound = this.currentRound === 5;

    // Reset hasGuessedThisRound
    for (const [id, p] of this.players) {
      p.hasGuessedThisRound = false;
    }

    const country = this.roundCountries[this.currentRound - 1];
    this.roundStartTime = Date.now();

    // Prepare initial masked name
    const nameVi = country.nameVi;
    const maskedName = [];
    const letterIndices = [];

    for (let i = 0; i < nameVi.length; i++) {
      const char = nameVi[i];
      if (char === ' ') {
        maskedName.push(' ');
      } else {
        maskedName.push('_');
        letterIndices.push(i);
      }
    }

    this.emit('message', {
      type: 'roundStart',
      round: this.currentRound,
      totalRounds: 5,
      isDoubleRound,
      countryId: country.id,
      flag: country.flag,
      flagUrl: country.flagUrl,
      maskedName: [...maskedName],
    });

    // Progressive Reveal letter indices
    const shuffledIndices = [...letterIndices].sort(() => Math.random() - 0.5);
    const N = shuffledIndices.length;

    shuffledIndices.forEach((letterIndex, i) => {
      const revealTime = Math.round((i + 1) * (80000 / N));
      const timer = setTimeout(() => {
        this.emit('message', {
          type: 'revealLetter',
          index: letterIndex,
          letter: nameVi[letterIndex],
        });
      }, revealTime);
      this.timers.push(timer);
    });

    // Send text hints every 15s (at 0s, 15s, 30s, 45s, 60s)
    country.hints.forEach((hint, index) => {
      const timer = setTimeout(() => {
        this.emit('message', {
          type: 'hint',
          index,
          hintType: hint.type,
          text: hint.text,
          emoji: hint.emoji,
        });
      }, index * 15000);
      this.timers.push(timer);
    });

    // Bots answer at random times
    this._botAnswers(country);

    // End round after 90s
    const endTimer = setTimeout(() => {
      this._endRound(country);
    }, 90000);
    this.timers.push(endTimer);
  }

  _checkAllClear(country) {
    const allGuessed = Array.from(this.players.values()).every(p => p.hasGuessedThisRound);
    if (allGuessed) {
      // Clear timers and end round immediately!
      this.timers.forEach(t => clearTimeout(t));
      this.timers = [];
      this._endRound(country);
    }
  }

  _botAnswers(country) {
    for (const [id, p] of this.players) {
      if (id.startsWith('bot_')) {
        // Bots answer at random times between 5s and 75s
        const delay = 5000 + Math.random() * 70000;
        const correct = Math.random() > 0.15; // 85% eventually guess correctly
        const timer = setTimeout(() => {
          if (p.hasGuessedThisRound) return;

          if (correct) {
            p.hasGuessedThisRound = true;
            const timeLeft = Math.max(90 - delay / 1000, 0);
            const isFirst = !this.firstCorrectThisRound;
            if (isFirst) this.firstCorrectThisRound = true;
            const score = calculateScore(timeLeft, isFirst, this.currentRound === 5);
            p.score += score;

            this.emit('message', {
              type: 'playerAnswered',
              playerId: id,
              playerName: p.name,
              correct: true,
              scoreGained: score,
              totalScore: p.score,
            });

            this._checkAllClear(country);
          }
        }, delay);
        this.timers.push(timer);
      }
    }
  }

  _submitAnswer(msg) {
    const player = this.players.get(this.myConnectionId);
    if (!player || player.hasGuessedThisRound) return;

    const country = this.roundCountries[this.currentRound - 1];

    const normalizeString = (str) => {
      if (!str) return '';
      return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9]/g, ""); // keep alphanumeric only
    };

    const userAnswerNormalized = normalizeString(msg.answer);

    const possibleAnswers = [
      country.name,
      country.nameVi,
      ...(country.aliases || [])
    ].map(normalizeString);

    const correct = possibleAnswers.includes(userAnswerNormalized);

    if (correct) {
      player.hasGuessedThisRound = true;
      const timeElapsed = Date.now() - this.roundStartTime;
      const timeLeft = Math.max(90 - timeElapsed / 1000, 0);
      const isFirst = !this.firstCorrectThisRound;
      if (isFirst) this.firstCorrectThisRound = true;
      const score = calculateScore(timeLeft, isFirst, this.currentRound === 5);
      player.score += score;

      this.emit('message', {
        type: 'answerResult',
        correct: true,
        scoreGained: score,
        totalScore: player.score,
        isFirst,
      });

      this.emit('message', {
        type: 'playerAnswered',
        playerId: this.myConnectionId,
        playerName: player.name,
        correct: true,
        scoreGained: score,
        totalScore: player.score,
      });

      this._checkAllClear(country);
    } else {
      this.emit('message', {
        type: 'answerResult',
        correct: false,
        scoreGained: 0,
        totalScore: player.score,
      });
    }
  }

  _endRound(country) {
    const scores = this._getPlayersArray()
      .sort((a, b) => b.score - a.score);

    this.emit('message', {
      type: 'roundEnd',
      round: this.currentRound,
      correctAnswer: {
        id: country.id,
        name: country.name,
        nameVi: country.nameVi,
        flag: country.flag,
      },
      scores,
    });

    // Next round or game over
    if (this.currentRound < 5) {
      setTimeout(() => this._startRound(), 4000);
    } else {
      setTimeout(() => {
        this.emit('message', {
          type: 'gameOver',
          finalScores: scores,
          winner: scores[0],
        });
      }, 3000);
    }
  }

  _getPlayersArray() {
    return Array.from(this.players.entries()).map(([id, p]) => ({
      id,
      ...p,
    }));
  }

  cleanup() {
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
    this.listeners = {};
  }
}

let mockInstance = null;

export function getMockWebSocket() {
  if (!mockInstance) {
    mockInstance = new MockWebSocket();
  }
  return mockInstance;
}

export function resetMockWebSocket() {
  if (mockInstance) {
    mockInstance.cleanup();
    mockInstance = null;
  }
}
