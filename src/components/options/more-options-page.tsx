'use client';

import { Chrome, PhoneCall, ShieldAlert, MailSearch } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface MoreOptionsPageProps {
  onOptionClick?: (id: string) => void;
}

const options = [
  {
    id: 'extension',
    icon: <Chrome className="text-primary w-6 h-6" />,
    title: 'Web Extension',
    description: 'Real-time phishing protection directly in your browser. Blocks malicious domains as you browse.',
    status: 'Live',
    action: 'Get Extension'
  },
  {
    id: 'call-scanner',
    icon: <PhoneCall className="text-primary w-6 h-6" />,
    title: 'On-Call Detection',
    description: 'AI-powered scanning for suspicious call transcripts and voice phishing indicators.',
    status: 'Live',
    action: 'Open Scanner'
  },
  {
    id: 'leaked-db',
    icon: <MailSearch className="text-primary w-6 h-6" />,
    title: 'Leaked DB Scan',
    description: 'Cross-reference your email address against massive datasets of known global data breaches.',
    status: 'Beta',
    action: 'Scan Now'
  },
];

export function MoreOptionsPage({ onOptionClick }: MoreOptionsPageProps) {
  return (
    <div className="w-full max-w-3xl space-y-8 animate-in fade-in zoom-in-95">
      <Card className="bg-card/30 backdrop-blur-lg border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-primary-foreground">
            <ShieldAlert className="text-primary w-8 h-8" />
            Advanced Security Hub
          </CardTitle>
          <CardDescription>
            Explore our roadmap for advanced forensic tools designed to keep you safe beyond simple link scanning.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {options.map((option, index) => (
            <Card key={index} className="bg-background/40 border-primary/10 hover:border-primary/30 transition-all flex flex-col">
              <CardHeader className="p-4">
                 <div className="p-3 bg-primary/10 rounded-full w-fit mb-3">
                    {option.icon}
                 </div>
                <CardTitle className="text-lg leading-tight">{option.title}</CardTitle>
                <Badge variant="secondary" className="w-fit text-[10px] h-4 px-1 mt-1 bg-accent/20 text-accent border-accent/20">
                    {option.status}
                </Badge>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {option.description}
                </p>
              </CardContent>
              <div className="p-4 pt-0">
                 <Button 
                    variant={option.status === 'Live' ? 'default' : 'outline'} 
                    size="sm" 
                    className="w-full cursor-target text-xs" 
                    disabled={option.status === 'Coming Soon'}
                    onClick={() => onOptionClick?.(option.id)}
                 >
                    {option.action}
                 </Button>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>
      <div className="text-center p-6 border-2 border-dashed border-primary/20 rounded-xl bg-primary/5">
        <h3 className="text-lg font-bold text-primary-foreground">Proactive Protection</h3>
        <p className="text-sm text-muted-foreground">We are constantly updating our databases and algorithms to detect the latest scam variants.</p>
      </div>
    </div>
  );
}
