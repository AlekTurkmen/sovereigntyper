# SovereignTyper Project Overview

SovereignTyper is a modern, minimalist typing practice application built with Next.js and React. The application helps users improve their typing speed and accuracy through a collection of achievement-oriented quotes.

## Tech Stack

- **Framework**: Next.js 15.3.1
- **Language**: TypeScript
- **UI Components**: Custom components from 21st dev and shadcn with Radix UI primitives
- **Styling**: Tailwind CSS with custom animations
- **State Management**: React hooks (useState, useEffect, useRef)
- **Data Persistence**: Cookies (js-cookie)

## User Flow

1. **Landing Page**: Users are greeted with a minimalist landing page featuring the application name and a prompt to press Enter to begin.

2. **Typing Experience**: Upon pressing Enter, users are presented with a random inspirational quote to type. As they type:
   - Correct characters are highlighted in green
   - Incorrect characters are highlighted in red
   - Current character position is indicated
   - Progress is tracked visually

3. **Results Screen**: After completing a quote, users see their performance metrics:
   - Words per minute (WPM)
   - Accuracy percentage
   - Time taken to complete

4. **Game History**: Previous typing session results are stored and displayed in a sidebar (on larger screens), showing:
   - Quote author
   - WPM achieved
   - Date and time of the session

## Data Management

- **Quotes**: Stored locally in a TypeScript file with over 100 inspirational quotes
- **Game History**: Stored in browser cookies with a maximum of 50 entries to prevent size issues
- **Session Data**: Managed through React state during typing sessions

## Technical Implementation Details

### TypingGame Component
The core of the application is the TypingGame component, which handles:
- Quote selection and display
- Keyboard input processing
- Character-by-character validation
- Timer management
- Performance metric calculation
- Game state management

### History Management
Game history is managed through browser cookies:
- Results are stored with a unique ID, author, date, time, WPM, and accuracy
- History is displayed in a side panel on larger screens
- Users can delete individual history entries

## Future Enhancement Possibilities

- Auth sign in
- Supabase backend implementation
- Custom quote add/remove
- Multiplayer competitions