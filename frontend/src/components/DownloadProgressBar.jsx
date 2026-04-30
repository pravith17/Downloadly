export default function DownloadProgressBar({ job }) { return <div className='bg-zinc-900 rounded p-3 border border-zinc-800'>
  <div className='flex justify-between text-xs text-zinc-300'><span>{job.status}</span><span>{job.progress}%</span></div>
  <div className='h-2 rounded bg-zinc-700 mt-2'><div className='h-2 rounded bg-emerald-500' style={{width:`${job.progress||0}%`}}></div></div>
</div>; }
