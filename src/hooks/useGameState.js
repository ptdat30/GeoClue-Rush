import { create } from 'zustand';

const useGameStore = create((set, get) => ({
  // Connection
  phase: 'HOME', // HOME | LOBBY | PLAYING | ROUND_RESULT | GAME_OVER
  roomId: null,
  playerId: null,
  nickname: '',
  isHost: false,
  volume: parseFloat(localStorage.getItem('gcr_volume') ?? '0.5'),

  // Players
  players: [],

  // Round state
  currentRound: 0,
  totalRounds: 5,
  isDoubleRound: false,
  revealedHints: [],
  currentFlag: null,
  currentFlagUrl: null,
  currentCountryId: null,

  // Answer state
  hasGuessedThisRound: false,
  lastAnswerResult: null, // { correct, scoreGained, isFirst }

  // Scores
  myScore: 0,
  roundScores: [],

  // Game over
  finalScores: [],
  winner: null,

  // Correct answer display
  correctAnswer: null,
  maskedName: [],

  // Actions
  setPhase: (phase) => set({ phase }),
  setNickname: (nickname) => set({ nickname }),
  setRoomInfo: (roomId, playerId, isHost) => set({ roomId, playerId, isHost }),
  setVolume: (volume) => {
    localStorage.setItem('gcr_volume', volume.toString());
    set({ volume });
  },

  updatePlayers: (players) => set({ players }),

  startRound: (data) => set({
    phase: 'PLAYING',
    currentRound: data.round,
    totalRounds: data.totalRounds,
    isDoubleRound: data.isDoubleRound,
    revealedHints: [],
    currentFlag: data.flag,
    currentFlagUrl: data.flagUrl,
    currentCountryId: data.countryId,
    hasGuessedThisRound: false,
    lastAnswerResult: null,
    correctAnswer: null,
    maskedName: data.maskedName,
  }),

  revealLetter: (index, letter) => set(state => {
    const nextMasked = [...state.maskedName];
    if (nextMasked.length > index) {
      nextMasked[index] = letter;
    }
    return { maskedName: nextMasked };
  }),

  addHint: (hint) => set(state => ({
    revealedHints: [...state.revealedHints, hint],
  })),

  setGuessed: (result) => set({
    hasGuessedThisRound: true,
    lastAnswerResult: result,
    myScore: result.totalScore,
  }),

  updatePlayerScore: (data) => set(state => ({
    players: state.players.map(p =>
      p.id === data.playerId
        ? { ...p, score: data.totalScore }
        : p
    ),
  })),

  endRound: (data) => set({
    phase: 'ROUND_RESULT',
    roundScores: data.scores,
    correctAnswer: data.correctAnswer,
  }),

  endGame: (data) => set({
    phase: 'GAME_OVER',
    finalScores: data.finalScores,
    winner: data.winner,
  }),

  resetGame: () => set({
    phase: 'HOME',
    roomId: null,
    playerId: null,
    nickname: '',
    isHost: false,
    players: [],
    currentRound: 0,
    totalRounds: 5,
    isDoubleRound: false,
    revealedHints: [],
    currentFlag: null,
    currentFlagUrl: null,
    currentCountryId: null,
    hasGuessedThisRound: false,
    lastAnswerResult: null,
    myScore: 0,
    roundScores: [],
    finalScores: [],
    winner: null,
    correctAnswer: null,
    maskedName: [],
  }),
}));

export default useGameStore;
