import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();
    console.log("Stop API received transcript:", transcript?.substring(0, 100) + "...");
    
    // Here you would typically save to a database or perform cleanup
    
    return NextResponse.json({ success: true, message: "Stop signal received and transcript logged" });
  } catch (error) {
    console.error("Stop Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
