'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { Download, Trash2, Send, Bot, User, FileText, Table, FileCode } from 'lucide-react';

const roles = ['Esihenkilö', 'Työntekijä', 'HR'];

export default function Home() {
  const [role, setRole] = useState(roles[0]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatHistory]);

  // PDF LATAUS
  const downloadPDF = (text: string, index: number) => {
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(text, 180);
    doc.text(splitText, 10, 20);
    doc.save(`dokumentti_${index}.pdf`);
  };

  // EXCEL LATAUS
  const downloadExcel = (text: string, index: number) => {
    const rows = text.split('\n').map(line => [line]);
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `taulukko_${index}.xlsx`);
  };

  // WORD LATAUS
  const downloadWord = (text: string, index: number) => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [new Paragraph({ children: [new TextRun(text)] })],
      }],
    });
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `asiakirja_${index}.docx`);
    });
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
    } catch (err) { console.error('Virhe'); }
    setLoading(false);
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center p-2 md:p-6 bg-[#f8fafc]">
      <div className="max-w-5xl w-full flex flex-col h-[95vh] space-y-4">
        
        <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg"><Bot size={22} /></div>
            <div>
              <h1 className="text-lg font-black text-slate-800 tracking-tight">Tukipalvelu AI</h1>
              <p className="text-blue-600 text-[10px] font-bold uppercase tracking-widest">Asiantuntija apunasi</p>
            </div>
          </div>
          <button onClick={() => setChatHistory([])} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
        </header>

        <div ref={scrollRef} className="flex-1 bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-y-auto p-4 md:p-8 space-y-8">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`relative max-w-[90%] md:max-w-[80%] p-6 rounded-[1.5rem] ${
                chat.role === 'user' ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-50 text-slate-800 border border-slate-100'
              }`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] uppercase font-black tracking-widest opacity-50 flex items-center gap-1.5">
                    {chat.role === 'user' ? <User size={12} /> : <Bot size={12} />} {chat.role === 'user' ? 'Sinä' : 'Tukipalvelu'}
                  </span>
                  {chat.role === 'assistant' && (
                    <div className="flex gap-2">
                      <button onClick={() => downloadPDF(chat.content, index)} className="p-2 bg-white rounded-lg border border-slate-200 hover:text-red-600 shadow-sm transition-all" title="Lataa PDF"><FileText size={14} /></button>
                      <button onClick={() => downloadWord(chat.content, index)} className="p-2 bg-white rounded-lg border border-slate-200 hover:text-blue-600 shadow-sm transition-all" title="Lataa Word"><FileCode size={14} /></button>
                      <button onClick={() => downloadExcel(chat.content, index)} className="p-2 bg-white rounded-lg border border-slate-200 hover:text-green-600 shadow-sm transition-all" title="Lataa Excel"><Table size={14} /></button>
                    </div>
                  )}
                </div>
                <div className="prose prose-sm max-w-none prose-slate">
                  <ReactMarkdown>{chat.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 md:p-6 rounded-[2rem] shadow-lg border border-slate-200 space-y-4">
          <div className="flex gap-2">
            {roles.map(r => (
              <button key={r} onClick={() => setRole(r)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${role === r ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400 border-slate-200'}`}>{r}</button>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <textarea 
              value={message} 
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Kirjoita viestisi tästä..."
              className="w-full min-h-[100px] p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none transition-all shadow-inner"
            />
            <div className="flex justify-end">
              <button onClick={handleSend} disabled={loading || !message.trim()} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100">
                LÄHETÄ
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
