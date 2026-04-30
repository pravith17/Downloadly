export default function DownloadList({ jobs, onCancel }) { return <div className='space-y-2'>{jobs.map(j=><div key={j.id} className='p-3 rounded bg-zinc-900 border border-zinc-800 text-white'>
  <div className='flex justify-between'><span className='text-xs'>{j.url}</span><button onClick={()=>onCancel(j.id)} className='text-red-400'>Cancel</button></div>
</div>)}</div> }
