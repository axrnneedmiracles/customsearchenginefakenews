'use client';

import { Chrome, ShieldCheck, Zap, Download, ArrowRight, Puzzle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useToast } from '@/hooks/use-toast';

const features = [
  {
    icon: <ShieldCheck className="text-accent" />,
    title: 'Instant Block',
    description: 'Automatically stops you from visiting known malicious or phishing domains.',
  },
  {
    icon: <Zap className="text-primary" />,
    title: 'Real-time Analysis',
    description: 'Scans every link you hover over using our lightweight neural engine.',
  },
  {
    icon: <Puzzle className="text-purple-400" />,
    title: 'One-Click Community',
    description: 'Easily report scams you find directly to the Sentinel community hub.',
  },
];

export function ExtensionPage() {
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "The Sentinel Scan extension package is being prepared for your browser.",
    });
  };

  return (
    <div className="w-full max-w-4xl space-y-8 animate-in fade-in zoom-in-95">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <Badge className="bg-accent/20 text-accent border-accent/20 px-4 py-1 text-sm">
            V1.2.0 NOW LIVE
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-primary-foreground">
            PROTECTION THAT <br />
            <span className="text-primary">FOLLOWS YOU.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Stop checking links manually. Our Chrome extension brings the power of Sentinel Scan directly to your browser, scanning for threats in real-time as you browse.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              onClick={handleDownload}
              className="group relative h-16 px-10 text-xl font-bold rounded-xl overflow-hidden cursor-target transition-all hover:scale-105 active:scale-95 bg-primary hover:bg-primary/90"
            >
              {/* Animated Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              
              <Download className="mr-3 h-6 w-6 animate-bounce" />
              Download Now
              
              {/* Outer Pulse */}
              <div className="absolute -inset-1 bg-primary/30 rounded-xl blur opacity-0 group-hover:opacity-100 animate-pulse transition-opacity" />
            </Button>
          </div>
        </div>

        <Card className="bg-card/40 backdrop-blur-xl border-primary/20 shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="mx-auto bg-background/50 px-4 py-1 rounded-md text-[10px] text-muted-foreground font-mono truncate max-w-[200px]">
                https://suspicious-site.com/login
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative aspect-video bg-background/80 flex items-center justify-center p-8 group">
               <div className="absolute inset-0 bg-destructive/10 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="relative z-10 bg-destructive/20 border-2 border-destructive p-6 rounded-2xl shadow-2xl flex flex-col items-center text-center space-y-4 max-w-sm scale-90 md:scale-100">
                  <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground animate-bounce">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-black text-destructive-foreground uppercase italic">Sentinel Alert</h3>
                  <p className="text-sm font-medium">This site has been flagged as a known phishing portal. Connection severed.</p>
                  <Button variant="outline" size="sm" className="bg-background/20 border-white/20 text-white hover:bg-background/40">
                    Details
                  </Button>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        {features.map((feature, index) => (
          <Card key={index} className="bg-background/40 border-primary/10 hover:border-primary/30 transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
                {feature.icon}
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
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
