'use client';

import { Sparkles, Bot } from 'lucide-react';
import { Button } from '../ui/button';

interface ScamBotProps {
  onOpenChat: () => void;
}

export function ScamBot({ onOpenChat }: ScamBotProps) {
  return (
    <>
      <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-bottom-10 fade-in duration-500">
        <div className="animate-float">
          <Button 
            onClick={onOpenChat}
            className="group relative h-11 px-5 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest rounded-2xl shadow-[0_10px_30px_rgba(103,58,183,0.4)] border-2 border-white/10 transition-all hover:scale-105 active:scale-95 cursor-target flex items-center justify-center gap-3 overflow-hidden"
          >
            {/* Animated Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
            
            <Bot className="w-5 h-5" />
            <span className="text-xs">ASK NAYRA</span>
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            
            {/* Outer Glow Pulse */}
            <div className="absolute -inset-1 bg-primary/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 animate-pulse transition-opacity" />
          </Button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
