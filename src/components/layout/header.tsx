'use client';

import { Button } from '@/components/ui/button';
import { Users, Shield } from 'lucide-react';
import { type View } from '@/app/page';
import { SentinelMenu } from './sentinel-menu';

interface HeaderProps {
  onDetectorClick: () => void;
  onCommunityClick: () => void;
  onAboutClick: () => void;
  onAdminClick: () => void;
  onNavigate: (view: View) => void;
  onContactClick: () => void;
}

export function Header({ onAdminClick, onNavigate, onContactClick }: HeaderProps) {
  const menuItems = [
    { label: 'Scan Messages', onClick: () => onNavigate('home') },
    { label: 'AI Image Detector', onClick: () => onNavigate('detector') },
    { label: 'On Call Detection', onClick: () => onNavigate('call-scanner') },
    { label: 'Fake News Detector', onClick: () => onNavigate('fake-news') },
    { label: 'Community Hub', onClick: () => onNavigate('community') },
    { label: 'Web Extension', onClick: () => onNavigate('extension') },
    { label: 'Contact Us', onClick: onContactClick }
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between p-6 pointer-events-none">
      <div className="flex items-center gap-4 pointer-events-auto cursor-target" onClick={() => onNavigate('home')}>
        <img src="/logo.gif" alt="Sentinel Logo" className="h-10 w-auto" />
      </div>

      <div className="flex items-center gap-3 pointer-events-auto">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onNavigate('community')} 
          className="hover:bg-primary/20 hover:text-primary-foreground transition-colors cursor-target text-white hidden sm:flex h-10 w-10 rounded-full border border-white/10 bg-black/20 backdrop-blur-md"
        >
          <Users className="w-5 h-5" />
          <span className="sr-only">Community Hub</span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onAdminClick} 
          className="hover:bg-destructive/20 hover:text-destructive transition-colors cursor-target text-white hidden sm:flex h-10 w-10 rounded-full border border-white/10 bg-black/20 backdrop-blur-md"
        >
          <Shield className="w-5 h-5" />
          <span className="sr-only">Admin Panel</span>
        </Button>
        
        <SentinelMenu items={menuItems} />
      </div>
    </header>
  );
}
