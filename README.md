# Downloadly (Local-Only Video Downloader)

## Stack
- Frontend: React + Vite + Tailwind + Axios
- Backend: Flask + yt-dlp + FFmpeg

## Setup (Local)
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
   pip install -r requirements.txt
   python app.py
   ```
4. Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Deployment Guide (Vercel + Render)

### 1) Deploy backend on Render
1. Push this repository to GitHub.
2. In Render, create a **Web Service** from the repo.
3. Render can auto-detect `render.yaml` at the repo root.
4. Confirm service settings:
   - Root directory: `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `gunicorn app:app --bind 0.0.0.0:$PORT`
   - Health check: `/health`
5. Ensure FFmpeg is available in your Render environment (required by yt-dlp).

### 2) Deploy frontend on Vercel
1. In Vercel, import the same repo.
2. Set **Root Directory** to `frontend`.
3. Add environment variable in Vercel:
   - `VITE_API_BASE_URL=https://<your-render-service>.onrender.com`
4. Deploy.

### 3) Code changes included for deployment
- Frontend API base URL now reads `VITE_API_BASE_URL` and falls back to `http://localhost:5000` for local development.
- Added `backend/requirements.txt` with production server dependency (`gunicorn`).
- Added `render.yaml` for Render service config.
- Added `vercel.json` for Vercel build config.
- Added `frontend/.env.example` showing required frontend environment variable.

## REST API
- `GET /health`
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
