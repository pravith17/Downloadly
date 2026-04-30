# Downloadly (Local-Only Video Downloader)

## Stack
- Frontend: React + Vite + Tailwind + Axios
- Backend: Flask + yt-dlp + FFmpeg

## Setup
1. Install Python 3.10+ and Node.js 18+.
2. Install FFmpeg:
   - Windows: `winget install Gyan.FFmpeg`
   - macOS: `brew install ffmpeg`
   - Linux: `sudo apt install ffmpeg`
3. Backend:
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
   pip install flask flask-cors yt-dlp
   python app.py
   ```
4. Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## REST API
- `GET /analyze?url=`
- `POST /download` `{url, format_id, audio_only, subtitles, filename}`
- `GET /progress`
- `GET /downloads`
- `DELETE /delete?path=`
- `POST /cancel`
- `GET /history`

## Example usage
1. Paste URL.
2. Click **Analyze**.
3. Choose format / audio-only.
4. Click **Start Download**.
5. Track progress, cancel/retry, and reuse history.

This project is intended for local/private use on your own machine only.
