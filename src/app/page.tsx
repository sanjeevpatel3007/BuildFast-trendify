"use client";
import { useState } from "react";
import TrendCard from "@/components/TrendCard";
import GenerateDialog from "@/components/GenerateDialog";
import data from "@/lib/data.json";
import { Trend } from "@/lib/types";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCardClick = (trend: Trend) => {
    setSelectedTrend(trend);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      {/* <header className="bg-white shadow-sm border-b flex flex-col-2 gap-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Trendify</h1>
          <p className="text-gray-600 mt-2">Your AI-powered trend tracker</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-gray-600 mt-2">Powered By <span className="text-green-600">Build Fast With AI</span></p>
        </div>
      </header> */}

    <LandingPage />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((trend) => (
            <TrendCard
              key={trend.id}
              trend={trend}
              onClick={() => handleCardClick(trend)}
            />
          ))}
        </div>
      </main>

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
}
