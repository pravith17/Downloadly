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
