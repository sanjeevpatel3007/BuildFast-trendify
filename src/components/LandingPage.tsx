"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Zap, Image as ImageIcon, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import GenerateDialog from './GenerateDialog';

// Type definition
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

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sample data (first 5 for auto-scroll)
  const trends: Trend[] = [
    {
      "id": "1",
      "title": "Cinematic Bollywood Portrait",
      "description": "Transform your photos into stunning Bollywood-style portraits with cinematic lighting and traditional elegance.",
      "prompt": "Generate a 4K HD, realistic portrait of a young Indian woman wearing a traditional red saree with gold embroidery...",
      "image": "/trend/cinematic.png",
      "category": "AI",
      "order": 1,
      "createdAt": "2025-09-18"
    },
    {
      "id": "2",
      "title": "Saree Vision",
      "description": "Create artistic saree portraits with dramatic lighting and elegant poses in retro aesthetic style.",
      "prompt": "Convert, 4k HD realistic, A stunning portrait of a young Indian woman with long, dark, wavy hair...",
      "image": "/trend/saree-portrait.png",
      "category": "AI",
      "order": 2,
      "createdAt": "2025-09-17"
    },
    {
      "id": "3",
      "title": "Navratri Dream",
      "description": "Experience the magic of Navratri with Pinterest-inspired looks featuring traditional ghagra choli and romantic settings.",
      "prompt": "in a perfect Navratri dress red color ghagra choli with black dupatta Pinteresty aesthetic look...",
      "image": "/trend/ramleela.png",
      "category": "AI",
      "order": 3,
      "createdAt": "2025-09-17"
    },
    {
      "id": "4",
      "title": "Dhaka Colossus",
      "description": "Transform into a giant statue in the bustling streets of Dhaka with hyper-realistic construction scenes.",
      "prompt": "Create a giant hyper-realistic statue based on the given photo, keeping the original face exactly the same without changes. The statue stands tall in the middle of a roundabout in Dhaka, near a famous historical landmark. The statue is still under construction, surrounded by scaffolding, with many construction workers in yellow helmets and orange vests climbing, welding, and working on it. Parts of the statue's body are still exposed metal framework, while other sections are already detailed and finished. The background shows the realistic atmosphere of Dhaka city: crowded streets with colorful rickshaws, packed buses, and small cars circling the roundabout. Street vendors with tea stalls, fruit carts, and colorful umbrellas line the roadside. Shop signs, big billboards, and messy hanging electric wires crisscross above the streets, creating the typical Dhaka city vibe. The bright daytime sky shines above, with tropical trees and a bustling, lively atmosphere. Style: photorealistic, vibrant, and full of life.",
      "image": "/trend/dhaka-colossus.png",
      "category": "AI",
      "order": 4,
      "createdAt": "2025-09-17"
    },
    {
      "id": "5",
      "title": "Artistic Vision",
      "description": "Create stunning artistic portraits with professional lighting and elegant compositions.",
      "prompt": "Convert, 4k HD realistic, A stunning portrait of a young Indian woman with long, dark, wavy hair...",
      "image": "/trend/saree-portrait.png",
      "category": "AI",
      "order": 5,
      "createdAt": "2025-09-17"
    }
  ];

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % trends.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [trends.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % trends.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + trends.length) % trends.length);
  };

  const handleCardClick = (trend: Trend) => {
    setSelectedTrend(trend);
    setIsDialogOpen(true);
  };

  const getVisibleCards = () => {
    const cards = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentSlide + i) % trends.length;
      cards.push(trends[index]);
    }
    return cards;
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background SVG Grid with Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main Grid */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-5" viewBox="0 0 100 100">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#166534" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Animated Tilted Grids */}
        <div className="absolute -top-20 -left-20 w-96 h-96 opacity-10 animate-spin" style={{ animationDuration: '20s' }}>
          <svg viewBox="0 0 100 100" className="w-full h-full transform rotate-45">
            <defs>
              <pattern id="tiltedGrid1" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#16a34a" strokeWidth="0.8"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tiltedGrid1)" />
          </svg>
        </div>

        <div className="absolute -bottom-20 -right-20 w-80 h-80 opacity-8 animate-pulse">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-12">
            <defs>
              <pattern id="tiltedGrid2" width="12" height="12" patternUnits="userSpaceOnUse">
                <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#15803d" strokeWidth="0.6"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tiltedGrid2)" />
          </svg>
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-green-600 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        {/* <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-green-700 opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div> */}
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-green-500 rounded-full opacity-25 animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-green-600" />
                Trendify
              </h1>
              <p className="text-gray-600 mt-2">Your AI-powered trend tracker</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">
                Powered By <span className="text-green-600 font-semibold">Build Fast With AI</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-4 leading-tight">
              Transform Your
              <span className="text-green-600 block">Photos with AI</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
              Discover trending AI-generated styles and create stunning, personalized images that capture the latest aesthetic trends with just one click.
            </p>
          </div>

        </div>
      </section>

      {/* Trending Carousel Section */}
      <section className="relative z-10 py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-green-50/30 to-white/50">
        <div className="max-w-7xl mx-auto">
          {/* <div className="text-center mb-8">
            <h3 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Trending Now
            </h3>
            <p className="text-xl text-gray-600 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Discover the most popular AI image styles
            </p>
          </div> */}

          {/* Carousel Container */}
          <div className="relative">
            <div className="flex items-center justify-center">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                className="absolute left-0 z-20 bg-white/80 backdrop-blur-sm border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-300"
              >
                <ChevronLeft className="w-6 h-6 text-green-600" />
              </Button>

              {/* Cards Container */}
              <div className="flex gap-6 mx-16 justify-center overflow-hidden">
                {getVisibleCards().map((trend, index) => (
                  <div
                    key={`${trend.id}-${index}`}
                    className="relative group cursor-pointer transition-all duration-500 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.2}s` }}
                    onClick={() => handleCardClick(trend)}
                  >
                    <div className="w-80 h-96 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-green-100 hover:border-green-200">
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={trend.image}
                          alt={trend.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-4 right-4">
                          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {trend.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                          {trend.title}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {trend.description}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm text-green-600 font-medium">Try This Style</span>
                          <ArrowRight className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Next Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                className="absolute right-0 z-20 bg-white/80 backdrop-blur-sm border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-300"
              >
                <ChevronRight className="w-6 h-6 text-green-600" />
              </Button>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {trends.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-green-600 scale-125'
                      : 'bg-green-200 hover:bg-green-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Explore All Button */}
          <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => window.location.href = '/trends'}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Explore All Trending Images
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-white mb-6 animate-fade-in-up">
            Ready to Transform Your Photos?
          </h3>
          <p className="text-xl text-green-100 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Join thousands of users creating amazing AI-generated images
          </p>
          <Button 
            size="lg" 
            variant="outline"
            className="bg-white text-green-600 border-white hover:bg-green-50 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            Get Started Now
            <Sparkles className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {/* Generate Dialog */}
      {selectedTrend && (
        <GenerateDialog
          trend={selectedTrend}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedTrend(null);
          }}
        />
      )}
    </div>
  );
};

export default LandingPage;
