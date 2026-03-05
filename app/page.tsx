"use client";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("sparraus");

  async function handleSubmit() {
    if (!message) return;
    setLoading(true);
    setResponse(""); // Tyhjennetään vanha vastaus
    
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "Myyjä",
          industry: "Yleinen",
          mode,
          message,
        }),
      });

      const data = await res.json();
      setResponse(data.reply);
    } catch (err) {
      setResponse("Hups! Jotain meni pieleen. Tarkista Vercelin asetukset.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>SalesMentor AI 🇫🇮</h1>
      <p>Kuvaile myyntitilannetta ja pyydä apua:</p>

      <div style={{ marginBottom: "20px" }}>
        <select 
          value={mode} 
          onChange={(e) => setMode(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px", fontSize: "16px" }}
        >
          <option value="sparraus">💡 Sparraus (Analyysi & vinkit)</option>
          <option value="simulaatio">🤝 Simulaatio (Roolipeli asiakkaan kanssa)</option>
        </select>
      </div>

      <textarea
        placeholder="Esim: Asiakas sanoi, että meidän hinta on liian kallis. Miten vastaisin tähän?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%", height: "150px", padding: "15px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "16px" }}
      />

      <button 
        onClick={handleSubmit} 
        disabled={loading}
        style={{ 
          marginTop: "20px", 
          padding: "12px 24px", 
          backgroundColor: loading ? "#ccc" : "#0070f3", 
          color: "white", 
          border: "none", 
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold"
        }}
      >
        {loading ? "Valmentaja miettii..." : "Lähetä viesti"}
      </button>

      {response && (
        <div style={{ 
          marginTop: "40px", 
          padding: "20px", 
          backgroundColor: "#f9f9f9", 
          borderRadius: "8px", 
          border: "1px solid #eee",
          whiteSpace: "pre-wrap",
          lineHeight: "1.6"
        }}>
          <strong>Valmentajan vastaus:</strong><br /><br />
          {response}
        </div>
      )}
    </main>
  );
}
