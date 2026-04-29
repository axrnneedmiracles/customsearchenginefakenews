
import type { Timestamp } from 'firebase/firestore';

export type ScanResult = {
    url: string;
    riskScore: number;
    isMalicious: boolean;
    explanation?: string;
    recommendedActions?: string;
    advice?: string;
    error?: string;
};

export type ImageAnalysisResult = {
    id: string;
    imageUrl: string;
    metadataScore: number;
    apiScore: number;
    finalScore: number;
    isAiGenerated: boolean;
    metadataFindings: string[];
    aiExplanation: string;
    analyzedAt: string;
};

export type ScreenshotAnalysisResult = {
    id: string;
    imageUrl: string;
    isScam: boolean;
    riskScore: number;
    explanation: string;
    extractedText: string;
    recommendedActions: string;
    analyzedAt: string;
    error?: string;
};

export type CallAnalysisResult = {
    id: string;
    audioUrl: string;
    isScam: boolean;
    riskScore: number;
    transcript: string;
    explanation: string;
    recommendedActions: string;
    analyzedAt: string;
    error?: string;
};

export type FakeNewsResult = {
    text: string;
    isFake: boolean;
    riskScore: number;
    verdict: string;
    explanation: string;
    analyzedAt: string;
    error?: string;
};

export type ImageScanResult = {
    // AI Image Detection
    aiDetection: {
        metadataScore: number;
        apiScore: number;
        finalScore: number;
        isAiGenerated: boolean;
        metadataFindings: string[];
        aiExplanation: string;
    };
    // Scam Detection (from extracted text)
    scamDetection: {
        isScam: boolean;
        riskScore: number;
        explanation: string;
        extractedText: string;
        recommendedActions: string;
    };
    // Fake News Detection (Gemini + Heuristic)
    fakeNewsDetection: {
        isFake: boolean;
        riskScore: number;
        geminiVerdict: string;
        geminiExplanation: string;
        heuristicVerdict: string;
        heuristicConfidence: number;
        heuristicExplanation: string;
        heuristicFlags: string[];
        wasClickbait: boolean;
        confirmedAt: string;
    };
    // Overall
    overallRisk: 'SAFE' | 'SUSPICIOUS' | 'DANGER';
    overallScore: number;
    analyzedAt: string;
    error?: string;
};

export type LeakedDBResult = {
    email: string;
    isFound: boolean;
    breachCount: number;
    breaches: Array<{
        name: string;
        date: string;
        dataTypes: string[];
        description: string;
    }>;
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    recommendations: string;
    analyzedAt: string;
};

export type ScanHistoryItem = ScanResult & {
    id: string;
    scannedAt: string;
};

export interface Report {
    id: string;
    title: string;
    url: string;
    author: string;
    comment: string;
    rating: number;
    time: Timestamp;
    isApproved: boolean;
}

export interface AnalyticsStats {
    totalVisits: number;
    totalScans: number;
}
