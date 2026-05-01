import React from 'react';
import { X, Check, FolderDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DownloadList({ jobs, onCancel }) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-zinc-500">
        <FolderDown className="w-12 h-12 mb-3 opacity-20" />
        <p>No active downloads</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {jobs.map((job) => (
          <motion.div 
            key={job.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center justify-between p-4 glass-card rounded-xl group"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                job.status === 'completed' ? 'bg-emerald-500' :
                job.status === 'failed' ? 'bg-red-500' : 'bg-blue-500 animate-pulse'
              }`} />
              <span className="text-sm text-zinc-300 truncate">{job.url}</span>
            </div>
            
            <div className="flex items-center gap-4 pl-4 border-l border-white/5">
              <span className="text-xs font-mono text-zinc-500 w-12 text-right">
                {job.progress}%
              </span>
              
              {job.status !== 'completed' && job.status !== 'failed' && (
                <button 
                  onClick={() => onCancel(job.id)}
                  className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  title="Cancel Download"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
