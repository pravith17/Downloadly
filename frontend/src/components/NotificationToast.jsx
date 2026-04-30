export default function NotificationToast({ toast }) { if(!toast) return null; return <div className='fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg'>{toast}</div>; }
