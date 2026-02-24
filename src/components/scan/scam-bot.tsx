'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChatBotDialog } from '../chat/chatbot-dialog';

export function ScamBot() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[90] group flex flex-col items-center pointer-events-none">
        {/* Floating Label - Positioned higher above the robot */}
        <div 
          onClick={() => setChatOpen(true)}
          className="mb-2 px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 cursor-pointer pointer-events-auto border border-white/20 hover:scale-105 z-10"
        >
          Need Help?
        </div>

        {/* Transparent Robo GIF */}
        <div className="relative w-32 h-32 md:w-48 md:h-48 overflow-visible pointer-events-auto flex items-center justify-center">
          <Image
            src="/robo.gif"
            alt="Sentinel Assistant"
            width={192}
            height={192}
            unoptimized
            className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(132,0,255,0.4)]"
          />
        </div>
      </div>

      <ChatBotDialog open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
