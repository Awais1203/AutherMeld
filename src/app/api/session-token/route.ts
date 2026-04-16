import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { avatar_id } = await req.json();
    const apiKey = process.env.HEYGEN_API_KEY || "";

    if (!apiKey) {
      return NextResponse.json({ error: "HeyGen API Key is missing" }, { status: 500 });
    }

    const requestBody = {
      mode: "FULL",
      avatar_id: avatar_id || process.env.NEXT_PUBLIC_AVATAR_ID,
      llm_configuration_id: process.env.HEYGEN_LLM_CONFIG_ID,
      avatar_persona: {
        voice_id: process.env.HEYGEN_VOICE_ID || "",
        context_id: process.env.HEYGEN_CONTEXT_ID,
        voice_settings: {
          speed: 1.0,
          stability: 0.8,
          similarity_boost: 0.75
        }
      }
    };

    const res = await fetch("https://api.liveavatar.com/v1/sessions/token", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("LiveAvatar Token Fetch Failed:", res.status, errorData);
      return NextResponse.json({ 
        error: errorData.message || "Failed to retrieve session token" 
      }, { status: res.status });
    }

    const data = await res.json();
    
    if (data.data?.session_token) {
        return NextResponse.json({ 
          session_token: data.data.session_token,
          session_id: data.data.session_id 
        });
    } else {
        return NextResponse.json({ error: "Invalid response from HeyGen" }, { status: 500 });
    }
  } catch (error) {
    console.error("Backend Session Token Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
