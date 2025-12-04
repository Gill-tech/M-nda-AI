import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { VoiceBot } from "./VoiceBot";

export function FloatingVoiceButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center group"
        aria-label="Open voice assistant"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-card border border-border text-sm text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
          Ask Múnda AI
        </span>
      </button>

      {/* Voice Bot Modal */}
      <VoiceBot isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}