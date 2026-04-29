
'use server';

import { analyzeImageContent } from '@/ai/flows/image-analysis-flow';
import type { ImageAnalysisResult } from '@/lib/types';
import * as ExifParser from 'exif-parser';

const AI_KEYWORDS = ['firefly', 'veo', 'nano banana', 'dalle', 'meta', 'stable diffusion'];
const CAMERA_KEYWORDS = ['Make', 'Model', 'FocalLength', 'ExposureTime', 'ISOSpeedRatings'];

export async function detectAiImage(dataUri: string): Promise<ImageAnalysisResult> {
    const id = Math.random().toString(36).substring(7);
    const analyzedAt = new Date().toISOString();

    // 1. Metadata Analysis (40% weight)
    let metadataScore = 50;
    const metadataFindings: string[] = [];

    try {
        const base64Data = dataUri.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const parser = ExifParser.create(buffer);
        const result = parser.parse();

        const tags = result.tags || {};
        const tagKeys = Object.keys(tags);
        const allText = JSON.stringify(tags).toLowerCase();

        // Check for AI signatures
        const foundAiKeywords = AI_KEYWORDS.filter(k => allText.includes(k));
        if (foundAiKeywords.length > 0) {
            metadataScore = 100;
            metadataFindings.push(`AI generator tags found: ${foundAiKeywords.join(', ')}`);
        } else {
            // Check for real camera signatures
            const foundCameraTags = CAMERA_KEYWORDS.filter(k => tagKeys.includes(k));
            if (foundCameraTags.length > 0) {
                metadataScore = 0;
                metadataFindings.push(`Authentic camera metadata found (${tags.Make || 'Unknown'} ${tags.Model || ''})`);
            } else {
                metadataFindings.push("No decisive metadata found (AI or Camera).");
            }
        }
    } catch (e) {
        metadataFindings.push("Metadata is missing or encrypted.");
    }

    // 2. API/AI Scan (60% weight)
    let apiScore = 50;
    let aiExplanation = "AI analysis could not be completed.";

    try {
        const aiResponse = await analyzeImageContent({ imageBuffer: dataUri });
        apiScore = aiResponse.score;
        aiExplanation = aiResponse.explanation;
    } catch (e) {
        console.error("AI visual inspection failed:", e);
        aiExplanation = "Error during AI visual inspection.";
    }

    // 3. Averaging with weights
    const finalScore = (metadataScore * 0.3) + (apiScore * 0.7);
    const isAiGenerated = finalScore > 60;

    return {
        id,
        imageUrl: dataUri,
        metadataScore,
        apiScore,
        finalScore,
        isAiGenerated,
        metadataFindings,
        aiExplanation,
        analyzedAt
    };
}
