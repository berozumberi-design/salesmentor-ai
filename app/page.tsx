'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import { Download, Trash2, Send, Bot, User, ChevronRight } from 'lucide-react';

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
    doc.text(`Tukipalvelu AI - Dokumentti`, 10, 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(splitText, 10, 20);
    doc.save(`tukipalvelu_dokumentti_${index}.pdf`);
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
    <main className="min-h-screen w-full flex flex-col items-center p-2 md:p-6 bg-[#f8fafc]">
      <div className="max-w-5xl w-full flex flex-col h-[95vh] space-y-4">
        
        {/* HEADER */}
        <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-100"><Bot size={22} /></div>
            <div>
              <h1 className="text-lg font-black text-slate-800 tracking-tight leading-none">Tukipalvelu AI</h1>
              <p className="text-blue-600 text-[10px] font-bold uppercase mt-1 tracking-widest">Asiantuntija apunasi</p>
            </div>
          </div>
          <button 
            onClick={() => setChatHistory([])} 
            className="group flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">Tyhjennä</span>
            <Trash2 size={18} />
          </button>
        </header>

        {/* CHAT WINDOW */}
        <div ref={scrollRef} className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-y-auto p-4 md:p-8 space-y-8">
          {chatHistory.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                <Bot size={32} />
              </div>
              <div className="text-center space-y-1">
                <p className="text-slate-500 font-bold uppercase text-[11px] tracking-[0.2em]">Tervetuloa</p>
                <p className="text-slate-400 text-sm">Valitse rooli alta ja kysy mitä tahansa.</p>
              </div>
            </div>
          )}
          
          {chatHistory.map((chat, index) => (
            <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`relative max-w-[90%] md:max-w-[80%] p-6 rounded-[1.5rem] ${
                chat.role === 'user' 
                ? 'bg-slate-800 text-white rounded-tr-none shadow-md' 
                : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[9px] uppercase font-black tracking-widest flex items-center gap-1.5 ${chat.role === 'user' ? 'text-slate-400' : 'text-blue-600'}`}>
                    {chat.role === 'user' ? <User size={12} /> : <Bot size={12} />} {chat.role === 'user' ? 'Käyttäjä' : 'Tukipalvelu'}
                  </span>
                  {chat.role === 'assistant' && (
                    <button 
                      onClick={() => downloadPDF(chat.content, index)}
                      className="bg-white hover:bg-blue-50 text-blue-600 p-2 rounded-xl border border-slate-200 shadow-sm transition-all flex items-center gap-2 text-[10px] font-bold uppercase px-3"
                    >
                      <Download size={14} /> PDF
                    </button>
                  )}
                </div>
                <div className={`prose prose-sm max-w-none ${chat.role === 'user' ? 'prose-invert' : 'prose-slate'} leading-relaxed`}>
                  <ReactMarkdown>{chat.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-1.5 ml-4">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          )}
        </div>

        {/* INPUT AREA */}
        <div className="bg-white p-4 md:p-6 rounded-[2rem] shadow-lg border border-slate-200 space-y-4">
          <div className="flex flex-wrap items-center gap-3 border-b border-slate-50 pb-4">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Sinun roolisi:</span>
            <div className="flex gap-2">
              {roles.map(r => (
                <button 
                  key={r} 
                  onClick={() => setRole(r)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all duration-200 border ${
                    role === r 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100 scale-105' 
                    : 'bg-white text-slate-400 border-slate-200 hover:border-blue-300 hover:text-blue-400'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Kirjoita viestisi tästä... (Shift+Enter rivinvaihtoon)"
              className="w-full min-h-[120px] p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all resize-none shadow-inner"
            />
            <div className="flex justify-end">
              <button 
                onClick={handleSend} 
                disabled={loading || !message.trim()} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black transition-all disabled:opacity-50 flex items-center gap-3 shadow-lg shadow-blue-100 active:scale-95"
              >
                <Send size={18} />
                <span className="uppercase tracking-[0.1em] text-xs">Lähetä viesti</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
