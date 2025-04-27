"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { GameHistoryItem } from "@/lib/types";
import { loadGameHistory, deleteHistoryItem } from "@/lib/gameHistory";

interface GameHistoryProps {
  showHistory: boolean;
}

export default function GameHistory({ showHistory }: GameHistoryProps) {
  const [history, setHistory] = useState<GameHistoryItem[]>([]);

  useEffect(() => {
    // Load history from cookies when component mounts or when showHistory changes
    if (showHistory) {
      setHistory(loadGameHistory());
    }
  }, [showHistory]);

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteHistoryItem(id);
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  if (!showHistory || history.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 w-48 z-10 hidden lg:block custom-scrollbar">
      <ScrollArea className="h-[60vh] pr-2" type="hover">
        <div className="space-y-3 pr-3">
          {history.map((game) => (
            <div key={game.id} className="border-l-2 border-[#333] pl-3 py-1 transition-colors hover:border-[#555] group">
              <div className="flex flex-col">
                <div className="flex justify-between items-center">
                  <span className="text-white text-xs font-medium truncate max-w-[100px]">{game.author}</span>
                  <div className="flex items-center">
                    <span className="text-white text-xs font-medium">{game.wpm}</span>
                    <button
                      onClick={(e) => handleDeleteItem(game.id, e)}
                      className="ml-2 text-[#777] hover:text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Delete history item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="text-[#777] text-[10px] flex items-center">
                  <span>{game.time}</span>
                  <span className="mx-1">•</span>
                  <span>{game.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <style jsx global>{`
        /* Custom scrollbar styling */
        .custom-scrollbar :global(::-webkit-scrollbar) {
          width: 2px;
        }
        
        .custom-scrollbar :global(::-webkit-scrollbar-track) {
          background: transparent;
        }
        
        .custom-scrollbar :global(::-webkit-scrollbar-thumb) {
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
        }
        
        .custom-scrollbar :global(*) {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.05) transparent;
        }
      `}</style>
    </div>
  );
} 