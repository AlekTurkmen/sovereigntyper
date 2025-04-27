"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { quotes, Quote } from "@/lib/quotes";

export default function TypingGame() {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [errors, setErrors] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [typingTime, setTypingTime] = useState("0:00");
  const [typedCharsStatus, setTypedCharsStatus] = useState<('correct' | 'incorrect' | 'pending')[]>([]);
  
  const quoteContainerRef = useRef<HTMLDivElement>(null);
  const quoteDisplayRef = useRef<HTMLDivElement>(null);

  // Initialize or reset the game
  const startGame = () => {
    // Select a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const newQuote = quotes[randomIndex];
    setCurrentQuote(newQuote);
    
    // Reset game state
    setStartTime(null);
    setEndTime(null);
    setErrors(0);
    setCharIndex(0);
    setIsTyping(false);
    setProgress(0);
    setShowStats(false);
    setTypingTime("0:00");
    setTypedCharsStatus(new Array(newQuote.text.length).fill('pending'));
    
    // Set focus to the quote container after a short delay to ensure DOM is ready
    setTimeout(() => {
      if (quoteContainerRef.current) {
        quoteContainerRef.current.focus();
      }
    }, 10);
  };

  // Format the quote for display with spans for each character
  const formatQuote = () => {
    if (!currentQuote || !quoteDisplayRef.current) return;
    
    quoteDisplayRef.current.innerHTML = '';
    const quoteDiv = document.createElement('div');
    
    currentQuote.text.split('').forEach((char, index) => {
      const charSpan = document.createElement('span');
      charSpan.innerText = char;
      
      // Apply styles directly to elements
      if (index === 0) {
        charSpan.style.color = '#aaa'; // Current character
        charSpan.style.position = 'relative';
        charSpan.style.borderBottom = '2px solid #666'; // Changed from yellow to gray
        charSpan.classList.add('current-char'); // For cursor animation
      } else {
        charSpan.style.color = '#555'; // Pending characters
      }
      
      quoteDiv.appendChild(charSpan);
    });
    
    quoteDisplayRef.current.appendChild(quoteDiv);
  };

  // Handle key presses
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!currentQuote || charIndex >= currentQuote.text.length || e.ctrlKey || e.altKey || e.metaKey) {
      return;
    }
    
    // Start timer on first keystroke
    if (!isTyping) {
      setIsTyping(true);
      setStartTime(new Date());
    }
    
    const allCharacters = quoteDisplayRef.current?.querySelectorAll('span');
    if (!allCharacters) return;
    
    const expectedKey = currentQuote.text[charIndex];
    
    // Only process alphanumeric, space, and punctuation keys
    if (e.key.length === 1 || e.key === 'Space' || e.key === 'Backspace') {
      const pressedKey = e.key === 'Space' ? ' ' : e.key;
      
      if (pressedKey === expectedKey) {
        // Correct key
        allCharacters[charIndex].style.color = 'rgba(144, 238, 144, 0.7)'; // Light green
        allCharacters[charIndex].classList.remove('current-char');
        
        // Update status array
        const newStatus = [...typedCharsStatus];
        newStatus[charIndex] = 'correct';
        setTypedCharsStatus(newStatus);
        
        setCharIndex(charIndex + 1);
        
        // Update progress bar
        const newProgress = ((charIndex + 1) / currentQuote.text.length) * 100;
        setProgress(newProgress);
      } else if (e.key === 'Backspace' && charIndex > 0) {
        // Backspace - go back one character if possible
        const newCharIndex = charIndex - 1;
        setCharIndex(newCharIndex);
        
        // Restore previous character styling
        if (allCharacters[newCharIndex]) {
          const prevCharStyle = allCharacters[newCharIndex].style;
          prevCharStyle.color = '#aaa';
          prevCharStyle.position = 'relative';
          prevCharStyle.borderBottom = '2px solid #666'; // Changed from yellow to gray
          allCharacters[newCharIndex].classList.add('current-char');
          
          // Remove any incorrect styling
          if (allCharacters[newCharIndex].style.textDecoration) {
            allCharacters[newCharIndex].style.textDecoration = 'none';
          }
          
          // Reset status to pending for this character
          const newStatus = [...typedCharsStatus];
          newStatus[newCharIndex] = 'pending';
          setTypedCharsStatus(newStatus);
        }
        
        // Update progress bar to go backwards
        const newProgress = (newCharIndex / currentQuote.text.length) * 100;
        setProgress(newProgress);
      } else {
        // Incorrect key
        allCharacters[charIndex].style.color = 'rgba(231, 111, 81, 0.7)'; // Light red
        allCharacters[charIndex].style.textDecoration = 'underline';
        allCharacters[charIndex].classList.remove('current-char');
        
        // Update status array
        const newStatus = [...typedCharsStatus];
        newStatus[charIndex] = 'incorrect';
        setTypedCharsStatus(newStatus);
        
        setErrors(errors + 1);
        setCharIndex(charIndex + 1);
        
        // Update progress bar
        const newProgress = ((charIndex + 1) / currentQuote.text.length) * 100;
        setProgress(newProgress);
      }
      
      // Update current character indicator
      if (charIndex + 1 < currentQuote.text.length) {
        const nextChar = allCharacters[charIndex + 1];
        if (nextChar) {
          nextChar.style.color = '#aaa';
          nextChar.style.position = 'relative';
          nextChar.style.borderBottom = '2px solid #666'; // Changed from yellow to gray
          nextChar.classList.add('current-char');
        }
      }
      
      // Check if typing is complete
      if (charIndex + 1 >= currentQuote.text.length) {
        const now = new Date();
        setEndTime(now);
        finishGame(now);
      }
      
      e.preventDefault();
    }
  };

  // Calculate results and show stats
  const finishGame = (endTimeValue: Date = new Date()) => {
    if (!startTime || !currentQuote) return;
    
    // Calculate time in minutes and format for display
    const timeElapsedMs = endTimeValue.getTime() - startTime.getTime();
    const timeElapsedMinutes = timeElapsedMs / 1000 / 60;
    
    // Format time as mm:ss
    const minutes = Math.floor(timeElapsedMs / 60000);
    const seconds = Math.floor((timeElapsedMs % 60000) / 1000);
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    setTypingTime(formattedTime);
    
    // Calculate WPM
    const words = currentQuote.text.split(' ').length;
    const calculatedWpm = Math.round(words / timeElapsedMinutes);
    setWpm(calculatedWpm);
    
    // Calculate accuracy
    const calculatedAccuracy = Math.max(0, Math.round(100 - (errors / currentQuote.text.length * 100)));
    setAccuracy(calculatedAccuracy);
    
    // Clear the quote display to prevent duplicate quotes
    if (quoteDisplayRef.current) {
      quoteDisplayRef.current.innerHTML = '';
    }
    
    // Show stats
    setShowStats(true);
  };
  
  // Go back to landing page
  const goHome = () => {
    window.location.reload();
  };

  // Add event listener for Enter key on results screen
  useEffect(() => {
    if (showStats) {
      const handleEnterKeyPress = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          startGame();
        }
      };
      
      window.addEventListener("keydown", handleEnterKeyPress);
      return () => window.removeEventListener("keydown", handleEnterKeyPress);
    }
  }, [showStats]);

  // Set up game on component mount
  useEffect(() => {
    startGame();
  }, []);

  // Format quote when current quote changes
  useEffect(() => {
    if (currentQuote) {
      formatQuote();
    }
  }, [currentQuote]);

  return (
    <div className="container max-w-4xl w-full px-4 mx-auto">
      {!showStats ? (
        <div className="game-container bg-[#1a1a1a] rounded-lg p-8 shadow-lg border border-[rgba(255,255,255,0.05)]">
          <div className="progress-container w-full h-1 bg-[#121212] rounded-sm mb-6 overflow-hidden border border-[#333]">
            <div 
              className="progress-bar h-full bg-[#777] rounded-sm transition-all duration-200 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div 
            ref={quoteContainerRef}
            className="quote-container relative mb-8 p-4 bg-[#121212] rounded-md border border-[#333]"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onClick={() => quoteContainerRef.current?.focus()}
          >
            <div 
              ref={quoteDisplayRef}
              className="quote-display text-lg leading-relaxed text-left font-light relative p-4 min-h-[150px] whitespace-pre-wrap break-words"
            />
          </div>
        </div>
      ) : (
        <div className="stats-container bg-[#1a1a1a] rounded-lg p-8 shadow-lg border border-[rgba(255,255,255,0.05)]">
          <h2 className="font-light text-center mb-8 text-3xl text-[#bbb]">Your Results</h2>
          
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            {/* Quote with character accuracy styling */}
            <div className="w-full p-6 bg-[#121212] rounded-md border border-[#333] flex flex-col">
              <div className="quote-text text-md leading-relaxed text-[#999] flex-grow">
                {currentQuote?.text.split('').map((char, i) => (
                  <span 
                    key={i} 
                    className={cn(
                      typedCharsStatus[i] === 'correct' ? 'char-correct' : 
                      typedCharsStatus[i] === 'incorrect' ? 'char-incorrect' : ''
                    )}
                  >
                    {char}
                  </span>
                ))}
              </div>
              <div className="quote-author text-right mt-4 italic text-[#777]">
                — {currentQuote?.author}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between bg-[#121212] rounded-md border border-[#333] p-6 mb-8">
            <div className="stat-item">
              <div className="stat-label text-sm opacity-70 text-[#999]">Your speed:</div>
              <div className="stat-value text-3xl font-medium text-white">{wpm} wpm</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-label text-sm opacity-70 text-[#999]">Time:</div>
              <div className="stat-value text-3xl font-medium text-white">{typingTime}</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-label text-sm opacity-70 text-[#999]">Accuracy:</div>
              <div className="stat-value text-3xl font-medium text-white">{accuracy}%</div>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <button 
              className="home-button bg-[#1a1a1a] text-white border border-[#444] py-3 px-6 text-base cursor-pointer rounded-md transition-all duration-300 ease-in-out hover:bg-[#252525]"
              onClick={goHome}
            >
              Home
            </button>
            <button 
              className="restart-button bg-[#1a1a1a] text-white border border-[#444] py-3 px-6 text-base cursor-pointer rounded-md transition-all duration-300 ease-in-out hover:bg-[#252525]"
              onClick={startGame}
            >
              Type Again
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .current-char {
          animation: blink 1s infinite;
        }
        
        .char-correct {
          border-bottom: 2px solid rgba(144, 238, 144, 0.3);
        }
        
        .char-incorrect {
          border-bottom: 2px solid rgba(231, 111, 81, 0.3);
        }
      `}</style>
      
      <footer className="mt-12 mb-4 text-sm opacity-50 text-[#777] text-center fixed bottom-0 left-0 right-0">
        Alek Turkmen &copy; 2025
      </footer>
    </div>
  );
} 