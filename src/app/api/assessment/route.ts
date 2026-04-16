import { NextRequest, NextResponse } from "next/server";
import { PERSONALITY_SYSTEM_PROMPT } from "@/lib/personality";

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API Key is missing" }, { status: 500 });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // Using a strong model for assessment
        messages: [
          { role: "system", content: PERSONALITY_SYSTEM_PROMPT },
          { role: "user", content: `Analyze the following transcript and provide the personality assessment:\n\n${transcript}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      return NextResponse.json({ error: "Failed to generate assessment" }, { status: response.status });
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Assessment Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
