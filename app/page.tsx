'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import { Download, Trash2, Send, Bot, User } from 'lucide-react';

const roles = ['Esihenkilö', 'Työntekijä', 'HR'];

export default function Home() {
  const [role, setRole] = useState(roles[0]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const downloadPDF = (text: string, index: number) => {
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(text, 180);
    doc.setFont("helvetica", "bold");
    doc.text(`Tukipalvelu AI - Dokumentti ${index}`, 10, 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(splitText, 10, 20);
    doc.save(`dokumentti_${index}.pdf`);
  };

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
        body: JSON.stringify({ role, industry: 'Vähittäiskauppa', history: updatedHistory }),
      });
      const data = await res.json();
      setChatHistory([...updatedHistory, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error('Virhe');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center p-4 md:p-8" style={{ backgroundColor: '#f3f4f6' }}>
      <div className="max-w-4xl w-full flex flex-col h-[90vh] space-y-4">
        
        <header className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white"><Bot size={20} /></div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">Tukipalvelu AI</h1>
              <p className="text-blue-600 text-[10px] font-bold uppercase mt-1 tracking-widest">Vähittäiskaupan asiantuntija</p>
            </div>
          </div>
          <button onClick={() => setChatHistory([])} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
        </header>

        <div ref={scrollRef} className="flex-1 bg-white rounded-3xl shadow-inner border border-gray-200 overflow-y-auto p-6 space-y-6">
          {chatHistory.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3 opacity-60">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Valitse rooli ja aloita keskustelu</p>
            </div>
          )}
          
          {chatHistory.map((chat, index) => (
            <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`relative max-w-[85%] p-5 rounded-3xl ${
                chat.role === 'user' 
                ? 'bg-blue-700 text-white rounded-tr-none' 
                : 'bg-gray-50 text-slate-800 rounded-tl-none border border-gray-100 shadow-sm'
              }`}>
                <div className="flex justify-between items-start mb-2 gap-4">
                  <span className="text-[9px] uppercase font-black opacity-50 tracking-widest flex items-center gap-1">
                    {chat.role === 'user' ? <User size={10} /> : <Bot size={10} />} {chat.role === 'user' ? 'Sinä' : 'Tukipalvelu'}
                  </span>
                  {chat.role === 'assistant' && (
                    <button 
                      onClick={() => downloadPDF(chat.content, index)}
                      className="bg-white/80 hover:bg-white text-blue-700 p-1.5 rounded-lg border border-blue-100 shadow-sm transition-all"
                      title="Lataa PDF"
                    >
                      <Download size={14} />
                    </button>
                  )}
                </div>
                <div className="prose prose-sm max-w-none prose-slate prose-p:leading-relaxed">
                  <ReactMarkdown>{chat.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {loading && <div className="ml-2 flex gap-1"><div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div></div>}
        </div>

        <div className="bg-white p-4 rounded-3xl shadow-xl border border-gray-200 space-y-4">
          <div className="flex gap-2 items-center px-1">
            <span className="text-[10px] font-black uppercase text-gray-400">Rooli:</span>
            {roles.map(r => (
              <button 
                key={r} 
                onClick={() => setRole(r)}
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${role === r ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Kirjoita kysymyksesi..."
              className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button onClick={handleSend} disabled={loading || !message.trim()} className="bg-blue-700 hover:bg-blue-800 text-white px-6 rounded-2xl font-black transition-all disabled:opacity-50 flex items-center gap-2 tracking-widest text-xs">
              <Send size={16} /> LÄHETÄ
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
