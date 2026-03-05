import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { role, industry, mode, message } = await req.json();

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Olet asiantunteva myyntivalmentaja. Vastaa aina suomeksi. 
          Käyttäjän rooli: ${role}. Toimiala: ${industry}. Tila: ${mode}.`
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const reply = chatCompletion.choices[0]?.message?.content || "Ei vastausta.";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Groq Error:", error);
    return new Response(JSON.stringify({ error: "Yhteysvirhe tekoälyyn" }), { 
      status: 500 
    });
  }
}
