from __future__ import annotations

import logging
import threading
import uuid
from pathlib import Path
from typing import Any

import yt_dlp

from utils import build_download_path, detect_platform, humanize_yt_dlp_error, sanitize_filename

logger = logging.getLogger(__name__)


class DownloadManager:
    def __init__(self, downloads_dir: str):
        self.downloads_dir = Path(downloads_dir)
        self.downloads_dir.mkdir(parents=True, exist_ok=True)
        self.jobs: dict[str, dict[str, Any]] = {}
        self.history: list[dict[str, Any]] = []
        self.lock = threading.Lock()

    def analyze(self, url: str) -> dict[str, Any]:
        ydl_opts = {"quiet": True, "noplaylist": True, "skip_download": True}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        formats = []
        for f in info.get("formats", []):
            formats.append(
                {
                    "format_id": f.get("format_id"),
                    "ext": f.get("ext"),
                    "resolution": f.get("resolution") or f"{f.get('height', 'audio')}p",
                    "filesize": f.get("filesize") or f.get("filesize_approx"),
                    "vcodec": f.get("vcodec"),
                    "acodec": f.get("acodec"),
                    "fps": f.get("fps"),
                }
            )

        recommended = next((f["format_id"] for f in formats if f["ext"] == "mp4" and "1080" in str(f["resolution"])), None)
        if not recommended and formats:
            recommended = formats[0]["format_id"]

        return {
            "title": info.get("title"),
            "thumbnail": info.get("thumbnail"),
            "duration": info.get("duration"),
            "platform": detect_platform(url),
            "formats": formats,
            "recommended_format_id": recommended,
            "has_video": any(f.get("vcodec") != "none" for f in formats),
            "has_audio": any(f.get("acodec") != "none" for f in formats),
        }

    def start_download(self, url: str, format_id: str | None, audio_only: bool = False, filename: str | None = None, subtitles: bool = False) -> str:
        job_id = str(uuid.uuid4())
        platform = detect_platform(url)
        target_dir = build_download_path(self.downloads_dir, platform)
        with self.lock:
            self.jobs[job_id] = {
                "id": job_id,
                "url": url,
                "status": "pending",
                "progress": 0,
                "speed": None,
                "eta": None,
                "error": None,
                "file": None,
                "platform": platform,
            }

        thread = threading.Thread(
            target=self._download_worker,
            args=(job_id, url, format_id, audio_only, filename, subtitles, target_dir),
            daemon=True,
        )
        thread.start()
        return job_id

    def cancel(self, job_id: str) -> bool:
        with self.lock:
            job = self.jobs.get(job_id)
            if not job:
                return False
            job["cancelled"] = True
            return True

    def _download_worker(self, job_id: str, url: str, format_id: str | None, audio_only: bool, filename: str | None, subtitles: bool, target_dir: Path):
        def hook(data):
            with self.lock:
                job = self.jobs[job_id]
                if job.get("cancelled"):
                    raise yt_dlp.utils.DownloadError("Cancelled by user")
                if data.get("status") == "downloading":
                    total = data.get("total_bytes") or data.get("total_bytes_estimate") or 1
                    downloaded = data.get("downloaded_bytes") or 0
                    job["status"] = "downloading"
                    job["progress"] = round((downloaded / total) * 100, 2)
                    job["speed"] = data.get("speed")
                    job["eta"] = data.get("eta")
                elif data.get("status") == "finished":
                    job["progress"] = 100

        output_name = sanitize_filename(filename) if filename else "%(title)s"
        output_template = str(target_dir / f"{output_name}.%(ext)s")

        ydl_opts = {
            "outtmpl": output_template,
            "progress_hooks": [hook],
            "quiet": True,
            "noplaylist": True,
            "writesubtitles": subtitles,
            "subtitleslangs": ["en"],
            "postprocessors": [],
        }

        if audio_only:
            ydl_opts["format"] = "bestaudio/best"
            ydl_opts["postprocessors"].append({
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192",
            })
        else:
            ydl_opts["format"] = f"{format_id}/best" if format_id else "best[ext=mp4]/best"

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                final_file = ydl.prepare_filename(info)

            with self.lock:
                self.jobs[job_id]["status"] = "completed"
                self.jobs[job_id]["file"] = final_file
                self.history.insert(0, {"url": url, "title": info.get("title"), "platform": detect_platform(url)})
        except Exception as exc:
            logger.exception("download failed")
            with self.lock:
                self.jobs[job_id]["status"] = "failed"
                self.jobs[job_id]["error"] = humanize_yt_dlp_error(str(exc))

    def get_progress(self) -> list[dict[str, Any]]:
        with self.lock:
            return list(self.jobs.values())

    def get_history(self) -> list[dict[str, Any]]:
        return self.history[:100]
