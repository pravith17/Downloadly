from __future__ import annotations

import logging
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS

from downloader import DownloadManager
from utils import humanize_yt_dlp_error, is_valid_url

logging.basicConfig(level=logging.INFO)

BASE_DIR = Path(__file__).resolve().parent
DOWNLOAD_DIR = BASE_DIR / "downloads"

app = Flask(__name__)
CORS(app)
manager = DownloadManager(str(DOWNLOAD_DIR))


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/analyze")
def analyze():
    url = request.args.get("url", "").strip()
    if not is_valid_url(url):
        return jsonify({"error": "Invalid URL"}), 400
    try:
        return jsonify(manager.analyze(url))
    except Exception as exc:
        return jsonify({"error": humanize_yt_dlp_error(str(exc))}), 500


@app.post("/download")
def download():
    payload = request.get_json(force=True)
    url = payload.get("url", "").strip()
    if not is_valid_url(url):
        return jsonify({"error": "Invalid URL"}), 400

    job_id = manager.start_download(
        url=url,
        format_id=payload.get("format_id"),
        audio_only=bool(payload.get("audio_only")),
        filename=payload.get("filename"),
        subtitles=bool(payload.get("subtitles")),
    )
    return jsonify({"job_id": job_id})


@app.post("/cancel")
def cancel():
    job_id = request.get_json(force=True).get("job_id")
    if not job_id:
        return jsonify({"error": "job_id required"}), 400
    if manager.cancel(job_id):
        return jsonify({"message": "cancelled"})
    return jsonify({"error": "job not found"}), 404


@app.get("/progress")
def progress():
    return jsonify(manager.get_progress())


@app.get("/downloads")
def downloads():
    files = []
    for path in DOWNLOAD_DIR.rglob("*"):
        if path.is_file():
            files.append({"name": path.name, "path": str(path), "size": path.stat().st_size})
    return jsonify(files)


@app.delete("/delete")
def delete_file():
    path = request.args.get("path")
    if not path:
        return jsonify({"error": "path required"}), 400
    target = Path(path)
    if not target.exists() or not target.is_file():
        return jsonify({"error": "file not found"}), 404
    target.unlink()
    return jsonify({"message": "deleted"})


@app.get("/history")
def history():
    return jsonify(manager.get_history())


if __name__ == "__main__":
    app.run(debug=True, port=5000)
