import { QRCodeSVG } from 'qrcode.react';
import { getRoomJoinUrl } from '../utils/roomCode';

export default function QRDisplay({ roomCode }) {
  const joinUrl = getRoomJoinUrl(roomCode);

  return (
    <div className="qr-container glass-card glass-card--elevated">
      <p className="label">Quét mã để tham gia</p>
      <div className="qr-wrapper">
        <QRCodeSVG
          value={joinUrl}
          size={200}
          level="M"
          bgColor="#ffffff"
          fgColor="#0a0e1a"
        />
      </div>
      <div className="room-code">{roomCode}</div>
      <p className="subtitle" style={{ fontSize: '0.85rem', textAlign: 'center' }}>
        Hoặc nhập mã phòng ở trên
      </p>
    </div>
  );
}
