'use client';

import { Button } from '@/components/ui/button';
import { Info, Shield } from 'lucide-react';
import { type View } from '@/app/page';
import { StaggeredMenu } from '@/components/ui/staggered-menu';

interface HeaderProps {
  onDetectorClick: () => void;
  onCommunityClick: () => void;
  onAboutClick: () => void;
  onAdminClick: () => void;
  onNavigate: (view: View) => void;
  onContactClick: () => void;
}

export function Header({ onAboutClick, onAdminClick, onNavigate, onContactClick }: HeaderProps) {
  const menuItems = [
    { label: 'Scan Messages', onClick: () => onNavigate('home') },
    { label: 'AI Image Detector', onClick: () => onNavigate('detector') },
    { label: 'On Call Detection', onClick: () => onNavigate('call-scanner') },
    { label: 'Community Hub', onClick: () => onNavigate('community') },
    { label: 'Web Extension', onClick: () => onNavigate('extension') },
    { label: 'Contact Us', onClick: onContactClick }
  ];

  const socialItems = [
    { label: 'GitHub', link: '#' },
    { label: 'Twitter', link: '#' },
    { label: 'LinkedIn', link: '#' }
  ];

  return (
    <div className="relative w-full">
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#ffffff"
        openMenuButtonColor="#000000"
        changeMenuColorOnOpen={true}
        colors={['#B19EEF', '#5227FF', '#1a1a1a']}
        logoUrl="/logo.gif"
        accentColor="#d129ff"
        isFixed={true}
      />
      
      {/* Absolute overlay for additional buttons that aren't part of the custom menu component */}
      <div className="absolute top-8 right-32 flex items-center gap-2 z-30 pointer-events-auto">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onAboutClick} 
          className="hover:bg-primary/20 hover:text-primary-foreground transition-colors cursor-target text-white hidden sm:flex"
        >
          <Info className="w-5 h-5" />
          <span className="sr-only">About Us</span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onAdminClick} 
          className="hover:bg-destructive/20 hover:text-destructive transition-colors cursor-target text-white hidden sm:flex"
        >
          <Shield className="w-5 h-5" />
          <span className="sr-only">Admin Panel</span>
        </Button>
      </div>
    </div>
  );
}
