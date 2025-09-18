"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload, Download, Loader2, Sparkles, Zap, ArrowLeft, Camera } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

// Type definitions
interface Trend {
  id: string;
  title: string;
  description: string;
  prompt: string;
  image: string;
  category: string;
  order: number;
  createdAt: string;
}

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function ImageGeneratorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get trend data from URL params or use default
  const [trend, setTrend] = useState<Trend | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get trend data from URL params or use default
  useEffect(() => {
    const trendId = searchParams.get('trendId');
    
    // Import data from the JSON file
    import('@/lib/data.json').then((data) => {
      if (trendId) {
        // Find trend by ID
        const foundTrend = data.default.find((t: Trend) => t.id === trendId);
        if (foundTrend) {
          setTrend(foundTrend);
        } else {
          // Use first trend as fallback
          setTrend(data.default[0]);
        }
      } else {
        // Use first trend as default
        setTrend(data.default[0]);
      }
    }).catch(() => {
      // Fallback if import fails
      const fallbackTrend: Trend = {
        id: "1",
        title: "AI Magic Generator",
        description: "Create amazing AI-generated images",
        prompt: "Generate a beautiful, high-quality image with artistic style",
        image: "/trend/cinematic.png",
        category: "AI",
        order: 1,
        createdAt: "2025-01-01"
      };
      setTrend(fallbackTrend);
    });
  }, [searchParams]);

  // Create floating animation elements
  useEffect(() => {
    const elements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      duration: Math.random() * 8 + 12,
    }));
    setFloatingElements(elements);
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!trend || !trend.prompt) {
      setError('No prompt available');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const requestBody: { prompt: string; image?: string } = {
        prompt: trend.prompt
      };

      if (selectedFile) {
        const imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });

        requestBody.image = imageBase64;
      } else {
        setError('Please upload an image to generate a new one');
        setIsGenerating(false);
        return;
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      if (data.success && data.generatedImage) {
        setGeneratedImage(data.generatedImage);
        setImageLoadError(false);
      } else {
        throw new Error(data.error || 'No image received from the API');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage && trend) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `${trend.title}-generated.png`;
      if (generatedImage.startsWith('data:')) {
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  // Show loading state if trend is not loaded
  if (!trend) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white font-bold text-xl">Loading AI Magic...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden relative bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute animate-float opacity-10"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
            }}
          >
            {element.id % 3 === 0 && <Sparkles className="text-yellow-300" size={element.size} />}
            {element.id % 3 === 1 && <Camera className="text-cyan-300" size={element.size} />}
            {element.id % 3 === 2 && <Zap className="text-pink-300" size={element.size} />}
          </div>
        ))}
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <pattern id="hexGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <polygon points="10,2 18,7 18,13 10,18 2,13 2,7" fill="none" stroke="#fff" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexGrid)" />
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-20 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleBack}
                className="bg-white/20 border-white/30 text-white hover:bg-white hover:text-purple-600 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-black text-white drop-shadow-lg flex items-center gap-2">
                  <Camera className="w-7 h-7" />
                  {/* {trend.title} */}
                </h1>
                <p className="text-white/80 text-sm">AI Magic Generator</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white font-bold text-sm">🎨 CREATE MODE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-[calc(100vh-80px)] flex">
        {/* Left Panel - 1/3 width */}
        <div className="w-1/3 h-full flex flex-col">
          {/* Top Half - Template Selection */}
          <div className="h-1/2 bg-gradient-to-br from-cyan-400 to-blue-500 p-6 transform -skew-y-1 origin-top-left shadow-2xl">
            <div className="transform skew-y-1 h-full flex flex-col">
              <div className="mb-4">
                <h2 className="text-2xl font-black text-white mb-2 drop-shadow-lg flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  STYLE TEMPLATE
                </h2>
                <div className="w-16 h-1 bg-yellow-400 rounded-full"></div>
              </div>
              
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/30 overflow-hidden group hover:scale-105 transition-all duration-500">
                <div className="relative h-full">
                  <Image
                    src={trend.image}
                    alt={trend.title}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 left-3 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-black">
                    ✨ TEMPLATE
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Half - User Image Upload */}
          <div className="h-1/2 bg-gradient-to-br from-emerald-400 to-teal-500 p-6 transform skew-y-1 origin-bottom-left shadow-2xl">
            <div className="transform -skew-y-1 h-full flex flex-col">
              <div className="mb-4">
                <h2 className="text-2xl font-black text-white mb-2 drop-shadow-lg flex items-center gap-2">
                  <Camera className="w-6 h-6" />
                  YOUR PHOTO
                </h2>
                <div className="w-16 h-1 bg-pink-400 rounded-full"></div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />

              {!selectedFile ? (
                <div 
                  className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-dashed border-white/50 flex flex-col items-center justify-center cursor-pointer hover:bg-white/20 hover:border-white/70 transition-all duration-300 group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white font-bold text-lg mb-2">Drop your photo here!</p>
                  <p className="text-white/80 text-sm text-center">Click or drag to upload</p>
                </div>
              ) : (
                <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/30 overflow-hidden relative group">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Your uploaded image"
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-pink-400 text-white px-3 py-1 rounded-full text-xs font-black">
                    📸 YOUR PHOTO
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-2 hover:bg-white hover:text-red-500 transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Generate Button */}
              <div className="mt-4">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !selectedFile}
                  className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-black py-4 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-lg text-lg disabled:opacity-50 disabled:scale-100"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                      🪄 CREATING MAGIC...
                    </>
                  ) : !selectedFile ? (
                    '📸 UPLOAD FIRST!'
                  ) : (
                    <>
                      <Zap className="w-6 h-6 mr-2" />
                      ✨ GENERATE MAGIC!
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - 2/3 width */}
        <div className="w-2/3 h-full flex flex-col">
          {/* Generated Image Display */}
          <div className="flex-1 bg-gradient-to-br from-purple-400 to-pink-500 p-6 transform skew-y-1 origin-top-right shadow-2xl">
            <div className="transform -skew-y-1 h-full flex flex-col">
              <div className="mb-4">
                <h2 className="text-2xl font-black text-white mb-2 drop-shadow-lg flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  GENERATED RESULT
                </h2>
                <div className="w-16 h-1 bg-yellow-400 rounded-full"></div>
              </div>

              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/30 overflow-hidden relative">
                {isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                      <Loader2 className="w-10 h-10 text-white animate-spin" />
                    </div>
                    <p className="text-white font-bold text-xl">Creating your magic...</p>
                    <p className="text-white/80 text-sm">This may take a few moments</p>
                  </div>
                ) : generatedImage ? (
                  <div className="relative h-full group">
                    <img
                      src={generatedImage}
                      alt="Generated image"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={() => setImageLoadError(true)}
                    />
                    <div className="absolute top-3 left-3 bg-green-400 text-white px-3 py-1 rounded-full text-xs font-black">
                      ✨ GENERATED
                    </div>
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <button
                        onClick={handleDownload}
                        className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-2 hover:bg-white hover:text-green-500 transition-all duration-300"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                      <Camera className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-white font-bold text-xl">Your magic awaits!</p>
                    <p className="text-white/80 text-sm">Upload a photo and generate</p>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                  <p className="text-red-200 text-sm font-bold">⚠️ Error: {error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(90deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
          75% { transform: translateY(-30px) rotate(270deg); }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};
