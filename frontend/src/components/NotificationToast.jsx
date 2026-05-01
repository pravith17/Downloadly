import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

export default function NotificationToast({ toast }) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 shadow-2xl px-6 py-4 rounded-2xl flex items-center gap-3 max-w-sm"
          >
            <Info className="w-5 h-5 text-emerald-400" />
            <p className="text-sm font-medium text-white">{toast}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
