export default function FormatSelector({ formats, selected, setSelected, audioOnly, setAudioOnly, subtitles, setSubtitles }) {
  return <div className='p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3'>
    <div className='flex gap-4 text-white text-sm'>
      <label><input type='checkbox' checked={audioOnly} onChange={e=>setAudioOnly(e.target.checked)}/> Audio only (MP3)</label>
      <label><input type='checkbox' checked={subtitles} onChange={e=>setSubtitles(e.target.checked)}/> Subtitles</label>
    </div>
    <select value={selected || ''} onChange={e=>setSelected(e.target.value)} className='w-full bg-zinc-800 text-white p-2 rounded'>
      {formats?.map(f=><option key={f.format_id} value={f.format_id}>{f.format_id} | {f.ext} | {f.resolution} | {f.filesize || 'unknown'}</option>)}
    </select>
  </div>
}
