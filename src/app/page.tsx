'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { BackgroundAnimation } from '@/components/background-animation';
import { Header } from '@/components/layout/header';
import { ScanForm } from '@/components/scan/scan-form';
import { ScanResultDisplay } from '@/components/scan/scan-result';
import { ImageDetectorSheet } from '@/components/detector/image-detector-sheet';
import { CommunitySheet } from '@/components/community/community-sheet';
import { AboutSheet } from '@/components/about/about-sheet';
import { scanMessage } from '@/lib/actions';
import type { ScanResult } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { HomeIcon } from 'lucide-react';
import MagicBento from '@/components/ui/magic-bento';
import { ImageDetectorPage } from '@/components/detector/image-detector-page';
import { CommunityPage, type ReportFormData } from '@/components/community/community-page';
import { AboutPage } from '@/components/about/about-page';
import AdminPage from './admin/page';
import AdminLogin from './admin/login/page';
import { useAdmin } from '@/context/admin-context';
import { incrementScanCount, incrementVisitorCount } from '@/lib/firebase-actions';
import { ScreenshotScannerPage } from '@/components/detector/screenshot-scanner-page';
import { MoreOptionsPage } from '@/components/options/more-options-page';
import { CallScannerPage } from '@/components/detector/call-scanner-page';
import { ExtensionPage } from '@/components/extension/extension-page';

type ScanStatus = 'idle' | 'scanning' | 'success' | 'error';
type View = 'home' | 'detector' | 'community' | 'about' | 'admin' | 'admin-login' | 'more-options' | 'screenshot' | 'call-scanner' | 'extension';

export default function Home() {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [detectorOpen, setDetectorOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<View>('home');
  const [prefilledReport, setPrefilledReport] = useState<Partial<ReportFormData> | null>(null);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    incrementVisitorCount();
  }, []);

  const handleScan = async (text: string) => {
    if (!text.trim()) return;

    setStatus('scanning');
    setResult(null);

    const scanResult = await scanMessage(text);
    
    if (scanResult.error) {
      toast({
        variant: 'destructive',
        title: 'Scan Error',
        description: scanResult.error,
      });
      setStatus('error');
    } else {
      setResult(scanResult);
      setStatus('success');
      incrementScanCount();
    }
  };
  
  const getBackgroundColor = () => {
    if (status === 'success' && result) {
      return result.isMalicious
        ? 'bg-destructive/20'
        : 'bg-green-500/20';
    }
    return 'bg-transparent';
  };

  const handleReset = () => {
    setStatus('idle');
    setResult(null);
    setCurrentView('home');
  };
  
  const handleWarnCommunity = () => {
    if (result && result.isMalicious) {
      setPrefilledReport({
        title: 'Warning',
        url: result.url,
        rating: 1,
        comment: '',
      });
      setCurrentView('community');
    }
  };
  
  const handleAdminClick = () => {
    if (isAdmin) {
      setCurrentView('admin');
    } else {
      setCurrentView('admin-login');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'detector':
        return <ImageDetectorPage />;
      case 'screenshot':
        return <ScreenshotScannerPage />;
      case 'call-scanner':
        return <CallScannerPage />;
      case 'extension':
        return <ExtensionPage />;
      case 'community':
        return <CommunityPage prefilledReport={prefilledReport} onFormSubmit={() => setPrefilledReport(null)} />;
      case 'about':
        return <AboutPage />;
      case 'more-options':
        return <MoreOptionsPage onOptionClick={(id) => setCurrentView(id as View)} />;
      case 'admin-login':
        return <AdminLogin onLoginSuccess={() => setCurrentView('admin')} />;
      case 'admin':
        return isAdmin ? <AdminPage /> : <AdminLogin onLoginSuccess={() => setCurrentView('admin')} />;
      case 'home':
      default:
        return (
            <>
              {status === 'idle' ? (
                <>
                  <div className="relative w-full max-w-3xl text-center space-y-2">
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <Image
                          src="/logo.gif"
                          alt="Background Logo"
                          width={150}
                          height={150}
                          unoptimized
                          className="opacity-10"
                        />
                      </div>
                      <h2 className="relative text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-accent py-2 bg-[length:200%_auto] animate-background-pan" style={{ textShadow: '0 0 10px hsl(var(--primary) / 0.5), 0 0 20px hsl(var(--accent) / 0.5)' }}>SENTINEL SCAN</h2>
                      <p className="relative text-lg md:text-xl text-muted-foreground">
                          GRAVEYARD OF SCAMMERS
                      </p>
                  </div>
                  <ScanForm onScan={handleScan} loading={status === 'scanning'} />
                </>
              ) : (
                 <ScanForm onScan={handleScan} loading={status === 'scanning'} />
              )}
    
              <ScanResultDisplay result={result} status={status} onWarnCommunity={handleWarnCommunity} />

              {status === 'idle' && <MagicBento onCardClick={(v) => setCurrentView(v as View)} />}
            </>
        );
    }
  }

  const showHomeButton = currentView !== 'home' || (status !== 'idle' && status !== 'scanning');

  return (
    <div className={`min-h-screen w-full relative transition-colors duration-1000 ${getBackgroundColor()}`}>
      <BackgroundAnimation />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header 
          onDetectorClick={() => setDetectorOpen(true)} 
          onCommunityClick={() => setCommunityOpen(true)} 
          onAboutClick={() => setAboutOpen(true)}
          onAdminClick={handleAdminClick}
        />
        <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-start gap-12">
          {showHomeButton && (
            <div className="w-full max-w-3xl flex justify-start">
                <Button onClick={handleReset} variant="outline" className="bg-card/50 backdrop-blur-sm cursor-target">
                    <HomeIcon className="mr-2 h-4 w-4"/>
                    Home
                </Button>
            </div>
          )}
          {renderContent()}
        </main>
        <footer className="text-center p-4 text-muted-foreground text-sm">
          POWERED BY AXRN. Stay Safe Online.
        </footer>
      </div>

      <ImageDetectorSheet open={detectorOpen} onOpenChange={setDetectorOpen} />
      <CommunitySheet open={communityOpen} onOpenChange={setCommunityOpen} />
      <AboutSheet open={aboutOpen} onOpenChange={setAboutOpen} />
    </div>
  );
}
