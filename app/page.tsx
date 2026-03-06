'use client';

import { useState } from 'react';

const roles = ['Esihenkilö', 'Työntekijä', 'HR'];
const industries = ['Vähittäiskauppa'];

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
    <main className="min-h-screen bg-gray-100 text-slate-900 p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="border-b border-gray-300 pb-4">
          <h1 className="text-3xl font-black text-blue-800 tracking-tight">Tukipalvelu AI</h1>
          <p className="text-gray-600 font-medium">Älykäs tuki arjen työhön ja johtamiseen</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-gray-500 ml-1">Käyttäjärooli</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-semibold"
            >
              {roles.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-gray-500 ml-1">Toimiala</label>
            <select 
              value={industry} 
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-500 cursor-not-allowed font-semibold"
              disabled
            >
              {industries.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-gray-500 ml-1">Miten voimme auttaa?</label>
          <textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Kirjoita kysymyksesi (esim. työvuorosuunnittelu, TES-asiat, myynnin tuki tai kustannuslaskenta)..."
            className="w-full p-4 bg-white border border-gray-300 rounded-2xl h-44 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>

        <button 
          onClick={handleSend} 
          disabled={loading || !message}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-2xl font-black shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-wide"
        >
          {loading ? 'Käsitellään pyyntöä...' : 'Lähetä kysymys'}
        </button>

        {reply && (
          <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-xl animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <h3 className="text-blue-800 text-xs uppercase font-black tracking-widest">Tukipalvelun vastaus:</h3>
            </div>
            <p className="text-gray-800 leading-relaxed font-medium whitespace-pre-wrap">{reply}</p>
          </div>
        )}
      </div>
      
      <footer className="mt-12 text-center text-gray-400 text-[10px] uppercase tracking-widest font-bold">
        Tukipalvelu AI &copy; 2024 | Vähittäiskaupan asiantuntijajärjestelmä
      </footer>
    </main>
  );
}
