"use client";
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Upload, Download, Loader2 } from 'lucide-react';
import { Trend } from '@/lib/types';
import Image from 'next/image';

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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setError(null);
        }
    };

    const handleGenerate = async () => {
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
            console.log('API Response:', data);

            if (!response.ok) {
                if (data.error) {
                    throw new Error(data.error);
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            }

            if (data.success && data.generatedImage) {
                console.log('Setting generated image:', data.generatedImage.substring(0, 100) + '...');
                setGeneratedImage(data.generatedImage);
                setImageLoadError(false);
            } else if (data.error) {
                throw new Error(data.error);
            } else {
                console.error('No image data found in response:', data);
                throw new Error('No image received from the API');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMessage);
            console.error('Generation error:', err);
        } finally {
            setIsGenerating(false);
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
            <DialogContent className="max-w-[1600px]  max-h-[95vh] overflow-y-auto p-0 w-[1600px]">
                <div className="p-6 pb-0">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-bold text-gray-900">
                            {trend.title}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600">
                            Generate your own version using AI
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="px-6 pb-6">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Left Column - Template Preview & Upload */}
                        <div className="space-y-6 xl:col-span-1 w-full">
                            {/* Template Preview Section */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-semibold text-gray-900">Template Preview</h3>
                                <div className="relative bg-gray-50 rounded-lg overflow-hidden border-2 border-gray-200">
                                    <div className="aspect-square w-full max-w-sm mx-auto">
                                        <Image
                                            src={trend.image}
                                            alt={trend.title}
                                            width={400}
                                            height={400}
                                            className="object-cover w-full h-full"
                                            priority
                                        />
                                    </div>
                                    {/* <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-medium">
                                        Template
                                    </div> */}
                                </div>
                            </div>

                            {/* Upload Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Upload Your Image</h3>
                                
                                {!selectedFile ? (
                                    <div className="space-y-4">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <div 
                                            className="border-2 border-dashed border-gray-300 rounded-lg py-4 px-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 mb-2 text-sm">Click to upload your image</p>
                                            {/* <p className="text-sm text-gray-500">PNG, JPG, or GIF (max 10MB)</p> */}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="relative bg-gray-50 rounded-lg overflow-hidden border-2 border-green-200">
                                            <div className="aspect-square w-full max-w-sm mx-auto">
                                                <img
                                                    src={URL.createObjectURL(selectedFile)}
                                                    alt="Uploaded preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            {/* <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                                                Your Image
                                            </div> */}
                                            <button
                                                type="button"
                                                onClick={() => setSelectedFile(null)}
                                                className="absolute top-2 right-2 bg-white border border-gray-300 rounded-full p-2 shadow-sm hover:bg-gray-100 transition"
                                                aria-label="Remove image"
                                            >
                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        
                                        <Button
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full"
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            Choose Different Image
                                        </Button>
                                    </div>
                                )}

                                {/* Generate Button - Fixed Position */}
                                <div className="pt-4">
                                    <Button
                                        onClick={handleGenerate}
                                        disabled={isGenerating || !selectedFile}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium disabled:bg-gray-400 h-12"
                                        size="lg"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Generating...
                                            </>
                                        ) : !selectedFile ? (
                                            'Upload an image to continue'
                                        ) : (
                                            'Generate AI Image'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Generated Image */}
                        <div className="space-y-6 xl:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-900">Generated Result</h3>
                            
                            <div className="min-h-[400px] flex flex-col">
                                {/* Error Display */}
                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-red-800 mb-1">Generation Failed</h4>
                                                <p className="text-red-600 text-sm mb-3">{error}</p>
                                                {error.includes('API key') && (
                                                    <p className="text-xs text-red-500 mb-3">
                                                        Please check your .env.local file and ensure GEMINI_API_KEY is set correctly.
                                                    </p>
                                                )}
                                                <Button
                                                    onClick={handleGenerate}
                                                    disabled={isGenerating || !selectedFile}
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 border-red-300 hover:bg-red-50"
                                                >
                                                    Try Again
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Loading State */}
                                {isGenerating && (
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex items-center space-x-3 mb-4">
                                            <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                                            <span className="font-medium text-gray-900">Creating your AI image...</span>
                                        </div>
                                        <div className="flex-1 bg-gray-50 rounded-lg border-2 border-gray-200 min-h-[400px]">
                                            <Skeleton className="w-full h-full rounded-lg" />
                                        </div>
                                        <div className="mt-4">
                                            <Button disabled className="w-full h-12" size="lg">
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Processing...
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Generated Image Display */}
                                {generatedImage && !isGenerating && (
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex-1 bg-gray-50 rounded-lg overflow-hidden border-2 border-green-200 mb-4">
                                            <div className="relative w-full min-h-[400px] flex items-center justify-center">
                                                {!imageLoadError ? (
                                                    <img
                                                        src={generatedImage}
                                                        alt="Generated AI Image"
                                                        className="max-w-full max-h-full object-contain rounded-lg"
                                                        style={{ maxHeight: '500px' }}
                                                        onLoad={() => console.log('Image loaded successfully')}
                                                        onError={(e) => {
                                                            console.error('Image load error:', e);
                                                            console.error('Failed image src:', generatedImage.substring(0, 100) + '...');
                                                            setImageLoadError(true);
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="text-center p-8">
                                                        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-sm text-gray-600 font-medium">Generated Image Ready</p>
                                                        <p className="text-xs text-gray-500 mt-1">Click Download to save</p>
                                                    </div>
                                                )}
                                                <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                                                    AI Generated
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Download Button - Fixed Position */}
                                        <Button
                                            onClick={handleDownload}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium h-12"
                                            size="lg"
                                        >
                                            <Download className="w-5 h-5 mr-2" />
                                            Download Generated Image
                                        </Button>
                                    </div>
                                )}

                                {/* Default State */}
                                {!generatedImage && !isGenerating && !error && (
                                    <div className="flex-1 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 min-h-[400px] flex items-center justify-center">
                                        <div className="text-center p-8">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-600 font-medium mb-2">Your AI generated image will appear here</p>
                                            <p className="text-sm text-gray-500">Upload an image and click generate to start</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default GenerateDialog;
