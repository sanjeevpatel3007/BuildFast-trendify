# Trendify Setup Instructions

## Environment Variables

Create a `.env.local` file in the root directory with the following content:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Getting Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Paste it in your `.env.local` file

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- Browse trending AI prompts
- Upload your own images
- Generate AI content using Gemini
- Download generated results
