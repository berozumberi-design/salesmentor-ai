import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { role, industry, message } = await req.json();
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { 
            role: 'system', 
            content: `Olet Tukipalvelu AI, vähittäiskaupan asiantuntija. 
            Käyttäjän rooli: ${role}. Toimiala: ${industry}. 
            
            OHJEET:
            1. Jos rooli on Esihenkilö: Auta raporteissa, myynnin johtamisessa, työvuoroissa ja rutiineissa.
            2. Jos rooli on Työntekijä: Auta myynnissä, tuotetiedoissa, laskelmissa ja arjen tehtävissä.
            3. Jos rooli on HR: Neuvo TES-asioissa, työtodistuspohjissa ja työaikalaissa.
            
            Vastaa selkeästi, ammattimaisesti ja suomeksi.` 
          },
          { role: 'user', content: message }
        ],
      }),
    });
    const data = await response.json();
    return NextResponse.json({ reply: data.choices[0].message.content });
  } catch (e) {
    return NextResponse.json({ error: 'Virhe' }, { status: 500 });
  }
}
