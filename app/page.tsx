'use client';

import { useState } from 'react';

const roles = ['Myyntipäällikkö', 'Key Account Manager', 'SDR', 'Account Executive'];
const industries = ['Ohjelmistot (SaaS)', 'Teollisuus', 'Rahoitus', 'Vähittäiskauppa'];

export default function Home() {
  const [role, setRole] = useState(roles[0]);
  const [industry, setIndustry] = useState(industries[0]);
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    setReply('');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, industry, message }),
      });
      const data = await res.json();
      setReply(data.reply || 'Virhe haettaessa vastausta.');
    } catch (err) {
      setReply('Yhteysvirhe.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-4 md:p-6 font-sans text-slate-900">
      <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('/tausta.jpg')" }} />
      <div className="absolute inset-0 z-10 bg-slate-900/75 backdrop-blur-sm" />

      <div className="relative z-20 w-full max-w-2xl bg-white/95 p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-blue-600 p-2 rounded-lg">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <h1 className="text-xl font-black uppercase tracking-tighter">SalesMentor AI</h1>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1 ml-1">Roolisi</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded-xl text-sm font-semibold bg-white cursor-pointer">
                {roles.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1 ml-1">Toimiala</label>
              <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full p-2 border rounded-xl text-sm font-semibold bg-white cursor-pointer">
                {industries.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1 ml-1">Miten voin auttaa?</label>
            <textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Kirjoita tähän tilanne..."
              className="w-full p-3 border rounded-xl h-24 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button 
            onClick={handleSend} 
            disabled={loading || !message}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 text-sm"
          >
            {loading ? 'Analysoidaan...' : 'Kysy valmentajalta'}
          </button>

          {reply && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500 animate-in fade-in duration-500">
              <p className="text-sm leading-relaxed italic text-slate-700">
                "{reply}"
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
