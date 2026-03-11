'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Scan, Users, Info, Shield, Menu, PhoneCall, Chrome, MessageSquare, Landmark, Search } from 'lucide-react';
import ScrambledText from './ScrambledText';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { type View } from '@/app/page';

interface HeaderProps {
  onDetectorClick: () => void;
  onCommunityClick: () => void;
  onAboutClick: () => void;
  onAdminClick: () => void;
  onNavigate: (view: View) => void;
  onContactClick: () => void;
}

const MENU_ITEMS = [
  { id: 'home', label: 'Scan Messages', icon: <Search className="w-5 h-5" /> },
  { id: 'detector', label: 'AI Image Detector', icon: <Scan className="w-5 h-5" /> },
  { id: 'call-scanner', label: 'On-Call Detection', icon: <PhoneCall className="w-5 h-5" /> },
  { id: 'community', label: 'Community Hub', icon: <Users className="w-5 h-5" /> },
  { id: 'extension', label: 'Web Extension', icon: <Chrome className="w-5 h-5" /> },
];

export function Header({ onDetectorClick, onCommunityClick, onAboutClick, onAdminClick, onNavigate, onContactClick }: HeaderProps) {
  return (
    <header className="container mx-auto p-4 flex justify-between items-center">
      <div className="flex items-center gap-3 cursor-target" onClick={() => onNavigate('home')}>
        <Image
          src="/logo.gif" 
          alt="Sentinel Scan Logo"
          width={32}
          height={32}
          unoptimized
        />
        <ScrambledText
            radius={120}
            duration={1}
            speed={0.3}
            scrambleChars="*!#$:_"
            className="text-2xl font-bold tracking-widest text-primary-foreground"
        >
            SENTINEL SCAN
        </ScrambledText>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground hidden md:inline">Quick Access</span>
        <Button variant="ghost" size="icon" onClick={onAboutClick} className="hover:bg-primary/20 hover:text-primary-foreground transition-colors cursor-target">
          <Info className="w-5 h-5" />
          <span className="sr-only">About Us</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={onAdminClick} className="hover:bg-destructive/20 hover:text-destructive transition-colors cursor-target">
          <Shield className="w-5 h-5" />
          <span className="sr-only">Admin Panel</span>
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-primary/20 hover:text-primary-foreground transition-colors cursor-target border border-primary/20">
              <Menu className="w-6 h-6" />
              <span className="sr-only">Open Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-card/95 backdrop-blur-2xl border-l border-primary/20 w-80">
            <SheetHeader className="mb-8 border-b border-primary/10 pb-4">
              <SheetTitle className="text-2xl font-black tracking-widest text-primary uppercase">
                Navigation Hub
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-2">
              {MENU_ITEMS.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start gap-4 h-14 text-lg font-bold hover:bg-primary/10 hover:text-primary transition-all cursor-target group rounded-xl"
                  onClick={() => onNavigate(item.id as View)}
                >
                  <div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary/20 transition-colors">
                    {item.icon}
                  </div>
                  {item.label}
                </Button>
              ))}
              
              <div className="my-6 border-t border-primary/10 pt-6">
                <Button
                  variant="default"
                  className="w-full justify-start gap-4 h-16 text-lg font-black uppercase tracking-tighter bg-primary shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all cursor-target rounded-xl"
                  onClick={onContactClick}
                >
                  <div className="p-2 bg-white/10 rounded-lg">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  Contact Us
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
