'use server';

import { detectAiImage } from '@/lib/image-actions';
import { analyzeScreenshot } from '@/ai/flows/screenshot-analysis';
import { analyzeNewsContent } from '@/ai/flows/fake-news-analysis';
import { runHeuristicNewsCheck } from '@/lib/heuristic-news';
import type { ImageScanResult } from '@/lib/types';

// ── Phase 1: AI Image Detection only ────────────────────────
export async function scanImagePhase1(dataUri: string): Promise<ImageScanResult['aiDetection']> {
    const result = await detectAiImage(dataUri);
    return {
        metadataScore: result.metadataScore,
        apiScore: result.apiScore,
        finalScore: result.finalScore,
        isAiGenerated: result.isAiGenerated,
        metadataFindings: result.metadataFindings,
        aiExplanation: result.aiExplanation,
    };
}

// ── Phase 2: Text analysis (scam + fake news) ────────────────
export async function scanImagePhase2(dataUri: string): Promise<{
    scamDetection: ImageScanResult['scamDetection'];
    fakeNewsDetection: ImageScanResult['fakeNewsDetection'];
}> {
    // Step 1: OCR + scam scan
    let scamData = {
        isScam: false,
        riskScore: 0,
        explanation: 'No scam content detected.',
        extractedText: '',
        recommendedActions: '',
    };

    try {
        const scamResult = await analyzeScreenshot({ imageBuffer: dataUri });
        scamData = {
            isScam: scamResult.isScam,
            riskScore: scamResult.riskScore,
            explanation: scamResult.explanation,
            extractedText: scamResult.extractedText,
            recommendedActions: scamResult.recommendedActions,
        };
    } catch (e) {
        console.error('Scam scan failed:', e);
        scamData.explanation = 'Could not complete scam analysis.';
    }

    const extractedText = scamData.extractedText?.trim() ?? '';

    // Step 2: Fake news (only if meaningful text was found)
    let fakeNewsData: ImageScanResult['fakeNewsDetection'] = {
        isFake: false,
        riskScore: 0,
        geminiVerdict: 'NO TEXT',
        geminiExplanation: 'No readable text found in the image to analyze for fake news.',
        heuristicVerdict: 'UNVERIFIED',
        heuristicConfidence: 0,
        heuristicExplanation: 'No text found in image.',
        heuristicFlags: [],
        wasClickbait: false,
        confirmedAt: 'N/A',
    };

    if (extractedText.length > 20) {
        const [geminiRes, heuristicRes] = await Promise.allSettled([
            analyzeNewsContent({ newsText: extractedText }),
            runHeuristicNewsCheck(extractedText),
        ]);

        if (geminiRes.status === 'fulfilled') {
            fakeNewsData.isFake = geminiRes.value.isFake;
            fakeNewsData.riskScore = geminiRes.value.riskScore;
            fakeNewsData.geminiVerdict = geminiRes.value.verdict;
            fakeNewsData.geminiExplanation = geminiRes.value.explanation;
        }

        if (heuristicRes.status === 'fulfilled') {
            const h = heuristicRes.value;
            fakeNewsData.heuristicVerdict = h.verdict;
            fakeNewsData.heuristicConfidence = h.confidence;
            fakeNewsData.heuristicExplanation = h.explanation;
            fakeNewsData.heuristicFlags = h.flags;
            fakeNewsData.wasClickbait = h.wasClickbait;
            fakeNewsData.confirmedAt = h.confirmedAt;
        }
    }

    return { scamDetection: scamData, fakeNewsDetection: fakeNewsData };
}

// ── Full combined scan (used if needed) ─────────────────────
export async function scanImageFull(dataUri: string): Promise<ImageScanResult> {
    const analyzedAt = new Date().toISOString();
    try {
        const aiDetection = await scanImagePhase1(dataUri);
        const { scamDetection, fakeNewsDetection } = await scanImagePhase2(dataUri);

        const aiScore = aiDetection.finalScore;
        const scamScore = scamDetection.riskScore;
        const fakeScore = fakeNewsDetection.riskScore;
        const overallScore = Math.round((aiScore * 0.4) + (scamScore * 0.35) + (fakeScore * 0.25));
        const overallRisk: 'SAFE' | 'SUSPICIOUS' | 'DANGER' =
            overallScore >= 70 ? 'DANGER' : overallScore >= 40 ? 'SUSPICIOUS' : 'SAFE';

        return { aiDetection, scamDetection, fakeNewsDetection, overallRisk, overallScore, analyzedAt };
    } catch (error) {
        console.error('Image scan failed:', error);
        return {
            aiDetection: { metadataScore: 50, apiScore: 50, finalScore: 50, isAiGenerated: false, metadataFindings: ['Scan failed.'], aiExplanation: 'Internal error during AI analysis.' },
            scamDetection: { isScam: false, riskScore: 0, explanation: 'Scan failed.', extractedText: '', recommendedActions: 'Please try again.' },
            fakeNewsDetection: { isFake: false, riskScore: 0, geminiVerdict: 'ERROR', geminiExplanation: 'Scan failed.', heuristicVerdict: 'UNVERIFIED', heuristicConfidence: 0, heuristicExplanation: 'Scan failed.', heuristicFlags: [], wasClickbait: false, confirmedAt: 'N/A' },
            overallRisk: 'SUSPICIOUS', overallScore: 50, analyzedAt,
            error: 'Failed to complete image scan. Please try again.',
        };
    }
}
