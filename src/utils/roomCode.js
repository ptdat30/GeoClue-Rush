/**
 * Generate a random 5-character room code (uppercase letters + digits)
 */
export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // exclude confusing chars: I,O,0,1
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Validate room code format
 */
export function isValidRoomCode(code) {
  return /^[A-Z2-9]{5}$/.test(code);
}

/**
 * Generate the join URL for a room
 */
export function getRoomJoinUrl(roomCode) {
  const base = window.location.origin;
  return `${base}/join/${roomCode}`;
}
