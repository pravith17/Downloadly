from __future__ import annotations

import os
import re
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

SUPPORTED_PLATFORMS = {
    "youtube": ["youtube.com", "youtu.be"],
    "instagram": ["instagram.com"],
    "tiktok": ["tiktok.com"],
    "twitter": ["twitter.com", "x.com"],
}


def is_valid_url(url: str) -> bool:
    try:
        parsed = urlparse(url)
        return bool(parsed.scheme in {"http", "https"} and parsed.netloc)
    except Exception:
        return False


def detect_platform(url: str) -> str:
    host = urlparse(url).netloc.lower()
    for platform, domains in SUPPORTED_PLATFORMS.items():
        if any(domain in host for domain in domains):
            return platform
    return "unknown"


def sanitize_filename(name: str) -> str:
    name = re.sub(r'[<>:"/\\|?*]+', "_", name)
    return name.strip()[:180] or "download"


def build_download_path(base_dir: str | Path, platform: str) -> Path:
    date_str = datetime.now().strftime("%Y-%m-%d")
    target = Path(base_dir) / platform / date_str
    target.mkdir(parents=True, exist_ok=True)
    return target


def ensure_ffmpeg_in_path() -> bool:
    for p in os.environ.get("PATH", "").split(os.pathsep):
        ffmpeg = Path(p) / ("ffmpeg.exe" if os.name == "nt" else "ffmpeg")
        if ffmpeg.exists():
            return True
    return False


def humanize_yt_dlp_error(error_message: str) -> str:
    """Return actionable guidance for common yt-dlp failures."""
    if not error_message:
        return "Unknown yt-dlp error"

    lowered = error_message.lower()
    if "sign in to confirm you're not a bot" in lowered:
        return (
            "YouTube blocked this request and requires authenticated cookies. "
            "Make sure your Chrome/Safari browser is logged into YouTube."
        )
    if "login" in lowered and "instagram" in lowered:
        return "Instagram requires login. Make sure your browser (Chrome/Safari) is logged into Instagram."
    if "video unavailable" in lowered:
        return "Video is unavailable or private."
    if "extractorerror" in lowered:
        return "Failed to analyze video. You may need to provide cookies or update yt-dlp."

    return error_message
