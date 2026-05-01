export default function URLInput({ url, setUrl, onAnalyze, isAnalyzing, onDrop }) {
  return <div onDrop={onDrop} onDragOver={(e)=>e.preventDefault()} className='p-4 rounded-xl bg-zinc-900 border border-zinc-800'>
    <div className='flex gap-2'>
      <input value={url} onChange={(e)=>setUrl(e.target.value)} placeholder='Paste YouTube/Instagram URL' className='flex-1 px-3 py-2 rounded bg-zinc-800 text-white'/>
      <button onClick={onAnalyze} disabled={isAnalyzing} className='px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2'>
        {isAnalyzing && <span className='h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin' />}
        {isAnalyzing ? 'Analyzing...' : 'Analyze'}
      </button>
    </div></div>
}
