"use client";

import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { useState, useEffect } from "react";
import TypingGame from "@/components/TypingGame";
import Footer from "@/components/Footer";

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
        }, 500); // Reduced from 1000ms to 500ms
      }
    };

    if (!isTypingMode) {
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [isTypingMode, isTransitioning]);

  return (
    <>
      {isTypingMode ? (
        <BackgroundGradientAnimation interactive={false}>
          <div className="h-screen w-screen flex items-center justify-center">
            <TypingGame />
          </div>
        </BackgroundGradientAnimation>
      ) : (
        <BackgroundGradientAnimation isTransitioning={isTransitioning}>
          <div className={`absolute z-50 inset-0 flex flex-col items-center justify-center text-white font-bold px-4 pointer-events-none transition-all duration-500 ease-in-out ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <p className="font-['Lexend'] bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20 py-4 text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl">
              SovereignTyper
            </p>
            <p className="font-['Lexend'] text-gray-400 mt-4 text-sm sm:text-base md:text-lg lg:text-xl">
              Press enter to get started
            </p>
          </div>
          <Footer />
        </BackgroundGradientAnimation>
      )}
    </>
  );
}
