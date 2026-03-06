import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { role, industry, history } = await req.json(); // Otetaan vastaan historia
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: `Olet Tukipalvelu AI, vähittäiskaupan asiantuntija. Käyttäjän rooli: ${role}.` },
          ...history // TÄMÄ ON TÄRKEÄ: Se liittää koko aiemman keskustelun mukaan!
        ],
      }),
    });
    const data = await response.json();
    return NextResponse.json({ reply: data.choices[0].message.content });
  } catch (e) {
    return NextResponse.json({ error: 'Virhe' }, { status: 500 });
  }
}
