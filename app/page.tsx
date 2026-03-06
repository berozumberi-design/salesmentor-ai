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
    <main className="min-h-screen bg-slate-900 text-white p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="border-b border-slate-700 pb-4">
          <h1 className="text-2xl font-bold">SalesMentor AI</h1>
          <p className="text-slate-400 text-sm">Ammattimainen myyntivalmentajasi</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-slate-500">Roolisi</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {roles.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-slate-500">Toimiala</label>
            <select 
              value={industry} 
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {industries.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-slate-500">Miten voin auttaa?</label>
          <textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Esim: Asiakas sanoo että hinta on liian kallis..."
            className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl h-40 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>

        <button 
          onClick={handleSend} 
          disabled={loading || !message}
          className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? 'Valmentaja miettii...' : 'Hae vastaus'}
        </button>

        {reply && (
          <div className="bg-slate-800 p-6 rounded-xl border border-blue-500/30 animate-in fade-in">
            <h3 className="text-blue-400 text-xs uppercase font-black mb-3">Valmentajan neuvo:</h3>
            <p className="text-slate-200 leading-relaxed italic">"{reply}"</p>
          </div>
        )}
      </div>
    </main>
  );
}
