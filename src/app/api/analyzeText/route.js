import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "sk-rB7ji0oYrLopk4K32U8FHKX23DS2EA1o4Q2PIWthD2T3BlbkFJiIu-n6XrsFFhCNgRPBPkp5sF0A1GbU5L8CiDeS-GQA",
});

export async function POST(req) {
  const { text } = await req.json();

  try {
    const promptText = `Summarize the following daily report into a concise analysis for a manager. Highlight the main pain points and successes, using the indicators 🟢 for positive points, 🟠 for neutral points and 🔴 for negative points. Organize the summary by key areas, and ensure each sentence begins with the appropriate indicator. Focus on providing actionable insights and overall progress. The concise analysis can not be longer than 6 bullet points.: "${text}"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: promptText }],

    });

    const result = completion.choices[0].message.content;
    console.log(result)


    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(JSON.stringify({ error: "Failed to analyze text" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export const GET = () => new Response(null, { status: 405 });
