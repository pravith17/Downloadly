import { useEffect, useState, useRef } from 'react';
import { api } from './services/api';
import URLInput from './components/URLInput';
import VideoPreview from './components/VideoPreview';
import FormatSelector from './components/FormatSelector';
import DownloadProgressBar from './components/DownloadProgressBar';
import DownloadList from './components/DownloadList';
import NotificationToast from './components/NotificationToast';
import { DownloadCloud, Sparkles, Activity, Clock, FolderDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function App() {
  const [url, setUrl] = useState('');
  const [info, setInfo] = useState(null);
  const [selected, setSelected] = useState('');
  const [audioOnly, setAudioOnly] = useState(false);
  const [subtitles, setSubtitles] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const prevCompletedRef = useRef(new Set());

  // Mouse tracking for background
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize between -1 and 1
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const analyze = async () => {
    if (!url.trim()) return;
    setAnalyzing(true);
    try {
      const { data } = await api.get('/analyze', { params: { url } });
      setInfo(data);
      setSelected(data.recommended_format_id || '');
    } catch (error) {
      setToast(error?.response?.data?.error || 'Analyze failed');
      setInfo(null);
    } finally {
      setAnalyzing(false);
      setTimeout(() => setToast(''), 4000);
    }
  };

  const startDownload = async () => {
    try {
      await api.post('/download', { url, format_id: selected, audio_only: audioOnly, subtitles });
      setToast('Download started');
      setUrl('');
      setInfo(null);
      setTimeout(() => setToast(''), 3000);
    } catch (error) {
      setToast(error?.response?.data?.error || 'Download failed');
      setTimeout(() => setToast(''), 4000);
    }
  };

  const cancel = async (id) => { 
    await api.post('/cancel', { job_id: id }); 
    setToast('Download cancelled');
    setTimeout(() => setToast(''), 3000);
  };

  useEffect(() => {
    const t = setInterval(async () => {
      const [{ data: p }, { data: h }] = await Promise.all([api.get('/progress'), api.get('/history')]);
      setJobs(p); setHistory(h);
      
      // Check for newly completed jobs to trigger confetti
      const currentlyCompleted = new Set(p.filter(j => j.status === 'completed').map(j => j.id));
      currentlyCompleted.forEach(id => {
        if (!prevCompletedRef.current.has(id)) {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#34d399', '#059669', '#10b981', '#ffffff']
          });
          setToast('Download ready! 🎉');
          setTimeout(() => setToast(''), 3000);
        }
      });
      prevCompletedRef.current = currentlyCompleted;
    }, 1500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onPaste = async () => {
      try { 
        const txt = await navigator.clipboard.readText(); 
        if (txt.startsWith('http') && !url) setUrl(txt); 
      } catch {}
    };
    window.addEventListener('focus', onPaste);
    return () => window.removeEventListener('focus', onPaste);
  }, [url]);

  return (
    <main className="min-h-screen relative overflow-x-hidden selection:bg-emerald-500/30">
      {/* Dynamic Interactive Background */}
      <div className="fixed inset-0 -z-10 bg-zinc-950 overflow-hidden pointer-events-none">
        <motion.div 
          style={{ x: useSpring(useMotionValue(0), {stiffness: 50}), y: useSpring(useMotionValue(0), {stiffness: 50}) /* using simple motion values */ }}
          className="absolute inset-0"
        >
          <motion.div 
            style={{ x: springX, y: springY }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px] mix-blend-screen animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] rounded-full bg-teal-600/20 blur-[120px] mix-blend-screen animate-blob" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-cyan-900/20 blur-[120px] mix-blend-screen animate-blob" style={{ animationDelay: '4s' }}></div>
          </motion.div>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20 animate-fade-in">
        {/* Header */}
        <header className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-2 border border-emerald-500/20">
            <DownloadCloud className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white text-glow flex items-center gap-3">
            Downloadly
            <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            The ultimate media downloader. Paste a link from YouTube, Instagram, or Twitter and grab it instantly in the highest quality.
          </p>
        </header>

        {/* Hero Section */}
        <div className="w-full relative z-10 mb-12">
          <URLInput 
            url={url} 
            setUrl={setUrl} 
            onAnalyze={analyze} 
            isAnalyzing={analyzing} 
            onDrop={(e) => { e.preventDefault(); setUrl(e.dataTransfer.getData('text')); }} 
          />
          <VideoPreview info={info} isAnalyzing={analyzing} />
          
          {info && (
            <div className="animate-slide-up mt-6 flex flex-col items-center gap-6">
              <FormatSelector 
                formats={info.formats} 
                selected={selected} 
                setSelected={setSelected} 
                audioOnly={audioOnly} 
                setAudioOnly={setAudioOnly} 
                subtitles={subtitles} 
                setSubtitles={setSubtitles} 
              />
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0px 0px 30px rgba(52, 211, 153, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={startDownload} 
                className="group relative px-8 py-4 bg-white text-zinc-950 rounded-2xl font-semibold text-lg overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-2 group-hover:text-white transition-colors">
                  <DownloadCloud className="w-5 h-5" />
                  Start Download
                </span>
              </motion.button>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-24">
          
          {/* Left Column - Active Downloads */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Active Transfers
            </h2>
            <div className="space-y-3">
              {jobs.filter(j => j.status === 'downloading').map(j => (
                <DownloadProgressBar key={j.id} job={j} />
              ))}
            </div>
            
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 mt-8">
              <FolderDown className="w-5 h-5 text-zinc-400" />
              Recent Jobs
            </h2>
            <DownloadList jobs={jobs} onCancel={cancel} />
          </div>

          {/* Right Column - History Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-zinc-400" />
              History
            </h2>
            <div className="glass-card rounded-2xl p-4 max-h-[500px] overflow-y-auto pr-2">
              {history.length === 0 ? (
                <p className="text-sm text-zinc-500 text-center py-8">No history yet</p>
              ) : (
                <div className="space-y-2">
                  {history.map((h, i) => (
                    <button 
                      key={i} 
                      onClick={() => setUrl(h.url)} 
                      className="w-full text-left p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-transparent hover:border-white/10 transition-all group"
                    >
                      <h4 className="text-sm font-medium text-zinc-300 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                        {h.title}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1 capitalize">{h.platform}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
      
      <NotificationToast toast={toast} />
    </main>
  );
}
