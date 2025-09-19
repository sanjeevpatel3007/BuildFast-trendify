import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY as string,
});

export async function POST(request: NextRequest) {
  try {
    
    if (!process.env.FAL_KEY) {
      return NextResponse.json({ 
        error: "FAL_KEY environment variable not set. Please add it to your .env.local file" 
      }, { status: 500 });
    }
    
    const { prompt, imageUrls } = await request.json();
   
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json({ error: "At least one image URL is required" }, { status: 400 });
    }

    let imageUrl = imageUrls[0];
    
    if (imageUrl.startsWith('blob:')) {
      imageUrl = "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_1.png";
    }


    const result = await fal.subscribe("fal-ai/bytedance/seedream/v4/edit", {
      input: {
        prompt,
        image_urls: [imageUrl], 
        image_size: "square_hd", 
        num_images: 1,
        enable_safety_checker: true,
      },
      logs: true,
    });

      const images = result.data.images || [];
    
    return NextResponse.json({
      success: true,
      images: images,
      seed: result.data.seed,
      prompt,
    });
  } catch (error) {
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      status: error instanceof Error && 'status' in error ? (error as { status: unknown }).status : 'Unknown',
      body: error instanceof Error && 'body' in error ? (error as { body: unknown }).body : 'Unknown'
    });
    return NextResponse.json(
      { error: "Failed to generate image", details: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
