'use client';

import { useState } from 'react';

const roles = ['Esihenkilö', 'Työntekijä', 'HR'];
const industries = ['Vähittäiskauppa'];

export default function Home() {
  const [role, setRole] = useState(roles[0]);
  const [industry, setIndustry] = useState(industries[0]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  // TÄMÄ ON UUSI MUISTI-OSA: Tallentaa kaikki viestit listaan
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);

  const handleSend = async () => {
    setLoading(true);
    
    // Lisätään käyttäjän viesti muistiin
    const newUserMessage = { role: 'user', content: message };
    const updatedHistory = [...chatHistory, newUserMessage];
    setChatHistory(updatedHistory);
    setMessage('');

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Lähetetään koko historia tekoälylle
        body: JSON.stringify({ role, industry, history: updatedHistory }),
      });
      const data = await res.json();
      
      // Lisätään tekoälyn vastaus muistiin
      setChatHistory([...updatedHistory, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error('Virhe');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 text-slate-900 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="border-b border-gray-300 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-blue-800 tracking-tight">Tukipalvelu AI</h1>
            <p className="text-gray-600 text-xs font-medium uppercase tracking-wider italic">Vähittäiskaupan asiantuntija</p>
          </div>
          <button onClick={() => setChatHistory([])} className="text-[10px] bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full font-bold text-gray-600 uppercase">Tyhjennä muisti</button>
        </header>

        {/* KESKUSTELUNÄKYMÄ (MUISTI) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-[400px] overflow-y-auto p-4 space-y-4">
          {chatHistory.length === 0 && (
            <div className="h-full flex items-center justify-center text-gray-300 italic text-sm">Aloita keskustelu valitsemalla rooli ja kirjoittamalla viesti...</div>
          )}
          {chatHistory.map((chat, index) => (
            <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${chat.role === 'user' ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-gray-100 text-slate-800'}`}>
                <span className="block text-[9px] uppercase font-black opacity-50 mb-1">{chat.role === 'user' ? 'Sinä' : 'AI'}</span>
                {chat.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-xs text-blue-600 animate-pulse font-bold italic">Tukipalvelu kirjoittaa...</div>}
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 space-y-4">
          <div className="grid grid-cols-2 gap-3">
             <select value={role} onChange={(e) => setRole(e.target.value)} className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold uppercase">{roles.map(r => <option key={r}>{r}</option>)}</select>
             <select disabled className="p-2 bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold uppercase text-gray-400">{industries.map(i => <option key={i}>{i}</option>)}</select>
          </div>

          <div className="flex gap-2">
            <input 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Kirjoita viesti tähän..."
              className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button 
              onClick={handleSend} 
              disabled={loading || !message}
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              Lähetä
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
