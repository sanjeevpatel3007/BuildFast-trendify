"use client";
import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Image as ImageIcon, ArrowRight, Star, Heart, Smile, Link } from 'lucide-react';
// import Image from 'next/image';
import { Button } from './ui/button';
import GenerateDialog from './GenerateDialog';
import Image from 'next/image';
import trendsData from '@/lib/data.json';

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

interface LandingPageProps {
  onShowGallery?: () => void;
}

const LandingPage = ({ onShowGallery }: LandingPageProps) => {
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mascotBounce, setMascotBounce] = useState(false);
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);

  // Use first 3 items from data.json
  const trends: Trend[] = trendsData.slice(0, 3);

  useEffect(() => {
    // Create floating elements
    const elements = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 30 + 10,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 15,
    }));
    setFloatingElements(elements);

    // Mascot bounce interval
    const bounceInterval = setInterval(() => {
      setMascotBounce(true);
      setTimeout(() => setMascotBounce(false), 600);
    }, 3000);

    return () => clearInterval(bounceInterval);
  }, []);

  const handleCardClick = (trend: Trend) => {
    setSelectedTrend(trend);
    setIsDialogOpen(true);
  };

  return (
    <div className="h-screen w-full overflow-hidden relative bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

      {/* Diagonal Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <pattern id="diagonalGrid" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <path d="M 0,20 l 20,0" stroke="#fff" strokeWidth="0.5"/>
              <path d="M 0,0 l 0,20" stroke="#fff" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonalGrid)" />
        </svg>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 h-full flex flex-col lg:flex-row">
        {/* Left Diagonal Section */}
        <div className="flex-1 relative transform -skew-x-12 bg-gradient-to-b from-cyan-400 to-blue-500 shadow-2xl">
          <div className="transform skew-x-12 h-full flex flex-col justify-center items-start p-6 lg:p-12">
            {/* Cartoon Mascot */}
            <div className={`mb-8 ml-0 md:ml-16 transform transition-all duration-600 ${mascotBounce ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`}>
              <div className="w-32 h-32 bg-yellow-400 rounded-full relative shadow-xl border-4 border-white">
                {/* Face */}
                <div className="absolute top-6 left-6 w-4 h-4 bg-black rounded-full"></div>
                <div className="absolute top-6 right-6 w-4 h-4 bg-black rounded-full"></div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-black rounded-full"></div>
                {/* Hat */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-red-500 rounded-t-full border-2 border-white"></div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="text-white ml-0 md:ml-16">
              <h1 className="text-4xl lg:text-6xl font-black mb-4 transform rotate-3 drop-shadow-lg">
                TRENDIFY!
              </h1>
              <div className="bg-yellow-400 text-black p-3 lg:p-4 rounded-xl transform -rotate-2 shadow-lg">
                <p className="text-lg lg:text-2xl font-bold">
                  🎨 AI Magic Awaits!
                </p>
              </div>
            </div>

            {/* Floating Action Buttons */}
            <div className="mt-8 lg:mt-12 space-y-3 lg:space-y-4">
              <Button 
                className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-full transform rotate-1 hover:rotate-0 hover:scale-105 transition-all duration-300 shadow-lg text-base lg:text-lg font-bold"
                onClick={() => handleCardClick(trends[0])}
              >
                <Sparkles className="mr-2" />
                Start Creating!
              </Button>
              
              <Button 
                variant="outline"
                className="bg-white/20 border-white text-white hover:bg-white hover:text-black px-6 lg:px-8 py-3 lg:py-4 rounded-full transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 shadow-lg text-base lg:text-lg font-bold backdrop-blur-sm"
                onClick={onShowGallery}
              >
                <ImageIcon className="mr-2" />
                Explore Gallery
              </Button>
            </div>
          </div>
        </div>

        {/* Right Diagonal Section */}
        <div className="flex-1 relative transform skew-x-12 bg-gradient-to-b from-emerald-400 to-teal-500 shadow-2xl lg:ml-4">
          <div className="transform -skew-x-12 h-full flex flex-col justify-center p-6 lg:p-12">
            {/* Trending Cards - Floating Style */}
            <div className="space-y-6">
              <div className="text-center mb-6 lg:mb-8">
                <h2 className="text-2xl lg:text-4xl font-black text-white mb-2 drop-shadow-lg">
                  ⚡ TRENDING NOW ⚡
                </h2>
                <div className="w-24 lg:w-32 h-1 bg-yellow-400 mx-auto rounded-full"></div>
              </div>

              {trends.slice(0, 3).map((trend, index) => (
                <div
                  key={trend.id}
                  className={`group cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                    index % 2 === 0 ? 'rotate-2 hover:rotate-0' : '-rotate-2 hover:rotate-0'
                  }`}
                  onClick={() => handleCardClick(trend)}
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-xl border-4 border-white/50 hover:border-yellow-400 group-hover:bg-white transition-all duration-300">
                    <div className="flex items-center space-x-3 lg:space-x-4">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                        <Image src={trend.image} alt={trend.title} width={64} height={64} 
                        className="object-cover rounded-xl group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base lg:text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                          {trend.title}
                        </h3>
                        <p className="text-xs lg:text-sm text-gray-600 line-clamp-2">
                          {trend.description}
                        </p>
                      </div>
                      <div className="group-hover:translate-x-1 transition-transform flex-shrink-0">
                        <ArrowRight className="w-4 h-4 lg:w-6 lg:h-6 text-purple-500" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Stats */}
            <div className="mt-6 lg:mt-8 grid grid-cols-2 gap-3 lg:gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 lg:p-4 text-center transform rotate-1">
                <div className="text-xl lg:text-3xl font-black text-white">1000+</div>
                <div className="text-xs lg:text-sm text-white/80">Happy Users</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 lg:p-4 text-center transform -rotate-1">
                <div className="text-xl lg:text-3xl font-black text-white">50+</div>
                <div className="text-xs lg:text-sm text-white/80">AI Styles</div>
              </div>
            </div>
          </div>
        </div>

        {/* Corner Decorative Elements */}
        <div className="absolute top-8 right-8 transform rotate-12 animate-pulse">
          <div className="w-16 h-16 bg-yellow-400 rounded-full shadow-lg flex items-center justify-center">
            <Smile className="w-8 h-8 text-black" />
          </div>
        </div>

        <div className="absolute bottom-8 left-8 transform -rotate-12 animate-bounce">
          <div className="w-12 h-12 bg-pink-400 rounded-full shadow-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Powered by Build Fast With AI */}
        <div className="absolute bottom-8 left-44 z-50">
          <a
            href="https://buildfastwithai.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-black/70 text-white px-4 py-2 rounded-full shadow-lg hover:bg-black/90 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            <span className="font-semibold text-sm">Powered by</span>
            <span className="font-bold text-sm">Build Fast With AI</span>
          </a>
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
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
