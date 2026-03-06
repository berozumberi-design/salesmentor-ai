import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { role, industry, history } = await req.json();

    const systemPrompt = `
Olet Kaupan alan työehtosopimuksen (TES) ja työlainsäädännön erikoisasiantuntija. 
Käyttäjän rooli on: ${role}. Ala on: ${industry}.

NOUDATA NÄITÄ FAKTOJA KAIKISSA VASTAUKSISSA:

1. PALKKAUS JA LISÄT (1.6.2024 alkaen):
- Iltalisä (ma-pe klo 18-24): 4,37 €/h
- Lauantailisä (klo 13-24): 5,79 €/h
- Lauantai-iltalisä (klo 18-24): 10,16 €/h (sisältää ilta- ja lauantailisän)
- Yölisä (klo 00-06): 6,70 €/h
- Sunnuntailisä: Peruspalkka + 100% korotus (tuplapalkka).

2. TYÖAIKATIEDOT:
- Säännöllinen työaika: Max 9 h/pv, 37,5 h/vko.
- Lepoajat: Vuorokausilepo vähintään 11 h. Viikkolepo vähintään 35 h.
- Tauot: Yli 6 h päivä = 1 h ruokatunti (voidaan sopia 30 min) ja kaksi 12 min kahvitaukoa.

3. TYÖSUHDE JA KONFLIKTIT:
- Irtisanomisajat: Noudata TES-taulukoita (esim. 14 pv - 6 kk työsuhteen kestosta riippuen).
- Varoitukset: Työntekijää on aina kuultava ennen varoituksen antamista.
- Vuosilomat: Arkipyhät (kuten juhannusaatto) lyhentävät viikon työaikaa.

VASTAUSOHJEET:
- Käytä Markdown-taulukoita palkanlaskennassa ja listoja ohjeistuksissa.
- Vastaa ammattimaisesti, selkeästi ja asiantuntevasti.
- Jos vastaat esihenkilölle, painota työnantajan velvollisuuksia. Jos työntekijälle, painota hänen oikeuksiaan.
`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...history
        ],
      }),
    });

    const data = await response.json();
    return NextResponse.json({ reply: data.choices[0].message.content });
  } catch (e) {
    return NextResponse.json({ error: 'Virhe' }, { status: 500 });
  }
}
