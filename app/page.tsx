'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

const roles = ['Esihenkilö', 'Työntekijä', 'HR'];
const industries = ['Vähittäiskauppa'];

export default function Home() {
  const [role, setRole] = useState(roles[0]);
  const [industry, setIndustry] = useState(industries[0]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = async () => {
    if (!message.trim() || loading) return;
    setLoading(true);
    
    const newUserMessage = { role: 'user', content: message };
    const updatedHistory = [...chatHistory, newUserMessage];
    setChatHistory(updatedHistory);
    setMessage('');

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, industry, history: updatedHistory }),
      });
      const data = await res.json();
      setChatHistory([...updatedHistory, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error('Virhe');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 text-slate-900 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto flex flex-col h-[90vh] space-y-4">
        
        <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-xl font-black text-blue-800 tracking-tight leading-none">Tukipalvelu AI</h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase mt-1 tracking-widest">Vähittäiskaupan asiantuntija</p>
          </div>
          <button 
            onClick={() => setChatHistory([])} 
            className="text-[10px] bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full font-black text-red-600 uppercase transition-all active:scale-95"
          >
            Tyhjennä
          </button>
        </header>

        <div 
          ref={scrollRef}
          className="flex-1 bg-white rounded-3xl shadow-inner border border-gray-200 overflow-y-auto p-6 space-y-6"
        >
          {chatHistory.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-3 opacity-60 text-center">
              <p className="text-sm font-bold uppercase tracking-widest">Valitse rooli ja kysy jotain</p>
              <p className="text-xs italic">Esim. "Tee työvuorolista" tai "Mitä TES sanoo palkasta?"</p>
            </div>
          )}
          
          {chatHistory.map((chat, index) => (
            <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-5 rounded-3xl shadow-sm ${
                chat.role === 'user' 
                ? 'bg-blue-700 text-white rounded-tr-none' 
                : 'bg-gray-50 text-slate-800 rounded-tl-none border border-gray-100'
              }`}>
                <span className="block text-[9px] uppercase font-black opacity-40 mb-2 tracking-widest">
                  {chat.role === 'user' ? 'Käyttäjä' : 'Tukipalvelu AI'}
                </span>
                <div className="prose prose-sm max-w-none prose-slate prose-p:leading-relaxed">
                  <ReactMarkdown>{chat.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start items-center gap-2 ml-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-xl border border-gray-200 space-y-4">
          <div className="flex flex-wrap gap-2">
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="text-xs font-bold uppercase p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="text-xs font-bold uppercase p-3 bg-gray-100 text-gray-400 border border-gray-200 rounded-xl">
              {industry}
            </div>
          </div>
          <div className="flex gap-2">
            <input 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Kirjoita kysymyksesi..."
              className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"
            />
            <button 
              onClick={handleSend} 
              disabled={loading || !message.trim()}
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 rounded-xl font-black text-sm transition-all disabled:opacity-50 shadow-md"
            >
              LÄHETÄ
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
