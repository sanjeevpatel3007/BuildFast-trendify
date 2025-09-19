import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY as string,
});

export async function GET() {
  try {
    console.log("🧪 Testing FAL connection...");
    console.log("FAL_KEY exists:", !!process.env.FAL_KEY);
    
    if (!process.env.FAL_KEY) {
      return NextResponse.json({ 
        ok: false, 
        error: "FAL_KEY environment variable not set. Please add it to your .env.local file" 
      }, { status: 400 });
    }

    // Test with a simple model first
    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: "a simple test image",
        image_size: "square_hd",
        num_inference_steps: 1,
      },
    });

    return NextResponse.json({ 
      ok: true, 
      message: "FAL connection successful!",
      hasResult: !!result.data
    });
  } catch (err: unknown) {
    console.error("FAL Test Error:", err);
    return NextResponse.json({ 
      ok: false, 
      error: err instanceof Error ? err.message : 'Unknown error',
      details: err instanceof Error ? err.toString() : String(err)
    }, { status: 500 });
  }
}
