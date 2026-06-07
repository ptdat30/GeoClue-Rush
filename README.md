# GeoClue Rush — Đấu trường Địa lý 🌍🏆

**GeoClue Rush** là một trò chơi giải đố địa lý trực tuyến thời gian thực, nơi người chơi cùng nhau tranh tài đoán tên các quốc gia dựa trên các gợi ý địa lý thú vị. Trò chơi kết hợp giao diện kính mờ (glassmorphic) hiện đại, các hiệu ứng chuyển động mượt mà bằng Framer Motion và cơ chế trò chơi vô cùng kịch tính.

---

## ✨ Tính Năng Nổi Bật

### 🎮 Trải Nghiệm Chơi Game Cuốn Hút
- **Chế độ phòng chơi (Lobby)**: Hỗ trợ tạo phòng chơi lên tới 40 người. Có hiển thị **Mã QR** và mã phòng để người chơi quét mã hoặc nhập mã tham gia cực kỳ nhanh chóng.
- **Tích hợp Bot thông minh**: Tự động thêm các đối thủ máy (Bot) vào phòng chờ để tranh tài cùng người chơi thực, đảm bảo trận đấu luôn kịch tính.
- **Bảng điều khiển Cài đặt (Settings)**: Cho phép điều chỉnh âm lượng hiệu ứng âm thanh thời gian thực (lưu trong `localStorage`) hoặc thoát trận đấu nhanh chóng.

### ⏱️ Cơ Chế Đoán Chữ & Gợi Ý "Rơi Chữ" (Progressive Reveal)
- **Vòng chơi 90 giây**: Mỗi câu hỏi kéo dài tối đa 90 giây.
- **Ẩn đáp án thông minh**: Tên quốc gia mục tiêu ban đầu hiển thị dưới dạng các dấu gạch dưới `_ _ _ _   _ _ _` (giữ nguyên khoảng trắng để dễ hình dung cấu trúc từ).
- **Lật chữ ngẫu nhiên**: Các chữ cái trong đáp án được lật mở ngẫu nhiên trải đều trong 80 giây đầu tiên. 10 giây cuối cùng sẽ hiển thị 100% đáp án để trợ giúp người chơi.
- **Hệ thống Gợi ý Địa lý**: Các thông tin gợi ý (châu lục, dân số, thủ đô, ngôn ngữ, tiền tệ) tự động xuất hiện lần lượt sau mỗi **15 giây**.
- **Khung nhập đáp án tự do**: Người chơi nhập đáp án trực tiếp (không tự động gợi ý từ danh sách). Nếu gõ sai, ô nhập sẽ **rung lắc nhẹ (shake)** báo viền đỏ và tự động xóa trắng giúp người chơi gõ tiếp liên tục mà không bị gián đoạn. Hỗ trợ nhận diện cả câu trả lời có dấu và không dấu (ví dụ: `Việt Nam` hoặc `viet nam` đều chính xác).

### 📈 Hệ Thống Tính Điểm & Xếp Hạng Kịch Tính
- **Điểm theo thời gian**: Trả lời càng nhanh điểm càng cao (tối đa 1000 điểm, giảm dần theo thời gian).
- **Thưởng nóng (First Blood)**: Cộng thêm **+100 điểm** cho người chơi đầu tiên trả lời đúng trong phòng.
- **Nhân đôi điểm (Double Points)**: Điểm số được nhân đôi ở vòng đấu cuối cùng (Vòng 5) để tạo cơ hội lội ngược dòng.
- **Bảng xếp hạng thời gian thực**: Cập nhật điểm số liên tục của tất cả người chơi và bot sau mỗi vòng.
- **Màn hình tổng kết vinh danh**: Hiệu ứng pháo hoa rực rỡ chúc mừng người chiến thắng chung cuộc.

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React (Vite) + JavaScript + CSS Vanilla (Custom design tokens)
- **State Management**: Zustand
- **Animations**: Framer Motion (Hiệu ứng thẻ bài kính mờ, rung lắc input, modal trượt mượt mà)
- **Realtime / Networking**: Khớp nối WebSocket (kèm theo bộ giả lập WebSocket Client/Server chi tiết chạy offline cực kỳ ổn định).

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu Cầu Hệ Thống
Đảm bảo máy tính của bạn đã cài đặt [Node.js](https://nodejs.org/) (Khuyên dùng phiên bản 16 trở lên).

### Các Bước Thực Hiện

1. **Clone dự án hoặc tải mã nguồn về máy**.
2. **Cài đặt các thư viện phụ thuộc (dependencies)**:
   ```bash
   npm install
   ```
3. **Khởi chạy máy chủ phát triển (Dev Server)**:
   ```bash
   npm run dev
   ```
   Sau khi chạy lệnh, truy cập trình duyệt theo địa chỉ mặc định: `http://localhost:5173` để trải nghiệm trò chơi.
4. **Đóng gói dự án (Build Production)**:
   ```bash
   npm run build
   ```

---

## 📂 Cấu Trúc Thư Mục Chính

```text
├── src/
│   ├── assets/          # Tài nguyên hình ảnh, biểu tượng tùy chỉnh (play_game, back, settings, logo...)
│   ├── components/      # Các thành phần tái sử dụng (AnswerInput, SettingsModal, Timer, QRDisplay...)
│   ├── hooks/           # Các custom hooks điều khiển trạng thái (useGameState, useSound, useWebSocket...)
│   ├── mock/            # Bộ giả lập WebSocket Server & logic phòng chơi, câu hỏi
│   ├── screens/         # Các màn hình chính (HomeScreen, LobbyScreen, GameScreen, ResultScreen)
│   ├── utils/           # Tiện ích bổ trợ (tính điểm, chuẩn hóa đáp án chuẩn không dấu, tạo mã phòng...)
│   ├── index.css        # Hệ thống CSS Design System (Glassmorphism, màu sắc HSL, hiệu ứng biến)
│   └── main.jsx         # Điểm khởi chạy ứng dụng React
```

Chúc bạn có những giây phút giải trí và đấu trí địa lý thú vị cùng **GeoClue Rush**! 🗺️💡
