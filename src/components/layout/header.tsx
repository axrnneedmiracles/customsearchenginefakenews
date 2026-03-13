'use client';

import { Button } from '@/components/ui/button';
import { Users, Shield, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SentinelMenu } from './sentinel-menu';
import { useUI } from '@/context/ui-context';
import Link from 'next/link';

export function Header() {
  const router = useRouter();
  const { setChatOpen } = useUI();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/app-debug.zip';
    link.setAttribute('download', 'app-debug.zip');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const menuItems = [
    { label: 'Scan Messages', onClick: () => router.push('/') },
    { label: 'AI Image Detector', onClick: () => router.push('/detector') },
    { label: 'On Call Detection', onClick: () => router.push('/call-scanner') },
    { label: 'Fake News Detector', onClick: () => router.push('/fake-news') },
    { label: 'Community Hub', onClick: () => router.push('/community') },
    { label: 'Web Extension', onClick: () => router.push('/extension') },
    { label: 'Contact Us', onClick: () => setChatOpen(true) }
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between p-6 pointer-events-none">
      <div className="flex items-center gap-4 pointer-events-auto">
        <Link href="/" className="flex items-center gap-4 cursor-target">
          <img src="/logo.gif" alt="Sentinel Logo" className="h-10 w-auto" />
        </Link>
        <div className="hidden md:flex">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload}
            className="relative bg-primary/10 border-primary/40 hover:bg-primary/20 text-[11px] font-black tracking-widest rounded-full h-10 px-5 cursor-target backdrop-blur-md overflow-hidden transition-all hover:scale-105 active:scale-95 group"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[header-shimmer_2s_infinite] pointer-events-none" />
            
            <Download className="mr-2 h-4 w-4 text-primary" />
            <span className="relative z-10">DOWNLOAD OUR APP</span>
            
            {/* Subtle pulse for visibility */}
            <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse pointer-events-none" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 pointer-events-auto">
        <Link href="/community">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-primary/20 hover:text-primary-foreground transition-colors cursor-target text-white hidden sm:flex h-10 w-10 rounded-full border border-white/10 bg-black/20 backdrop-blur-md"
          >
            <Users className="w-5 h-5" />
            <span className="sr-only">Community Hub</span>
          </Button>
        </Link>
        <Link href="/admin">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-destructive/20 hover:text-destructive transition-colors cursor-target text-white hidden sm:flex h-10 w-10 rounded-full border border-white/10 bg-black/20 backdrop-blur-md"
          >
            <Shield className="w-5 h-5" />
            <span className="sr-only">Admin Panel</span>
          </Button>
        </Link>
        
        <SentinelMenu items={menuItems} />
      </div>

      <style jsx>{`
        @keyframes header-shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </header>
  );
}
