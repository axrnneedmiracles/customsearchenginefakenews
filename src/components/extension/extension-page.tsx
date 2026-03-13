'use client';

import { ShieldCheck, Download, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';
import SplitText from '@/components/ui/split-text';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const PLATFORMS = [
  "Instagram", "WhatsApp", "Facebook", "X (Twitter)", "Discord", "Gmail"
];

export function ExtensionPage() {
  const { toast } = useToast();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/webextension/sentinelguard.zip';
    link.setAttribute('download', 'sentinelguard.zip');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Started",
      description: "The Sentinel Scan extension package (sentinelguard.zip) is downloading.",
    });
  };

  return (
    <div className="w-full max-w-4xl space-y-12 animate-in fade-in zoom-in-95">
      <div className="flex flex-col items-center text-center space-y-8 py-12">
        <Badge className="bg-accent/20 text-accent border-accent/20 px-4 py-1 text-sm">
          V1.2.0 NOW LIVE
        </Badge>
        
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-primary-foreground leading-tight">
            <SplitText 
              text="PROTECTION THAT" 
              textAlign="center"
              delay={40}
              className="block"
            />
            <SplitText 
              text="FOLLOWS YOU." 
              textAlign="center"
              delay={40}
              className="text-primary block"
            />
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Stop checking links manually. Our Chrome extension brings the power of Sentinel Scan directly to your browser, scanning for threats in real-time as you browse.
          </p>
        </div>

        <div className="space-y-4 w-full max-w-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Supported Ecosystems</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                {PLATFORMS.map((p) => (
                    <span key={p} className="text-xs font-bold text-muted-foreground/80 hover:text-primary transition-colors cursor-default">
                        {p}
                    </span>
                ))}
            </div>
        </div>
        
        <div className="pt-4 flex flex-col items-center gap-6">
          <Button 
            size="lg" 
            onClick={handleDownload}
            className="group relative h-20 px-12 text-2xl font-black rounded-2xl overflow-hidden cursor-target transition-all hover:scale-105 active:scale-95 bg-primary hover:bg-primary/90 shadow-[0_0_40px_rgba(103,58,183,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            
            <Download className="mr-4 h-8 w-8" />
            DOWNLOAD NOW
            
            <div className="absolute -inset-1 bg-primary/30 rounded-2xl blur opacity-0 group-hover:opacity-100 animate-pulse transition-opacity" />
          </Button>
          
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest opacity-60">
                Available for Chrome, Brave & Edge
            </p>
            
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="link" className="text-accent hover:text-accent/80 text-[10px] uppercase tracking-[0.2em] font-black cursor-target">
                        <Info className="w-3 h-3 mr-1" />
                        Privacy & Data Policy
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-card/95 backdrop-blur-2xl border-primary/20 max-w-md rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-primary uppercase font-black tracking-widest text-sm">
                            <ShieldCheck className="w-5 h-5" />
                            Data Storage Policy
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 text-sm text-muted-foreground leading-relaxed pt-4">
                        <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl space-y-3">
                            <p>All processing and storage occur locally on the user’s computer.</p>
                            <p>No user conversations are uploaded to any server.</p>
                            <p>No personal messages are stored outside the user's device.</p>
                            <p>Temporary data used for analysis is cleared automatically when no longer required.</p>
                        </div>
                        <p className="text-center font-black text-primary-foreground uppercase tracking-tighter text-base bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            This ensures full control of data remains with the user.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
