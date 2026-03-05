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
      setReply(data.reply || 'Virhe.');
    } catch (err) {
      setReply('Yhteysvirhe.');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('/tausta.jpg')" }} />
      <div className="absolute inset-0 z-10 bg-slate-900/70 backdrop-blur-sm" />
      <div className="relative z-20 w-full max-w-4xl bg-white/95 p-8 rounded-2xl shadow-2xl text-slate-900">
        <h1 className="text-3xl font-black mb-6 uppercase tracking-tighter">SalesMentor AI</h1>
        <div className="space-y-4">
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-3 border rounded-xl">{roles.map(r => <option key={r}>{r}</option>)}</select>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full p-3 border rounded-xl">{industries.map(i => <option key={i}>{i}</option>)}</select>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Mihin tarvitset apua?" className="w-full p-4 border rounded-xl h-32" />
          <button onClick={handleSend} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg">{loading ? 'Analysoidaan...' : 'Kysy valmentajalta'}</button>
          {reply && <div className="mt-6 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500 font-light italic italic">"{reply}"</div>}
        </div>
      </div>
    </main>
  );
}
