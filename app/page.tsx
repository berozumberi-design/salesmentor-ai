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
      setReply('Yhteysvirhe. Tarkista verkkoyhteys.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-4 md:p-10 overflow-hidden font-sans">
      
      {/* TAUSTAKUVA JA KERROKSET */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700" 
        style={{ backgroundImage: "url('/tausta.jpg')" }} 
      />
      <div className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-sm" />

      <div className="relative z-20 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
        
        {/* VASEN PUOLI: SYÖTTEET */}
        <div className="lg:col-span-2 bg-white/95 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col border border-white/20">
          <div className="flex items-center gap-3 mb-8">
              <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">SalesMentor AI</h1>
          </div>
          
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1.5 ml-1">Sinun Roolisi</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-3.5 border-2 border-slate-100 rounded-2xl text-slate-900 bg-slate-50 font-bold focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer">
                  {roles.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1.5 ml-1">Asiakkaan Toimiala</label>
                <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full p-3.5 border-2 border-slate-100 rounded-2xl text-slate-900 bg-slate-50 font-bold focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer">
                  {industries.map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1.5 ml-1">Kuvaile tilanne</label>
              <textarea 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Esim: Asiakas sanoo, että budjetti on jo käytetty tälle vuodelle..."
                className="w-full p-5 border-2 border-slate-100 rounded-2xl text-slate-900 bg-slate-50 h-48 resize-none font-medium focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <button 
              onClick={handleSend} 
              disabled={loading || !message}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-[0.97] disabled:opacity-50 disabled:grayscale uppercase tracking-wider"
            >
              {loading ? (
                  <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generoidaan vastausta...
                  </span>
              ) : 'Hae myyntivinkit'}
            </button>
          </div>
        </div>

        {/* OIKEA PUOLI: VASTAUS */}
        <div className="lg:col-span-3 flex flex-col h-full min-h-[500px]">
          {reply ? (
            <div className="bg-slate-900/60 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-white/10 h-full overflow-y-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-6">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_15px_rgba(52,211,153,0.5)]"></div>
                <h3 className="font-black text-emerald-400 uppercase tracking-[0.2em] text-xs">Valmentajan analyysi ja suositus</h3>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-blue-50 text-xl md:text-2xl whitespace-pre-wrap leading-relaxed font-light italic tracking-tight">
                  "{reply}"
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-3xl h-full flex flex-col items-center justify-center p-12 text-center backdrop-blur-sm group transition-all">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
                </svg>
              </div>
              <h2 className="text-white/40 font-black uppercase tracking-widest text-sm mb-2">Valmiina sparraamaan</h2>
              <p className="text-white/20 font-medium max-w-xs leading-relaxed">
                Valitse roolisi ja kerro tilanteesta, niin saat välittömästi ammattitason myyntivinkkejä.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <footer className="relative z-20 mt-10 text-white/20 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-4">
        <span>© 2024 SalesMentor AI</span>
        <span className="w-1 h-1 bg-white/20 rounded-full"></span>
        <span>Powered by Groq LLama 3.3</span>
      </footer>
    </main>
  );
}
