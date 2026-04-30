export default function URLInput({ url, setUrl, onAnalyze, onDrop }) {
  return <div onDrop={onDrop} onDragOver={(e)=>e.preventDefault()} className='p-4 rounded-xl bg-zinc-900 border border-zinc-800'>
    <div className='flex gap-2'>
      <input value={url} onChange={(e)=>setUrl(e.target.value)} placeholder='Paste YouTube/Instagram URL' className='flex-1 px-3 py-2 rounded bg-zinc-800 text-white'/>
      <button onClick={onAnalyze} className='px-4 py-2 rounded bg-indigo-600 text-white'>Analyze</button>
    </div></div>
}
