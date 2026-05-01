import React from 'react';
import { Settings, Music, Type, Check, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FormatSelector({ formats, selected, setSelected, audioOnly, setAudioOnly, subtitles, setSubtitles }) {
  if (!formats || formats.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto mt-4 p-6 glass-card rounded-2xl space-y-6"
    >
      <div className="flex items-center gap-2 mb-4 text-white">
        <Settings className="w-5 h-5 text-emerald-500" />
        <h3 className="text-lg font-medium">Download Options</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quality Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-zinc-400">Quality / Format</label>
          <div className="relative">
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              disabled={audioOnly}
              className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all disabled:opacity-50"
            >
              <option value="">Best Available</option>
              {formats.map((f, i) => (
                <option key={i} value={f.format_id}>
                  {f.resolution} {f.ext ? `(${f.ext})` : ''} 
                  {f.filesize ? ` - ${(f.filesize / 1024 / 1024).toFixed(1)}MB` : ''}
                  {f.fps ? ` - ${f.fps}fps` : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-zinc-400">Extra Options</label>
          <div className="flex gap-4">
            <button
              onClick={() => setAudioOnly(!audioOnly)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${
                audioOnly 
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                  : 'bg-black/40 border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Music className="w-4 h-4" />
              <span className="text-sm font-medium">Audio Only</span>
              {audioOnly && <Check className="w-4 h-4 ml-auto" />}
            </button>
            
            <button
              onClick={() => setSubtitles(!subtitles)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all ${
                subtitles 
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                  : 'bg-black/40 border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Type className="w-4 h-4" />
              <span className="text-sm font-medium">Subtitles</span>
              {subtitles && <Check className="w-4 h-4 ml-auto" />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
