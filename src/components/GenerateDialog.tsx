"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Upload, Download, Loader2, Sparkles, Zap, Camera, Star, Heart, X } from 'lucide-react';
import { Trend } from '@/lib/types';
import Image from 'next/image';

interface FloatingElement {
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
}

interface GenerateDialogProps {
    trend: Trend;
    isOpen: boolean;
    onClose: () => void;
}

function GenerateDialog({ trend, isOpen, onClose }: GenerateDialogProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageLoadError, setImageLoadError] = useState(false);
    const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
    const [selectedAPI, setSelectedAPI] = useState<'google' | 'seedream'>('seedream');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Create floating animation elements
    useEffect(() => {
        if (isOpen) {
            const elements = Array.from({ length: 25 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 30 + 15,
                delay: Math.random() * 8,
                duration: Math.random() * 12 + 18,
            }));
            setFloatingElements(elements);
            
            // Debug: Log trend data when dialog opens
            // console.log(' Dialog opened for trend:', {
            //     title: trend.title,
            //     prompt: trend.prompt,
            //     hasPrompt: !!trend.prompt,
            //     promptLength: trend.prompt?.length || 0
            // });
        }
    }, [isOpen, trend]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setError(null);
        }
    };

    // generate with openai
    // const handleGenerate = async () => {
    //     if (!trend.prompt) {
    //         setError('No prompt available');
    //         return;
    //     }

    //     setIsGenerating(true);
    //     setError(null);

    //     try {
    //         const requestBody: { prompt: string; image?: string } = {
    //             prompt: trend.prompt
    //         };

    //         if (selectedFile) {
    //             const imageBase64 = await new Promise<string>((resolve, reject) => {
    //                 const reader = new FileReader();
    //                 reader.onload = () => {
    //                     const result = reader.result as string;
    //                     resolve(result);
    //                 };
    //                 reader.onerror = reject;
    //                 reader.readAsDataURL(selectedFile);
    //             });

    //             requestBody.image = imageBase64;
    //         } else {
    //             setError('Please upload an image to generate a new one');
    //             setIsGenerating(false);
    //             return;
    //         }

    //         const response = await fetch('/api/generate', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(requestBody),
    //         });

    //         const data = await response.json();
    //         console.log('API Response:', data);

    //         if (!response.ok) {
    //             if (data.error) {
    //                 throw new Error(data.error);
    //             } else {
    //                 throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    //             }
    //         }

    //         if (data.success && data.generatedImage) {
    //             console.log('Setting generated image:', data.generatedImage.substring(0, 100) + '...');
    //             setGeneratedImage(data.generatedImage);
    //             setImageLoadError(false);
    //         } else if (data.error) {
    //             throw new Error(data.error);
    //         } else {
    //             console.error('No image data found in response:', data);
    //             throw new Error('No image received from the API');
    //         }
    //     } catch (err) {
    //         const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    //         setError(errorMessage);
    //         console.error('Generation error:', err);
    //     } finally {
    //         setIsGenerating(false);
    //     }
    // };

// ✅ Function to call Google API and generate image
const handleGenerateGoogle = async () => {
    if (!trend.prompt) {
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
      console.log('Google API Response:', data);

      if (!response.ok) {
        if (data.error) {
          throw new Error(data.error);
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      if (data.success && data.generatedImage) {
        console.log('🎉 Google API: Image generated successfully!');
        console.log('Image data length:', data.generatedImage.length);
        setGeneratedImage(data.generatedImage);
        setImageLoadError(false);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        console.error('❌ Google API: No image data found in response:', data);
        throw new Error('No image received from the Google API');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Google Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
};

// ✅ Function to call Seedream API and generate image
const handleGenerateSeedream = async () => {
    // 1. Check if we have a prompt
    if (!trend.prompt) {
      setError('No prompt available');
      return;
    }
  
    setIsGenerating(true);
    setError(null);
  
    try {
      // 2. Build request body for Seedream
      const requestBody: {
        prompt: string;
        imageUrls: string[];
      } = {
        prompt: trend.prompt,
        // ✅ Use uploaded file or demo image
        imageUrls: selectedFile 
          ? [URL.createObjectURL(selectedFile)] // Use uploaded file (will be converted to demo image server-side)
          : ["https://storage.googleapis.com/falserverless/example_inputs/seedream4_edit_input_1.png"], // Demo image
      };
  
      // 3. Call your Next.js API route
      const response = await fetch('/api/seedream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      console.log('Seedream API Response:', data);
  
      // 4. Handle errors
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
  
      // 5. If success → set generated image
      if (data.success && data.images?.length > 0) {
        const imageUrl = data.images[0].url;
        console.log("🎉 Image generated successfully! URL:", imageUrl);
        setGeneratedImage(imageUrl);
        setImageLoadError(false);
      } else {
        console.error("❌ No images in response:", data);
        throw new Error(data.error || 'No image received from Seedream');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Seedream Generation error:', err);
    } finally {
      // 6. Always reset loading
      setIsGenerating(false);
    }
};

// ✅ Main generate function - switches between APIs
const handleGenerate = () => {
    console.log(' Using API:', selectedAPI);
    console.log(' Prompt from trend:', trend.prompt);
    
    if (selectedAPI === 'google') {
        handleGenerateGoogle();
    } else {
        handleGenerateSeedream();
    }
};
  

    const handleDownload = () => {
        if (generatedImage) {
            if (generatedImage.startsWith('data:')) {
                const link = document.createElement('a');
                link.href = generatedImage;
                link.download = `${trend.title}-generated.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                const link = document.createElement('a');
                link.href = generatedImage;
                link.download = `${trend.title}-generated.png`;
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    };

    const resetDialog = () => {
        setSelectedFile(null);
        setGeneratedImage(null);
        setError(null);
        setImageLoadError(false);
        setIsGenerating(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClose = () => {
        resetDialog();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent
                className="w-[95vw] max-w-[900px] max-h-[95vh] overflow-hidden p-0 bg-cyan-400 border-8 border-white shadow-2xl"
            >
                {/* Floating Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    {floatingElements.map((element) => (
                        <div
                            key={element.id}
                            className="absolute animate-float opacity-20"
                            style={{
                                left: `${element.x}%`,
                                top: `${element.y}%`,
                                animationDelay: `${element.delay}s`,
                                animationDuration: `${element.duration}s`,
                            }}
                        >
                            {element.id % 4 === 0 && <Star className="text-yellow-300" size={element.size} />}
                            {element.id % 4 === 1 && <Heart className="text-pink-300" size={element.size} />}
                            {element.id % 4 === 2 && <Sparkles className="text-blue-300" size={element.size} />}
                            {element.id % 4 === 3 && <Zap className="text-green-300" size={element.size} />}
                        </div>
                    ))}
                </div>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 z-0">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <defs>
                            <pattern id="cartoonGrid" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                                <path d="M 0,20 l 20,0" stroke="#fff" strokeWidth="0.5" />
                                <path d="M 0,0 l 0,20" stroke="#fff" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#cartoonGrid)" />
                    </svg>
                </div>

                {/* Custom Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-6 right-6 z-30 w-16 h-16 bg-red-500 border-4 border-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300 transform hover:scale-110 hover:rotate-90 shadow-2xl"
                >
                    <X className="w-8 h-8 text-white" />
                </button>

                {/* Header */}
                <div className="relative z-20 bg-blue-500 border-b-8 border-white transform -skew-y-2 origin-top-left shadow-2xl">
                    <div className="transform skew-y-2 px-10 py-8">
                        <DialogHeader className="mb-0">
                            <DialogTitle className="text-5xl font-black text-white mb-0 drop-shadow-lg flex items-center gap-4">
                                <div className="w-20 h-14 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce border-6 border-white shadow-2xl">
                                    <Sparkles className="w-10 h-10 text-blue-600" />
                                </div>
                                {trend.title}
                            </DialogTitle>

                        </DialogHeader>
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 px-4 lg:px-10 pb-6 lg:pb-10 overflow-y-auto max-h-[calc(95vh-160px)]">
                    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 lg:gap-12 pt-1">
                        {/* Left Column - Template Preview & Upload (2/5 width) */}
                        <div className="space-y-6 lg:space-y-10 xl:col-span-2 w-full">
                            {/* Template Preview Section */}
                            <div className="space-y-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                {/* <h3 className="text-xl font-black text-white drop-shadow-lg flex items-center gap-3">
                                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center border-4 border-white">
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                    ✨ STYLE TEMPLATE
                                </h3> */}
                                <div className="relative bg-white rounded-3xl overflow-hidden border-6 border-purple-500 shadow-2xl hover:shadow-3xl transition-all duration-500 group transform hover:scale-105">
                                    {/* Square container for template image */}
                                    <div className="aspect-square w-full">
                                        <Image
                                            src={trend.image}
                                            alt={trend.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            priority
                                        />
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-transparent text-white px-6 py-3 rounded-full text-lg font-black flex items-center gap-2 border-4 border-white shadow-lg">
                                        <Sparkles className="w-5 h-5" />
                                        TEMPLATE
                                    </div>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                                </div>
                            </div>

                            {/* Upload Section */}
                            <div className="space-y-6 transform -rotate-2 hover:rotate-0 transition-transform duration-500">


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
                                        className="bg-white border-6 border-dashed border-orange-500 rounded-3xl py-6 px-4 text-center hover:bg-orange-50 hover:border-orange-600 transition-all duration-300 cursor-pointer group transform hover:scale-105 aspect-square flex flex-col justify-center shadow-2xl"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-xl border-6 border-white">
                                            <Upload className="w-8 h-8 text-white" />
                                        </div>
                                        <p className="text-gray-800 font-black text-xl mb-4">Upload your photo here! ✨</p>
                                        {/* <p className="text-gray-600 text-lg font-bold">Click anywhere to browse files</p> */}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-3xl overflow-hidden border-6 border-orange-500 shadow-2xl relative group transform hover:scale-105 transition-all duration-300">
                                        {/* Square container for uploaded image */}
                                        <div className="aspect-square relative">
                                            <Image
                                                src={URL.createObjectURL(selectedFile)}
                                                alt="Your awesome photo"
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="absolute bottom-4 left-4 bg-transparent text-white px-6 py-3 rounded-full text-lg font-black flex items-center gap-2 border-4 border-white shadow-lg">
                                            <Camera className="w-5 h-5" />
                                            YOUR PHOTO
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedFile(null);
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = ""; // reset input
                                                }
                                            }}
                                            className="absolute top-4 right-4 bg-red-500 border-4 border-white rounded-full p-3 hover:bg-red-600 transition-all duration-300 transform hover:scale-110 hover:rotate-90 shadow-lg"
                                        >
                                            <X className="w-6 h-6 text-white" />
                                        </button>

                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                                    </div>
                                )}



                                {/* Debug Info */}
                                {/* <div className="pt-4">
                                    <div className="bg-yellow-100 rounded-2xl border-4 border-yellow-500 p-4 shadow-xl">
                                        <h4 className="text-lg font-black text-yellow-800 mb-2 text-center">🔍 Debug Info</h4>
                                        <div className="text-sm text-yellow-700">
                                            <p><strong>Prompt:</strong> {trend.prompt ? '✅ Available' : '❌ Missing'}</p>
                                            <p><strong>Length:</strong> {trend.prompt?.length || 0} characters</p>
                                            <p><strong>API:</strong> {selectedAPI}</p>
                                        </div>
                                    </div>
                                </div> */}

                                {/* API Selection */}
                                <div className="pt-4">
                                    <div className="bg-white rounded-2xl border-4 border-purple-500 p-4 shadow-xl">
                                        <h4 className="text-lg font-black text-gray-800 mb-4 text-center">🤖 Choose AI Engine</h4>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setSelectedAPI('seedream')}
                                                className={`flex-1 py-3 px-4 rounded-xl font-black text-sm transition-all duration-300 ${
                                                    selectedAPI === 'seedream'
                                                        ? 'bg-blue-500 text-white border-4 border-white shadow-lg'
                                                        : 'bg-gray-200 text-gray-700 border-2 border-gray-300'
                                                }`}
                                            >
                                             Seedream
                                            </button>
                                            <button
                                                onClick={() => setSelectedAPI('google')}
                                                className={`flex-1 py-3 px-4 rounded-xl font-black text-sm transition-all duration-300 ${
                                                    selectedAPI === 'google'
                                                        ? 'bg-green-500 text-white border-4 border-white shadow-lg'
                                                        : 'bg-gray-200 text-gray-700 border-2 border-gray-300'
                                                }`}
                                            >
                                             Google
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Generate Button */}
                                <div className="pt-4">
                                    <Button
                                        onClick={handleGenerate}
                                        disabled={isGenerating || !selectedFile}
                                        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-black py-8 text-md rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl disabled:opacity-50 disabled:scale-100 border-6 border-white"
                                        size="lg"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="w-8 h-8 mr-4 animate-spin" />
                                                🪄 CREATING MAGIC...
                                            </>
                                        ) : !selectedFile ? (
                                            'UPLOAD PHOTO FIRST!'
                                        ) : (
                                            <>
                                                <Zap className="w-8 h-8 mr-4" />
                                                GENERATE AI MASTERPIECE!
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Generated Image (3/5 width) */}
                        <div className="space-y-6 lg:space-y-8 xl:col-span-3">
                            <h3 className="text-lg lg:text-xl font-black text-white drop-shadow-lg flex items-center gap-3 lg:gap-4">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl border-4 lg:border-6 border-white animate-pulse">
                                    <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                                </div>
                                <span className="text-sm lg:text-xl">🎭 AI GENERATED RESULT</span>
                            </h3>

                            <div className="min-h-[500px] flex flex-col">
                                {/* Error Display */}
                                {error && (
                                    <div className="bg-red-100 border-6 border-red-500 rounded-3xl p-10 mb-10 transform rotate-1 hover:rotate-0 transition-transform duration-300 shadow-2xl">
                                        <div className="flex items-start space-x-8">
                                            <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-xl border-6 border-white">
                                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-red-600 font-black text-3xl mb-6">🚫 OOPS! Magic Failed!</h4>
                                                <p className="text-red-500 text-xl mb-8 font-bold">{error}</p>
                                                {error.includes('API key') && (
                                                    <p className="text-red-400 text-lg mb-8">
                                                        🔑 Please check your .env.local file and ensure GEMINI_API_KEY is set correctly.
                                                    </p>
                                                )}
                                                <Button
                                                    onClick={handleGenerate}
                                                    disabled={isGenerating || !selectedFile}
                                                    className="bg-red-500 text-white hover:bg-red-600 font-black rounded-2xl transform hover:scale-105 transition-all duration-300 px-8 py-4 text-xl border-4 border-white shadow-lg"
                                                >
                                                    🔄 TRY AGAIN!
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Loading State */}
                                {isGenerating && (
                                    <div className="flex-1 flex flex-col transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                                        <div className="flex items-center justify-center space-x-8 mb-10">
                                            <Loader2 className="w-16 h-16 animate-spin text-yellow-400" />
                                            <span className="font-black text-white text-xl drop-shadow-lg">🎨 AI is painting your masterpiece...</span>
                                        </div>
                                        <div className="flex-1 bg-white rounded-3xl border-6 border-emerald-500 min-h-[300px] overflow-hidden shadow-2xl">
                                            <Skeleton className="w-full h-full rounded-3xl bg-blue-200 animate-pulse" />
                                        </div>
                                        <div className="mt-10">
                                            <Button disabled className="w-full h-20 bg-purple-500 text-white font-black text-2xl rounded-2xl border-6 border-white shadow-2xl" size="lg">
                                                <Loader2 className="w-8 h-8 mr-4 animate-spin" />
                                                ⏳ PROCESSING MAGIC...
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Generated Image Display */}
                                {generatedImage && !isGenerating && (
                                    <div className="flex-1 flex flex-col transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                        <div className="flex-1 bg-white rounded-3xl overflow-hidden border-6 border-emerald-500 mb-10 relative group shadow-2xl">
                                            <div className="relative w-full min-h-[500px] flex items-center justify-center p-6">
                                                {!imageLoadError ? (
                                                    <>
                                                        {/* Use regular img tag to bypass Next.js Image optimization */}
                                                        <img
                                                            src={generatedImage}
                                                            alt="Your AI Masterpiece"
                                                            className="max-w-full max-h-full object-contain rounded-2xl group-hover:scale-105 transition-transform duration-500 shadow-xl"
                                                            style={{ maxHeight: '600px', maxWidth: '600px' }}
                                                            onLoad={() => console.log('Image loaded successfully')}
                                                            onError={(e) => {
                                                                console.error('Image load error:', e);
                                                                console.error('Failed image src:', generatedImage.substring(0, 100) + '...');
                                                                setImageLoadError(true);
                                                            }}
                                                        />
                                                        {/* <div className="absolute top-6 left-6 bg-emerald-500 text-white px-8 py-4 rounded-full font-black text-xl flex items-center gap-3 shadow-xl border-4 border-white">
                                                            <Sparkles className="w-6 h-6" />
                                                            ✨ AI MASTERPIECE
                                                        </div> */}
                                                    </>
                                                ) : (
                                                    <div className="text-center p-16">
                                                        <div className="w-32 h-32 mx-auto mb-10 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce shadow-2xl border-6 border-white">
                                                            <Sparkles className="w-16 h-16 text-white" />
                                                        </div>
                                                        <p className="text-gray-800 font-black text-3xl mb-6">🎉 Your Art is Ready!</p>
                                                        <p className="text-gray-600 text-xl font-bold">Click download to save your creation</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleDownload}
                                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-8 text-md rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl border-6 border-white"
                                            size="lg"
                                        >
                                            <Download className="w-8 h-8 mr-4" />
                                            DOWNLOAD YOUR MASTERPIECE!
                                        </Button>
                                    </div>
                                )}

                                {/* Default State */}
                                {!generatedImage && !isGenerating && !error && (
                                    <div className="flex-1 bg-white rounded-3xl border-6 border-dashed border-emerald-500 min-h-[500px] flex items-center justify-center transform -rotate-1 hover:rotate-0 transition-transform duration-500 shadow-2xl">
                                        <div className="text-center p-6">
                                            <div className="w-32 h-32 mx-auto mb-4 bg-emerald-500 rounded-full flex items-center justify-center animate-pulse shadow-2xl border-6 border-white">
                                                <Camera className="w-12 h-12 text-white" />
                                            </div>
                                            <h3 className="text-gray-800 font-black text-xl mb-4">🎭 Ready to Create Magic?</h3>
                                            <p className="text-gray-600 text-xl font-bold mb-4">Upload your photo and hit generate to see AI work its spell!</p>
                                            <div className="flex justify-center space-x-4">
                                                <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce border-2 border-white" style={{ animationDelay: '0s' }}></div>
                                                <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce border-2 border-white" style={{ animationDelay: '0.3s' }}></div>
                                                <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce border-2 border-white" style={{ animationDelay: '0.6s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Custom CSS */}
                <style jsx>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
                        25% { transform: translateY(-30px) rotate(90deg); opacity: 0.8; }
                        50% { transform: translateY(-15px) rotate(180deg); opacity: 0.4; }
                        75% { transform: translateY(-40px) rotate(270deg); opacity: 0.9; }
                    }
                    
                    .animate-float {
                        animation: float linear infinite;
                    }

                    .shadow-3xl {
                        box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
                    }

                    .border-6 {
                        border-width: 6px;
                    }
                `}</style>
            </DialogContent>
        </Dialog>
    );
}

export default GenerateDialog;
