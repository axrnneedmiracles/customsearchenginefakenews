'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ChatBotDialog } from '../chat/chatbot-dialog';
import { Button } from '../ui/button';

export function ScamBot() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 right-0 z-[90] w-[350px] h-[450px] pointer-events-none flex flex-col items-end justify-end">
        <div className="relative w-full h-full pointer-events-auto">
          {/* Interactive Forensic Robot */}
          <div className="absolute inset-0 w-full h-full">
            {/* @ts-ignore */}
            <spline-viewer 
              url="https://prod.spline.design/zITMTvB3PTuUZ1AU/scene.splinecode"
              className="w-full h-full"
            />
          </div>
          
          {/* ASK NAYRA Button - Positioned to cover Spline Logo */}
          <div className="absolute bottom-0 right-0 p-4 w-full flex justify-end z-[100]">
            <Button 
              onClick={() => setChatOpen(true)}
              className="group relative h-16 w-full max-w-[280px] bg-primary hover:bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-2xl shadow-[0_10px_30px_rgba(103,58,183,0.5)] border-2 border-white/20 transition-all hover:scale-105 active:scale-95 cursor-target flex items-center justify-center gap-3 overflow-hidden opacity-100 hover:opacity-100"
            >
              {/* Animated Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
              
              <span className="text-xl">ASK NAYRA</span>
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
              
              <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>
        </div>
      </div>

      <ChatBotDialog open={chatOpen} onClose={() => setChatOpen(false)} />

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
  );
}
