import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Clock, MonitorPlay, Camera, MessageSquare } from 'lucide-react';

const PlatformIcon = ({ platform }) => {
  switch (platform?.toLowerCase()) {
    case 'youtube': return <MonitorPlay className="w-4 h-4 text-red-500" />;
    case 'instagram': return <Camera className="w-4 h-4 text-pink-500" />;
    case 'twitter': return <MessageSquare className="w-4 h-4 text-blue-400" />;
    default: return <PlayCircle className="w-4 h-4 text-zinc-400" />;
  }
};

const formatDuration = (seconds) => {
  if (!seconds) return 'Unknown';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export default function VideoPreview({ info, isAnalyzing }) {
  if (isAnalyzing) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8 glass-card rounded-2xl overflow-hidden animate-pulse">
        <div className="w-full h-64 bg-zinc-800/50"></div>
        <div className="p-6 space-y-4">
          <div className="h-6 bg-zinc-800/50 rounded w-3/4"></div>
          <div className="h-4 bg-zinc-800/50 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (!info) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto mt-8 glass-card rounded-2xl overflow-hidden"
    >
      <div className="relative aspect-video bg-black group">
        <img
          src={info.thumbnail || '/placeholder.jpg'}
          alt="Thumbnail"
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/30 backdrop-blur-sm p-4 rounded-full text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-300">
            <PlayCircle className="w-12 h-12" />
          </div>
        </div>
        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur px-2 py-1 rounded text-xs font-medium flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {formatDuration(info.duration)}
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-semibold text-white line-clamp-2 leading-snug">
          {info.title}
        </h2>
        <div className="mt-3 flex items-center gap-3 text-sm text-zinc-400">
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full">
            <PlatformIcon platform={info.platform} />
            <span className="capitalize">{info.platform}</span>
          </div>
          {info.has_video && <span className="bg-white/5 px-2.5 py-1 rounded-full">Video</span>}
          {info.has_audio && <span className="bg-white/5 px-2.5 py-1 rounded-full">Audio</span>}
        </div>
      </div>
    </motion.div>
  );
}
