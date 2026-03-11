'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MenuItem {
  label: string;
  onClick: () => void;
}

interface SentinelMenuProps {
  items: MenuItem[];
}

export function SentinelMenu({ items }: SentinelMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const tl = gsap.timeline();
      
      // Fade in the light backdrop
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.4,
        display: 'block',
        ease: 'power2.out',
      });

      // Slide in the panel from the right
      tl.to(panelRef.current, {
        x: 0,
        duration: 0.6,
        ease: 'expo.out',
      }, '-=0.3');

      // Staggered item entrance
      tl.fromTo(itemsRef.current, 
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' },
        '-=0.4'
      );
    } else {
      document.body.style.overflow = '';
      const tl = gsap.timeline();

      tl.to(panelRef.current, {
        x: '100%',
        duration: 0.4,
        ease: 'power2.in',
      });

      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        display: 'none',
        ease: 'power2.in',
      }, '-=0.2');
    }
  }, [isOpen]);

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        className="h-10 w-10 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md text-primary-foreground hover:bg-primary/30 transition-all z-[70] relative cursor-target"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Background Overlay (Click to close) */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[60] hidden transition-all duration-500"
        onClick={handleToggle}
      />

      {/* Sliding Side Panel */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-full w-full max-w-[320px] md:max-w-[400px] bg-background/80 backdrop-blur-3xl border-l border-primary/20 z-[65] flex flex-col p-8 pt-24 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] translate-x-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-3 flex-grow overflow-y-auto pr-2 custom-scrollbar">
          {items.map((item, index) => (
            <div
              key={item.label}
              ref={(el) => { if (el) itemsRef.current[index] = el; }}
              className="group"
            >
              <button
                onClick={() => {
                  item.onClick();
                  handleToggle();
                }}
                className="w-full text-left p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-primary/10 hover:border-primary/30 transition-all flex items-center justify-between group cursor-target overflow-hidden relative"
              >
                <div className="relative z-10">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] block mb-0.5 opacity-60">
                    0{index + 1}
                  </span>
                  <span className="text-lg md:text-xl font-medium tracking-tight text-white/90 group-hover:text-primary transition-colors">
                    {item.label}
                  </span>
                </div>
                
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all relative z-10" />
              </button>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-primary/10 mt-auto">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
            Sentinel Forensic Navigation
          </p>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary) / 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.4);
        }
      `}</style>
    </>
  );
}
