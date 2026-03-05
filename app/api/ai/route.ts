import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { role, industry, mode, message } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Vastaa aina suomeksi. Olet kokenut myynnin valmentaja.
    Rooli: ${role}, Toimiala: ${industry}, Tila: ${mode}
    Tilanne: ${message}

    Jos tila on "sparraus": Analysoi tilanne ja anna 3 konkreettista vinkkiä.
    Jos tila on "simulaatio": Toimi asiakkaana ja heitä realistinen vastaväite.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return new Response(JSON.stringify({ reply: response.text() }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Gemini-yhteysvirhe" }), { status: 500 });
  }
}
