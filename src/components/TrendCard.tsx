import React from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import { Trend } from '@/lib/types';

interface TrendCardProps {
  trend: Trend;
  onClick: () => void;
}

function TrendCard({ trend, onClick }: TrendCardProps) {
  return (
    <div className="relative w-64 h-64 m-4 cursor-pointer group">
      {/* Full image */}
      <div className="relative h-full w-full overflow-hidden rounded-xl">
        <Image
          src={trend.image}
          alt={trend.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110 rounded-xl"
        />

        {/* Overlay: text + button */}
        <div className="absolute bottom-0 w-full bg-green-900/20 backdrop-blur-xs p-3 flex flex-col gap-2 rounded-b-xl">
          <h3 className="text-white font-semibold text-center">{trend.title}</h3>
          <Button
            onClick={onClick}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium rounded-md"
          >
            Generate Now
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TrendCard;
