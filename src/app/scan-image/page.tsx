'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { scanImagePhase1, scanImagePhase2 } from '@/lib/scan-image-actions';
import type { ImageScanResult } from '@/lib/types';
import {
  Upload, AlertTriangle, CheckCircle2, ShieldAlert, Bot, Newspaper,
  ScanLine, ChevronDown, ChevronUp, Loader2, Zap, ClipboardPaste, Camera,
  Search,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Script from 'next/script';

type Phase = 'idle' | 'phase1' | 'phase1done' | 'phase2' | 'done' | 'error';

const STEPS = [
  { id: 'ai',   label: 'AI Image Detection',    icon: Bot,         color: '#8b5cf6', phase: 1 },
  { id: 'scam', label: 'Scam Text Detection',   icon: ShieldAlert, color: '#ef4444', phase: 2 },
  { id: 'news', label: 'Fake News Verification', icon: Newspaper,   color: '#f59e0b', phase: 2 },
];

function RiskGauge({ score, color }: { score: number; color: string }) {
  const pct = Math.min(100, Math.max(0, score));
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width="70" height="70" viewBox="0 0 70 70" className="shrink-0">
      <circle cx="35" cy="35" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
      <circle cx="35" cy="35" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 35 35)"
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }} />
      <text x="35" y="39" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">{pct}%</text>
    </svg>
  );
}

function Badge({ verdict }: { verdict: string }) {
  const MAP: Record<string, { bg: string; fg: string }> = {
    'AI DETECTED': { bg: 'rgba(139,92,246,0.25)', fg: '#c084fc' },
    'REAL PHOTO':  { bg: 'rgba(34,197,94,0.2)',   fg: '#4ade80' },
    'SCAM':        { bg: 'rgba(239,68,68,0.25)',   fg: '#f87171' },
    'SAFE':        { bg: 'rgba(34,197,94,0.2)',    fg: '#4ade80' },
    'VERIFIED':    { bg: 'rgba(34,197,94,0.2)',    fg: '#4ade80' },
    'FALSE':       { bg: 'rgba(239,68,68,0.25)',   fg: '#f87171' },
    'UNVERIFIED':  { bg: 'rgba(234,179,8,0.2)',    fg: '#facc15' },
    'SATIRE':      { bg: 'rgba(249,115,22,0.2)',   fg: '#fb923c' },
    'NO TEXT':     { bg: 'rgba(107,114,128,0.2)',  fg: '#9ca3af' },
    'DEBUNKED':    { bg: 'rgba(239,68,68,0.25)',   fg: '#f87171' },
    'AUTHENTIC':   { bg: 'rgba(34,197,94,0.2)',    fg: '#4ade80' },
  };
  const s = MAP[verdict.toUpperCase()] ?? { bg: 'rgba(255,255,255,0.1)', fg: '#e5e7eb' };
  return (
    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide"
      style={{ background: s.bg, color: s.fg, border: `1px solid ${s.fg}30` }}>
      {verdict}
    </span>
  );
}

function Card({ title, icon: Icon, color, open, onToggle, children }: any) {
  return (
    <div className="rounded-xl border overflow-hidden"
      style={{ borderColor: `${color}30`, background: 'rgba(6,0,16,0.7)', backdropFilter: 'blur(16px)' }}>
      <button onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-3">
          <div className="rounded-lg p-2" style={{ background: `${color}20` }}>
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
          <span className="font-semibold text-white">{title}</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>
      {open && <div className="px-4 pb-4 pt-1 border-t" style={{ borderColor: `${color}20` }}>{children}</div>}
    </div>
  );
}

function PhaseIndicator({ phase, currentPhase }: { phase: Phase; currentPhase: Phase }) {
  const phaseOrder: Phase[] = ['idle','phase1','phase1done','phase2','done'];
  const cur = phaseOrder.indexOf(currentPhase);

  return (
    <div className="flex items-center justify-center gap-2 text-xs">
      {/* Phase 1 */}
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-500 ${
        cur >= 1 ? 'opacity-100' : 'opacity-30'}`}
        style={{ background: cur >= 2 ? 'rgba(139,92,246,0.2)' : cur === 1 ? 'rgba(139,92,246,0.1)' : 'transparent',
          border: '1px solid rgba(139,92,246,0.3)', color: '#c084fc' }}>
        {cur >= 2 ? <CheckCircle2 className="h-3 w-3" /> : cur === 1 ? <Loader2 className="h-3 w-3 animate-spin" /> : <Bot className="h-3 w-3" />}
        <span>AI Detection</span>
      </div>

      <div className="w-6 h-px bg-white/20" />

      {/* Phase 2 */}
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-500 ${
        cur >= 3 ? 'opacity-100' : cur === 2 ? 'opacity-80' : 'opacity-30'}`}
        style={{ background: cur >= 4 ? 'rgba(239,68,68,0.2)' : cur >= 3 ? 'rgba(239,68,68,0.1)' : 'transparent',
          border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
        {cur >= 4 ? <CheckCircle2 className="h-3 w-3" /> : cur >= 3 ? <Loader2 className="h-3 w-3 animate-spin" /> : <ScanLine className="h-3 w-3" />}
        <span>Text Analysis</span>
      </div>
    </div>
  );
}

export default function ScanImagePage() {
  const [phase, setPhase]       = useState<Phase>('idle');
  const [preview, setPreview]   = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<ImageScanResult['aiDetection'] | null>(null);
  const [textResult, setTextResult] = useState<{ scam: ImageScanResult['scamDetection']; news: ImageScanResult['fakeNewsDetection'] } | null>(null);
  const [openCards, setOpenCards] = useState({ ai: true, scam: true, news: true });
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const runScans = useCallback(async (dataUri: string) => {
    setAiResult(null);
    setTextResult(null);

    // ── Phase 1: AI detection ──────────────────────────────
    setPhase('phase1');
    try {
      const ai = await scanImagePhase1(dataUri);
      setAiResult(ai);
      setPhase('phase1done');
    } catch {
      toast({ variant: 'destructive', title: 'AI scan failed', description: 'Could not complete AI image detection.' });
      setPhase('error');
      return;
    }

    // ── Phase 2: Text scan ─────────────────────────────────
    setPhase('phase2');
    try {
      const { scamDetection, fakeNewsDetection } = await scanImagePhase2(dataUri);
      setTextResult({ scam: scamDetection, news: fakeNewsDetection });
      setPhase('done');
    } catch {
      toast({ variant: 'destructive', title: 'Text scan failed', description: 'Could not complete scam/news analysis.' });
      setPhase('done'); // still show AI result
    }
  }, [toast]);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ variant: 'destructive', title: 'Invalid file', description: 'Please upload a JPG, PNG, or WebP image.' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ variant: 'destructive', title: 'File too large', description: 'Max size is 10MB.' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const uri = e.target?.result as string;
      setPreview(uri);
      runScans(uri);
    };
    reader.readAsDataURL(file);
  }, [runScans, toast]);

  // ── Global Ctrl+V paste listener ─────────────────────────
  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      if (phase === 'phase1' || phase === 'phase2') return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            toast({ title: '📋 Image pasted!', description: 'Starting scan...' });
            processFile(file);
          }
          return;
        }
      }
      toast({ variant: 'destructive', title: 'No image in clipboard', description: 'Copy an image first, then press Ctrl+V.' });
    };
    window.addEventListener('paste', handler);
    return () => window.removeEventListener('paste', handler);
  }, [phase, processFile, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const isScanning = phase === 'phase1' || phase === 'phase2';
  const toggle = (k: keyof typeof openCards) => setOpenCards(p => ({ ...p, [k]: !p[k] }));
  const reset = () => { setPhase('idle'); setPreview(null); setAiResult(null); setTextResult(null); if (fileRef.current) fileRef.current.value = ''; };

  // Overall score
  const overallScore = aiResult && textResult
    ? Math.round((aiResult.finalScore * 0.4) + (textResult.scam.riskScore * 0.35) + (textResult.news.riskScore * 0.25))
    : aiResult ? aiResult.finalScore : 0;
  const overallRisk = overallScore >= 70 ? 'DANGER' : overallScore >= 40 ? 'SUSPICIOUS' : 'SAFE';
  const riskColor = { SAFE: '#22c55e', SUSPICIOUS: '#f59e0b', DANGER: '#ef4444' }[overallRisk];

  return (
    <div className="w-full flex flex-col items-center gap-6 py-4 px-4">
      <style>{`
        @keyframes pulse-border { 0%,100%{border-color:rgba(139,92,246,0.4)}50%{border-color:rgba(139,92,246,0.9)} }
        .drop-active { animation: pulse-border 1.5s ease infinite; }
        @keyframes fade-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .fade-in { animation: fade-in 0.4s ease forwards; }
      `}</style>

      {/* Header */}
      <div className="text-center space-y-1 max-w-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-500 to-fuchsia-400">
          SCAN IMAGE
        </h1>
        <p className="text-muted-foreground text-sm">
          AI detection first — then text extracted and scanned for scams & fake news.
        </p>
      </div>

      {/* Upload zone — hide once done */}
      {phase === 'idle' && (
        <div className="w-full max-w-xl space-y-3 fade-in">
          {/* Drop zone */}
          <div
            onClick={() => fileRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            className={`w-full rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 relative overflow-hidden
              ${dragging ? 'drop-active scale-[1.02]' : 'border-primary/30 hover:border-primary/60'}`}
            style={{ background: dragging ? 'rgba(139,92,246,0.08)' : 'rgba(6,0,16,0.5)', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
            <div className="flex flex-col items-center gap-4 py-8 px-6 text-center">
              <div className="rounded-2xl p-4" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <Upload className="h-8 w-8 text-violet-400" />
              </div>
              <div>
                <p className="text-white font-semibold">Drop image here or click to upload</p>
                <p className="text-muted-foreground text-sm mt-1">JPG, PNG, WebP — max 10MB</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                {['Screenshot', 'Photo', 'News image', 'Meme'].map(t => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full text-violet-300"
                    style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Paste button */}
          <button
            onClick={() => { toast({ title: '⌨️ Press Ctrl+V', description: 'Paste your copied image anywhere on this page.' }); }}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', color: '#c084fc' }}
          >
            <ClipboardPaste className="h-4 w-4" />
            Paste from Clipboard
            <span className="text-violet-400/50 text-xs">(Ctrl+V)</span>
          </button>
        </div>
      )}

      {/* Scanning state — show image + phase progress */}
      {isScanning && preview && (
        <div className="w-full max-w-xl space-y-4 fade-in">
          <div className="relative rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(139,92,246,0.3)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Scanning" className="w-full object-cover opacity-50" style={{ maxHeight: '240px' }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              style={{ background: 'rgba(6,0,16,0.65)' }}>
              <ScanLine className="h-10 w-10 text-violet-400 animate-pulse" />
              <p className="text-white font-semibold text-sm">
                {phase === 'phase1' ? '🤖 Scanning for AI generation...' : '🔍 Extracting and analyzing text...'}
              </p>
              <PhaseIndicator phase={phase} currentPhase={phase} />
            </div>
          </div>

          {/* Show AI result as soon as phase1 done */}
          {phase === 'phase2' && aiResult && (
            <div className="fade-in rounded-xl border p-4 space-y-2"
              style={{ borderColor: '#8b5cf630', background: 'rgba(6,0,16,0.6)' }}>
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-semibold text-white">AI Detection Complete</span>
                <Badge verdict={aiResult.isAiGenerated ? 'AI DETECTED' : 'REAL PHOTO'} />
              </div>
              <p className="text-xs text-gray-400">{aiResult.aiExplanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {(phase === 'done' || phase === 'phase1done') && (aiResult || textResult) && (
        <div className="w-full max-w-2xl space-y-4 fade-in">

          {/* Image preview + overall banner */}
          {preview && (
            <div className="rounded-2xl overflow-hidden border flex gap-0"
              style={{ borderColor: `${riskColor}30` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Scanned" className="w-28 object-cover shrink-0" />
              <div className="flex-1 p-4 flex items-center gap-3"
                style={{ background: `${riskColor}08` }}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-extrabold" style={{ color: riskColor }}>
                      {overallRisk === 'SAFE' ? '✓ LOOKS SAFE' : overallRisk === 'SUSPICIOUS' ? '⚠ SUSPICIOUS' : '✗ HIGH RISK'}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">Score: {overallScore}/100</span>
                    {!textResult && <span className="text-xs text-violet-400 animate-pulse">Text scan running...</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {overallRisk === 'SAFE' ? 'No significant threats detected.' : overallRisk === 'SUSPICIOUS' ? 'Some signals found — review below.' : 'High-risk content. Do not share.'}
                  </p>
                </div>
                <RiskGauge score={overallScore} color={riskColor} />
              </div>
            </div>
          )}

          {/* AI Detection card */}
          {aiResult && (
            <Card title="AI Image Detection" icon={Bot} color="#8b5cf6" open={openCards.ai} onToggle={() => toggle('ai')}>
              <div className="flex items-start gap-4 pt-2">
                <RiskGauge score={aiResult.finalScore} color="#8b5cf6" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge verdict={aiResult.isAiGenerated ? 'AI DETECTED' : 'REAL PHOTO'} />
                    <span className="text-xs text-gray-400">
                      {aiResult.isAiGenerated ? '⚠ Likely AI-generated' : '✓ Appears to be a real photo'}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>Metadata score: <span className="text-white">{aiResult.metadataScore}%</span></span>
                    <span>Vision score: <span className="text-white">{aiResult.apiScore}%</span></span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{aiResult.aiExplanation}</p>
                  {aiResult.metadataFindings.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Metadata</p>
                      {aiResult.metadataFindings.map((f, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-gray-400">
                          <Zap className="h-3 w-3 mt-0.5 text-violet-400 shrink-0" />{f}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Text results — only when phase 2 done */}
          {textResult ? (
            <>
              {/* Scam card */}
              {(textResult.scam.isScam || !textResult.news.isFake) && (
                <Card title="Scam Text Detection" icon={ShieldAlert} color="#ef4444" open={openCards.scam} onToggle={() => toggle('scam')}>
                  <div className="flex items-start gap-4 pt-2">
                    <RiskGauge score={textResult.scam.riskScore} color="#ef4444" />
                    <div className="flex-1 space-y-2">
                      <Badge verdict={textResult.scam.isScam ? 'SCAM' : 'SAFE'} />
                      <p className="text-sm text-gray-300 leading-relaxed">{textResult.scam.explanation}</p>
                      {textResult.scam.extractedText && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Extracted Text</p>
                          <div className="rounded-lg p-3 text-xs text-gray-300 font-mono leading-relaxed max-h-28 overflow-y-auto"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                            {textResult.scam.extractedText}
                          </div>
                        </div>
                      )}
                      {textResult.scam.recommendedActions && (
                        <div className="rounded-lg p-3 text-xs text-amber-300"
                          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                          <span className="font-semibold">Action: </span>{textResult.scam.recommendedActions}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {/* Fake news card */}
              {(textResult.news.isFake || !textResult.scam.isScam) && (
                <Card title="Fake News Verification" icon={Newspaper} color="#f59e0b" open={openCards.news} onToggle={() => toggle('news')}>
                  <div className="pt-2 space-y-3">
                    <div className="flex items-start gap-4">
                      <RiskGauge score={textResult.news.riskScore} color="#f59e0b" />
                      <div className="flex-1 space-y-1.5">
                        <div className="flex flex-wrap gap-2 items-center">
                          <Badge verdict={textResult.news.geminiVerdict} />
                          <span className="text-xs text-gray-500">Gemini AI</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">{textResult.news.geminiExplanation}</p>
                      </div>
                    </div>
                    <div className="rounded-lg p-3 space-y-2"
                      style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs text-amber-400 font-semibold uppercase tracking-wide">Fact-Check Engine</span>
                        <div className="flex items-center gap-2">
                          <Badge verdict={textResult.news.heuristicVerdict} />
                          <span className="text-xs text-gray-500">{textResult.news.heuristicConfidence}% confidence</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed"
                         dangerouslySetInnerHTML={{ __html: textResult.news.heuristicExplanation.replace(/<highlight>/g, '<span class="text-emerald-400 font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded ml-1 mr-1 border border-emerald-400/20">').replace(/<\/highlight>/g, '</span>') }} />
                      {textResult.news.confirmedAt && !['None','N/A'].includes(textResult.news.confirmedAt) && (
                        <p className="text-xs text-amber-400/70">Verified at: {textResult.news.confirmedAt}</p>
                      )}
                      {textResult.news.heuristicFlags.map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-amber-300">
                          <AlertTriangle className="h-3 w-3 shrink-0" />{f}
                        </div>
                      ))}
                    </div>
                    
                    {/* Fallback Google CSE Search Box */}
                    <div className="rounded-lg p-3 space-y-2 mt-3"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-violet-400" />
                        <span className="text-xs text-gray-300 font-semibold uppercase tracking-wide">Manual Search Engine</span>
                      </div>
                      <p className="text-xs text-gray-400">If the automatic scan is unverified or the API is disabled, use the official Google Custom Search below to manually verify the text.</p>
                      
                      <a href={`https://cse.google.com/cse?cx=e7d7005d6e1bf426a&q=${encodeURIComponent((textResult.scam.extractedText || '').slice(0, 100))}`}
                         target="_blank" rel="noreferrer"
                         className="flex items-center justify-center gap-2 mt-2 py-2 px-4 rounded-md text-sm font-semibold transition-all"
                         style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#c084fc' }}>
                        Open Custom Search Engine ↗
                      </a>
                    </div>

                  </div>
                </Card>
              )}
            </>
          ) : phase !== 'idle' && (
            <div className="rounded-xl border p-4 flex items-center gap-3"
              style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(6,0,16,0.5)' }}>
              <Loader2 className="h-5 w-5 text-red-400 animate-spin shrink-0" />
              <div>
                <p className="text-sm text-white font-medium">Analyzing text for scams & fake news...</p>
                <p className="text-xs text-gray-400 mt-0.5">Extracting text and running verification pipeline</p>
              </div>
            </div>
          )}

          <button onClick={reset}
            className="w-full rounded-xl py-3 text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]"
            style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.35)', color: '#c084fc' }}>
            ← Scan Another Image
          </button>
        </div>
      )}
    </div>
  );
}
