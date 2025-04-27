"use client";

import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { useState, useEffect } from "react";

export default function Home() {
  const [isTypingMode, setIsTypingMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isTransitioning) {
        setIsTransitioning(true);
        // Wait for animation to complete before switching modes
        setTimeout(() => {
          setIsTypingMode(true);
        }, 1000); // Match this with the CSS transition duration
      }
    };

    if (!isTypingMode) {
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [isTypingMode, isTransitioning]);

  if (isTypingMode) {
    return (
      <BackgroundGradientAnimation interactive={false}>
        <div className="h-screen w-screen" />
      </BackgroundGradientAnimation>
    );
  }

  return (
    <BackgroundGradientAnimation isTransitioning={isTransitioning}>
      <div className={`absolute z-50 inset-0 flex flex-col items-center justify-center text-white font-bold px-4 pointer-events-none transition-all duration-1000 ease-in-out ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <p className="font-['Lexend'] bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20 py-4 text-3xl text-center md:text-4xl lg:text-7xl">
          SovereignTyper
        </p>
        <p className="font-['Lexend'] text-gray-400 mt-4 text-sm md:text-base">
          Press enter to get started
        </p>
      </div>
    </BackgroundGradientAnimation>
  );
}
