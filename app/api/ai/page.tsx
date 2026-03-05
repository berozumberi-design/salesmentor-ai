'use client';

import { useState } from 'react';

const roles = ['Myyntipäällikkö', 'Key Account Manager', 'SDR', 'Account Executive'];
const industries = ['Ohjelmistot (SaaS)', 'Teollisuus', 'Rahoitus', 'Vähittäiskauppa'];
const modes = ['Sparraus', 'Vastaväitteiden käsittely', 'Tarjouksen läpikäynti'];

export default function Home() {
  const [role, setRole] = useState(roles[0]);
  const [industry, setIndustry] = useState(industries[0]);
  const [mode, setMode] = useState(modes[0]);
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
        body: JSON.stringify({ role, industry, mode, message }),
      });
      const data = await res.json();
      setReply(data.reply || 'Virhe haettaessa vastausta.');
    } catch (err) {
      setReply('Yhteysvirhe.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* TAUSTAKUVA */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700" 
        style={{ backgroundImage: "url('/tausta.jpg')" }} 
      />
      {/* TUMMA KERROS */}
      <div className="absolute inset-0 z-10 bg-slate-900/75 backdrop-blur-[2px]" />

      <div className="relative z-20 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* LOMAKE */}
        <div className="bg-white/95 p-8 rounded-2xl shadow-2xl flex flex-col border border-white/20">
            <div className="flex items-center gap-3 mb-6 font-sans">
                <div className="bg-blue-600 p-2 rounded-lg text-white font-bold text-xl italic">SM</div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">SalesMentor AI</h1>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-slate-900">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Roolisi</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    {roles.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Toimiala</label>
                  <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    {industries.map(i => <option key={i}>{i}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mihin tarvitset apua?</label>
                <textarea 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="Esim: Asiakas sanoi että hinta on liian kallis..."
                  className="w-full p-4 border border-slate-200 rounded-xl text-slate-900 h-40 resize-none shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button 
                onClick={handleSend} 
                disabled={loading || !message}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Analysoidaan...' : 'Kysy valmentajalta'}
              </button>
            </div>
        </div>

        {/* VASTAUS */}
        <div className="flex flex-col h-full min-h-[400px]">
          {reply ? (
            <div className="bg-slate-900/85 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-blue-500/30 h-full overflow-y-auto">
              <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <h3 className="font-bold text-emerald-400 uppercase tracking-widest text-xs">Valmentajan analyysi</h3>
              </div>
              <p className="text-blue-50 whitespace-pre-wrap leading-relaxed font-light italic">"{reply}"</p>
            </div>
          ) : (
            <div className="bg-white/5 border-2 border-dashed border-white/20 rounded-2xl h-full flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm">
              <p className="text-white/60 font-medium italic">Valmentaja odottaa kysymystäsi...</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
