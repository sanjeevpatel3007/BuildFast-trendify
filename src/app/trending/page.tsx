"use client";
import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Star, Heart, ArrowLeft, Search, Filter, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Import your data - adjust path as needed
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

const TrendingPage = () => {
  const router = useRouter();
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Use the imported data or fallback to the provided data
  const trends: Trend[] = trendsData || [
    {
      "id": "1",
      "title": "Cinematic Bollywood Portrait",
      "description": "abc",
      "prompt": "Generate a 4K HD, realistic portrait of a young Indian woman wearing a traditional red saree with gold embroidery...",
      "image": "/trend/cinematic.png",
      "category": "AI",
      "order": 1,
      "createdAt": "2025-09-18"
    },
    {
      "id": "2",
      "title": "Saree Vision",
      "description": "abc",
      "prompt": "Convert, 4k HD realistic, A stunning portrait of a young Indian woman with long, dark, wavy hair...",
      "image": "/trend/saree-portrait.png",
      "category": "AI",
      "order": 2,
      "createdAt": "2025-09-17"
    },
    {
      "id": "3",
      "title": "Navratri Dream",
      "description": "A Pinterest-inspired Navratri look reminiscent of Deepika Padukone's character in 'Ramleela'...",
      "prompt": "in a perfect Navratri dress red color ghagra choli with black dupatta Pinteresty aesthetic look...",
      "image": "/trend/ramleela.png",
      "category": "AI",
      "order": 3,
      "createdAt": "2025-09-17"
    },
    {
      "id": "4",
      "title": "Dhaka Colossus",
      "description": "A hyper-realistic giant statue, based on the provided photo, under construction in a Dhaka roundabout...",
      "prompt": "Create a giant hyper-realistic statue based on the given photo, keeping the original face exactly the same...",
      "image": "/trend/dhaka-colossus.png",
      "category": "AI",
      "order": 4,
      "createdAt": "2025-09-17"
    },
    {
      "id": "5",
      "title": "Saree Vision",
      "description": "abc",
      "prompt": "Convert, 4k HD realistic, A stunning portrait of a young Indian woman with long, dark, wavy hair...",
      "image": "/trend/saree-portrait.png",
      "category": "AI",
      "order": 2,
      "createdAt": "2025-09-17"
    },
    {
      "id": "6",
      "title": "Navratri Dream",
      "description": "A Pinterest-inspired Navratri look reminiscent of Deepika Padukone's character in 'Ramleela'...",
      "prompt": "in a perfect Navratri dress red color ghagra choli with black dupatta Pinteresty aesthetic look...",
      "image": "/trend/ramleela.png",
      "category": "AI",
      "order": 3,
      "createdAt": "2025-09-17"
    },
    {
      "id": "7",
      "title": "Dhaka Colossus",
      "description": "A hyper-realistic giant statue, based on the provided photo, under construction in a Dhaka roundabout...",
      "prompt": "Create a giant hyper-realistic statue based on the given photo, keeping the original face exactly the same...",
      "image": "/trend/dhaka-colossus.png",
      "category": "AI",
      "order": 4,
      "createdAt": "2025-09-17"
    },
    {
      "id": "8",
      "title": "Saree Vision",
      "description": "abc",
      "prompt": "Convert, 4k HD realistic, A stunning portrait of a young Indian woman with long, dark, wavy hair...",
      "image": "/trend/saree-portrait.png",
      "category": "AI",
      "order": 2,
      "createdAt": "2025-09-17"
    },
    {
      "id": "9",
      "title": "Navratri Dream",
      "description": "A Pinterest-inspired Navratri look reminiscent of Deepika Padukone's character in 'Ramleela'...",
      "prompt": "in a perfect Navratri dress red color ghagra choli with black dupatta Pinteresty aesthetic look...",
      "image": "/trend/ramleela.png",
      "category": "AI",
      "order": 3,
      "createdAt": "2025-09-17"
    }
  ];

  // Create floating animation elements
  useEffect(() => {
    const elements = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 25 + 15,
      delay: Math.random() * 8,
      duration: Math.random() * 12 + 18,
    }));
    setFloatingElements(elements);
  }, []);

  const handleImageClick = (trend: Trend) => {
    // Navigate to /image with trend data as query params or state
    router.push(`/image?id=${trend.id}&title=${encodeURIComponent(trend.title)}&prompt=${encodeURIComponent(trend.prompt)}`);
  };

  const filteredTrends = trends.filter(trend => 
    trend.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute animate-float opacity-8"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
            }}
          >
            {element.id % 4 === 0 && <Star className="text-yellow-300" size={element.size} />}
            {element.id % 4 === 1 && <Heart className="text-pink-300" size={element.size} />}
            {element.id % 4 === 2 && <Sparkles className="text-cyan-300" size={element.size} />}
            {element.id % 4 === 3 && <Zap className="text-green-300" size={element.size} />}
          </div>
        ))}
      </div>

      {/* Diagonal Background Pattern */}
      <div className="fixed inset-0 opacity-5 z-0">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <pattern id="zigzag" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
              <path d="M0,5 L5,0 L10,5 L15,0" stroke="#fff" strokeWidth="0.5" fill="none"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#zigzag)" />
        </svg>
      </div>

      {/* Header Section */}
      <div className="relative z-20 bg-white/10 backdrop-blur-sm border-b border-white/20 transform -skew-y-1 origin-top-left shadow-2xl">
        <div className="transform skew-y-1 max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.back()}
                className="bg-white/20 border-white/30 text-white hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:scale-110"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-4xl font-black text-white drop-shadow-lg flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                    <Sparkles className="w-7 h-7 text-purple-600" />
                  </div>
                  TRENDING GALLERY
                </h1>
                <p className="text-white/80 text-lg font-bold">🎨 Discover AI Magic Styles</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                className="bg-white/20 border-white/30 text-white hover:bg-cyan-400 hover:text-white transition-all duration-300 transform hover:rotate-12"
              >
                <Shuffle className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-white/20 border-white/30 text-white hover:bg-pink-400 hover:text-white transition-all duration-300 transform hover:rotate-12"
              >
                <Filter className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-white/60" />
            </div>
            <input
              type="text"
              placeholder="Search trending styles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-white placeholder-white/60 font-medium focus:outline-none focus:ring-4 focus:ring-yellow-400/50 focus:border-yellow-400 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredTrends.map((trend, index) => (
            <div
              key={trend.id}
              className={`group cursor-pointer transform transition-all duration-700 hover:scale-110 hover:z-30 relative ${
                index % 3 === 0 ? 'rotate-1 hover:rotate-0' : 
                index % 3 === 1 ? '-rotate-1 hover:rotate-0' : 
                'rotate-0 hover:rotate-1'
              }`}
              onClick={() => handleImageClick(trend)}
              onMouseEnter={() => setHoveredCard(trend.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Card Container */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden border-3 border-white/30 group-hover:border-yellow-400 shadow-2xl group-hover:shadow-3xl transition-all duration-500 relative">
                
                {/* Image Container - 1:1 Aspect Ratio */}
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={trend.image}
                    alt={trend.title}
                    fill
                    className="object-cover group-hover:scale-125 transition-transform duration-700"
                  />
                  
                  {/* Gradient Blur Overlay at Bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-300"></div>
                  
                

                  {/* Hover Sparkles Effect */}
                  {hoveredCard === trend.id && (
                    <>
                      <div className="absolute top-4 left-4 animate-pulse">
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div className="absolute bottom-4 right-4 animate-bounce" style={{ animationDelay: '0.5s' }}>
                        <Star className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping">
                        <Heart className="w-8 h-8 text-pink-400" />
                      </div>
                    </>
                  )}
                  
                  {/* Title Overlay - Bottom with Blur Effect */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className=" bg-transparent rounded-2xl px-2 py-1 border border-white/20 transform group-hover:scale-105 transition-all duration-300">
                      <h3 className="text-white font-black text-md leading-tight line-clamp-2 drop-shadow-lg">
                        {trend.title}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-white/80 text-xs font-semibold">
                          ✨ Try This Style
                        </span>
                        <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center group-hover:animate-spin">
                          <Sparkles className="w-3 h-3 text-black" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Action Button */}
              <div className="absolute -bottom-3 -right-3 opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-500 z-20">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce border-4 border-white">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results State */}
        {filteredTrends.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
              <Search className="w-12 h-12 text-white/60" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4">🔍 No Styles Found!</h3>
            <p className="text-white/80 text-lg">Try a different search term to discover amazing AI styles</p>
          </div>
        )}
      </div>

      {/* Bottom CTA Section */}
      <div className="relative z-10 bg-gradient-to-r from-indigo-500 to-purple-600 transform skew-y-2 origin-bottom-right mt-20">
        <div className="transform -skew-y-2 py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-4xl font-black text-white mb-6 drop-shadow-lg">
              🚀 Ready to Create Your Own Magic?
            </h3>
            <p className="text-xl text-white/90 mb-8 font-semibold">
              Click on any style above to start generating your personalized AI art!
            </p>
            <div className="flex justify-center space-x-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-4 h-4 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }}></div>
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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .border-3 {
          border-width: 3px;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default TrendingPage;
