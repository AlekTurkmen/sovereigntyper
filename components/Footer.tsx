import Link from "next/link";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "./ui/hover-card";
import { HandHeart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function Footer() {
  return (
    <footer className="mt-12 mb-4 text-sm opacity-50 text-[#777] text-center fixed bottom-0 left-0 right-0">
      <HoverCard>
        <HoverCardTrigger asChild>
          <a 
            href="https://x.com/AlekTurkmen" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-gray-200 transition-colors"
          >
            &copy; Alek Turkmen
          </a>
        </HoverCardTrigger>
        <HoverCardContent className="bg-[#1a1a1a] border-[#333] text-white w-52">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/alekturkmen.png" />
            <AvatarFallback>AT</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@alekturkmen</h4>
            <p className="text-sm">
              Founder / Engineer
            </p>
            <div className="flex items-center pt-2">
              {/* <HandHeart className="mr-2 h-4 w-4 opacity-70" />{" "} */}
              <span className="text-xs text-muted-foreground">
                Made with ♡ in NYC
              </span>
            </div>
          </div>
        </div>
        </HoverCardContent>
      </HoverCard>
    </footer>
  );
} 