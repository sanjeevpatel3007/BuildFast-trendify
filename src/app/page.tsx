"use client";
import { useState } from "react";
import LandingPage from "@/components/LandingPage";
import AllTrends from "@/components/AllTrends";

export default function Home() {
  const [showGallery, setShowGallery] = useState(false);

  const handleShowGallery = () => {
    setShowGallery(true);
  };

  const handleBackToLanding = () => {
    setShowGallery(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {!showGallery ? (
        <LandingPage onShowGallery={handleShowGallery} />
      ) : (
        <AllTrends onBack={handleBackToLanding} />
      )}
    </div>
  );
}
