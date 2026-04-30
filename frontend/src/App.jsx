import { useEffect, useState } from 'react';
import { api } from './services/api';
import URLInput from './components/URLInput';
import VideoPreview from './components/VideoPreview';
import FormatSelector from './components/FormatSelector';
import DownloadProgressBar from './components/DownloadProgressBar';
import DownloadList from './components/DownloadList';
import NotificationToast from './components/NotificationToast';

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
      setTimeout(() => setToast(''), 2500);
    }
  };
  const startDownload = async () => {
    try {
      await api.post('/download', { url, format_id: selected, audio_only: audioOnly, subtitles });
    } catch (error) {
      setToast(error?.response?.data?.error || 'Download failed');
      setTimeout(() => setToast(''), 2500);
    }
  };
  const cancel = async (id) => { await api.post('/cancel', { job_id: id }); };

  useEffect(() => {
    const t = setInterval(async () => {
      const [{ data: p }, { data: h }] = await Promise.all([api.get('/progress'), api.get('/history')]);
      setJobs(p); setHistory(h);
      if (p.some((j) => j.status === 'completed')) { setToast('Download completed'); setTimeout(()=>setToast(''), 2000); }
    }, 1500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onPaste = async () => {
      try { const txt = await navigator.clipboard.readText(); if (txt.startsWith('http')) setUrl(txt); } catch {}
    };
    window.addEventListener('focus', onPaste);
    return () => window.removeEventListener('focus', onPaste);
  }, []);

  return <main className='min-h-screen bg-zinc-950 text-white p-6'>
    <div className='max-w-5xl mx-auto space-y-4'>
      <h1 className='text-3xl font-bold'>Downloadly (Local Only)</h1>
      <URLInput url={url} setUrl={setUrl} onAnalyze={analyze} isAnalyzing={analyzing} onDrop={(e)=>{e.preventDefault(); setUrl(e.dataTransfer.getData('text'));}} />
      <VideoPreview info={info} />
      {info && <FormatSelector formats={info.formats} selected={selected} setSelected={setSelected} audioOnly={audioOnly} setAudioOnly={setAudioOnly} subtitles={subtitles} setSubtitles={setSubtitles} />}
      <button onClick={startDownload} onKeyDown={(e)=>e.key==='Enter'&&startDownload()} className='px-5 py-2 rounded bg-emerald-600'>Start Download (Ctrl+Enter)</button>
      <section><h2 className='font-semibold mb-2'>Active Downloads</h2>{jobs.map(j=><DownloadProgressBar key={j.id} job={j} />)}</section>
      <section><h2 className='font-semibold mb-2'>Download Manager</h2><DownloadList jobs={jobs} onCancel={cancel} /></section>
      <section><h2 className='font-semibold mb-2'>History</h2><div className='grid gap-2'>{history.map((h, i)=><button key={i} onClick={()=>setUrl(h.url)} className='text-left p-2 rounded bg-zinc-900 border border-zinc-800'>{h.title} <span className='text-zinc-500 text-xs'>{h.platform}</span></button>)}</div></section>
    </div>
    <NotificationToast toast={toast} />
  </main>
}
