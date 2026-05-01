import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle, FileDown, Clock, Activity } from 'lucide-react';

export default function DownloadProgressBar({ job }) {
  const isComplete = job.status === 'completed';
  const isFailed = job.status === 'failed';
  const isDownloading = job.status === 'downloading';
  
  const formatSpeed = (bytesPerSec) => {
    if (!bytesPerSec) return '0 B/s';
    const mb = bytesPerSec / 1024 / 1024;
    return mb > 1 ? `${mb.toFixed(1)} MB/s` : `${(bytesPerSec / 1024).toFixed(1)} KB/s`;
  };

  const formatEta = (seconds) => {
    if (!seconds) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass-card rounded-xl p-4 mb-3 relative overflow-hidden"
    >
      {/* Background Progress Bar for complete/downloading */}
      {(isDownloading || isComplete) && (
        <div 
          className="absolute inset-0 bg-emerald-500/10 transition-all duration-300 ease-out"
          style={{ width: `${job.progress || 0}%` }}
        />
      )}
      
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isComplete ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : isFailed ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : (
              <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
            )}
            <h4 className="text-sm font-medium text-white truncate max-w-[200px] sm:max-w-[300px]">
              {job.url}
            </h4>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-black/40 border border-white/5">
            {isComplete ? 'Complete' : isFailed ? 'Failed' : `${job.progress}%`}
          </span>
        </div>

        {isDownloading && (
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              {formatSpeed(job.speed)}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {formatEta(job.eta)}
            </div>
          </div>
        )}

        {isFailed && job.error && (
          <p className="text-xs text-red-400 mt-1 line-clamp-2">{job.error}</p>
        )}
      </div>
    </motion.div>
  );
}
