export default function VideoPreview({ info }) { if(!info) return null; return <div className='p-4 rounded-xl bg-zinc-900 border border-zinc-800'>
  <img src={info.thumbnail} className='w-full max-h-64 object-cover rounded'/><h2 className='text-white mt-2 font-semibold'>{info.title}</h2><p className='text-zinc-400 text-sm'>{info.platform} · {info.duration}s</p>
</div> }
