import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

export async function POST(request: NextRequest) {
  try {
    const { image, prompt, apiKey } = await request.json()
    
    // Validate inputs
    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 })
    }
    
    if (!prompt) {
      return NextResponse.json({ error: "Text prompt is required" }, { status: 400 })
    }
    
    // Use API key from request body if provided, otherwise fall back to environment variable
    const googleApiKey = apiKey || process.env.GOOGLE_API_KEY
    
    if (!googleApiKey) {
      return NextResponse.json({ 
        error: "Google API key not configured. Please provide an API key or set GOOGLE_API_KEY environment variable." 
      }, { status: 500 })
    }

    // Initialize Google GenAI
    const ai = new GoogleGenAI({ apiKey: googleApiKey })

    // Prepare the prompt parts array
    const promptParts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
      { text: prompt }
    ]

    // Process the input image
    if (image && image.startsWith('data:')) {
      const [header, base64Data] = image.split(',')
      const mimeType = header.split(':')[1].split(';')[0]
      
      // Supported MIME types for Gemini models
      const supportedMimeTypes = [
        'image/png',
        'image/jpeg', 
        'image/jpg',
        'image/webp',
        'image/heic',
        'image/heif'
      ]
      
      // Check if MIME type is supported
      if (supportedMimeTypes.includes(mimeType)) {
        promptParts.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        })
      } else {
        return NextResponse.json({ 
          error: `Unsupported image format: ${mimeType}. Supported formats: ${supportedMimeTypes.join(', ')}` 
        }, { status: 400 })
      }
    } else {
      return NextResponse.json({ 
        error: "Invalid image format. Please provide a base64 data URL." 
      }, { status: 400 })
    }

    // Generate content using gemini-2.5-flash-image-preview
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: promptParts
    })

    // Extract the generated image
    let imageData = null
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageData = part.inlineData.data
        break
      }
    }

    if (imageData) {
      // Return the generated image as PNG
      const generatedImageUrl = `data:image/png;base64,${imageData}`
      
      return NextResponse.json({
        success: true,
        generatedImage: generatedImageUrl,
        originalImage: image,
        prompt: prompt,
        format: "png",
        description: `Generated image based on prompt: ${prompt}`
      })
    } else {
      // If no image is generated, check if there's text response
      const textResponse = response.candidates?.[0]?.content?.parts?.find(part => part.text)?.text
      
      if (textResponse) {
        return NextResponse.json({
          success: false,
          error: "No image was generated",
          textResponse: textResponse,
          message: "The model returned a text response instead of an image. Try a different prompt that specifically requests image generation."
        }, { status: 400 })
      } else {
        throw new Error("No image or text data received from generation")
      }
    }

  } catch (error) {
    console.error('Image Generation API Error:', error)
    
    // Handle specific Gemini API errors
    if (error instanceof Error) {
      if (error.message.includes('API_KEY_INVALID')) {
        return NextResponse.json({ 
          error: "Invalid Google API key provided" 
        }, { status: 401 })
      }
      
      if (error.message.includes('QUOTA_EXCEEDED')) {
        return NextResponse.json({ 
          error: "API quota exceeded. Please check your Google API usage limits." 
        }, { status: 429 })
      }
      
      if (error.message.includes('SAFETY')) {
        return NextResponse.json({ 
          error: "Content was blocked due to safety policies. Please try a different prompt or image." 
        }, { status: 400 })
      }
    }
    
    return NextResponse.json({ 
      error: "Failed to generate image", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}