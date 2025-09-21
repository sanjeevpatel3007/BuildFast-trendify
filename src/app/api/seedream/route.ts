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
    
    // Debug: Log the prompt details
    console.log("🔍 Debug - Prompt details:", {
      prompt: prompt,
      promptType: typeof prompt,
      promptLength: prompt?.length || 0,
      isEmpty: !prompt || prompt.trim() === "",
      firstChars: prompt?.substring(0, 50) + "..."
    });
    
    if (!prompt) {
      console.log("❌ No prompt provided");
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json({ error: "At least one image URL is required" }, { status: 400 });
    }

    let imageUrl = imageUrls[0];
    
    // Check if it's a base64 data URI (from uploaded file) or regular URL
    if (imageUrl.startsWith('data:')) {
      console.log("✅ Using uploaded image (base64 data URI)");
      console.log("📏 Image data length:", imageUrl.length);
    } else if (imageUrl.startsWith('blob:')) {
      console.log("🔄 Blob URL detected - using demo image instead");
      imageUrl = "https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_1.png";
    } else {
      console.log("📸 Using provided URL:", imageUrl);
    }


    // Debug: Log what we're sending to Seedream
    const seedreamInput = {
      prompt,
      image_urls: [imageUrl], 
      image_size: "square_hd", 
      num_images: 1,
      enable_safety_checker: true,
    };
    
    console.log("🎯 Sending to Seedream API:", {
      prompt: prompt?.substring(0, 100) + "...",
      promptLength: prompt?.length || 0,
      imageUrl: imageUrl.startsWith('data:') ? `data:image (${imageUrl.length} chars)` : imageUrl,
      imageType: imageUrl.startsWith('data:') ? 'uploaded' : 'demo',
      imageSize: "square_hd",
      numImages: 1
    });

    const result = await fal.subscribe("fal-ai/bytedance/seedream/v4/edit", {
      input: seedreamInput,
      logs: true,
    });

    // Debug: Log the full response
    console.log("🎉 Seedream API Response:", {
      success: true,
      hasData: !!result.data,
      imagesCount: result.data.images?.length || 0,
      seed: result.data.seed,
      fullResponse: result
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
