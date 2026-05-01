import React from 'react';
import { Search, Loader2, Link2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function URLInput({ url, setUrl, onAnalyze, isAnalyzing, onDrop }) {
  return (
    <div className="w-full max-w-3xl mx-auto" onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
        
        <div className="relative flex items-center bg-zinc-900 border border-white/10 rounded-2xl p-2 shadow-2xl transition-all focus-within:border-emerald-500/50">
          <div className="pl-4 text-zinc-400">
            <Link2 className="w-6 h-6" />
          </div>
          
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onAnalyze()}
            placeholder="Paste YouTube, Instagram, or Twitter link here..."
            className="w-full bg-transparent border-none text-white px-4 py-3 outline-none placeholder:text-zinc-500 text-lg"
            autoComplete="off"
            autoFocus
          />
          
          <AnimatePresence>
            {url && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setUrl('')}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={onAnalyze}
            disabled={isAnalyzing || !url}
            className="ml-2 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span>Analyze</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
