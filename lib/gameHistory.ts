import { GameHistoryItem } from "./types";
import Cookies from "js-cookie";

const HISTORY_COOKIE_KEY = "typing_game_history";
const MAX_HISTORY_ITEMS = 50; // Limit the number of history items to prevent cookie size issues

// Load game history from cookies
export function loadGameHistory(): GameHistoryItem[] {
  try {
    const historyJson = Cookies.get(HISTORY_COOKIE_KEY);
    if (!historyJson) return [];
    return JSON.parse(historyJson);
  } catch (error) {
    console.error("Failed to load game history:", error);
    return [];
  }
}

// Save game history to cookies
export function saveGameHistory(history: GameHistoryItem[]): void {
  try {
    // Limit the size of history to prevent cookie size issues
    const limitedHistory = history.slice(0, MAX_HISTORY_ITEMS);
    Cookies.set(HISTORY_COOKIE_KEY, JSON.stringify(limitedHistory), {
      expires: 365, // Store for 1 year
      sameSite: "Strict"
    });
  } catch (error) {
    console.error("Failed to save game history:", error);
  }
}

// Add a new game to history
export function addGameToHistory(item: Omit<GameHistoryItem, "id" | "date" | "time">): GameHistoryItem {
  const history = loadGameHistory();
  
  // Generate current date and time
  const now = new Date();
  const date = `${now.getMonth() + 1}.${now.getDate()}`; // Removed the year
  
  // Format time to remove leading zero
  const hours = now.getHours() % 12 || 12; // Convert to 12-hour format
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
  const time = `${hours}:${minutes} ${ampm}`;
  
  // Create new history item
  const newItem: GameHistoryItem = {
    id: Date.now().toString(),
    date,
    time,
    ...item
  };
  
  // Add to beginning of history
  const updatedHistory = [newItem, ...history];
  saveGameHistory(updatedHistory);
  
  return newItem;
}

// Clear game history
export function clearGameHistory(): void {
  Cookies.remove(HISTORY_COOKIE_KEY);
}

// Delete a specific history item
export function deleteHistoryItem(id: string): void {
  const history = loadGameHistory();
  const updatedHistory = history.filter(item => item.id !== id);
  saveGameHistory(updatedHistory);
} 