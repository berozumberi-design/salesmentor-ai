import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { role, industry, mode, message } = await req.json();

    const prompt = `
    Vastaa aina suomeksi. Olet kokenut myynnin valmentaja.
    Rooli: ${role}, Toimiala: ${industry}, Tila: ${mode}
    Tilanne: ${message}

    Jos tila on "sparraus": Analysoi tilanne ja anna 3 vinkkiä.
    Jos tila on "simulaatio": Toimi asiakkaana ja heitä vastaväite.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return new Response(JSON.stringify({ reply: response.choices[0].message.content }));
  } catch (error) {
    return new Response(JSON.stringify({ error: "Virhe" }), { status: 500 });
  }
}
