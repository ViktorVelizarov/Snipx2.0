import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const ResultFormat = z.object({
  green: z.array(z.string()),
  orange: z.array(z.string()),
  red: z.array(z.string()),
});

export async function POST(req) {
  const { text } = await req.json();

  try {
    const promptText = `Summarize the following daily report into a concise analysis for a manager. Highlight the main pain points and successes, using the indicators 🟢 for positive points, 🟠 for neutral points and 🔴 for negative points. Organize the summary by key areas, and ensure each sentence begins with the appropriate indicator. Focus on providing actionable insights and overall progress. The concise analysis can not be longer than 5 bullet points and each bullet point is also concise, short and clear. Return the result in the given JSON format: "${text}"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: promptText }],
      response_format: zodResponseFormat(ResultFormat, "result_format"),
    });

    const result = completion.choices[0].message.content;
    console.log("result:")
    console.log(result)


    return new Response(result, {
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
