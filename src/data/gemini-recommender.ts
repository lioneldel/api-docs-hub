import { ALL_APIS, getApiById } from './registry';
import { ApiRecommendation } from '../types/api';
import { recommendApisForTask as localRecommender } from './search-index';

export interface GeminiRecommenderResult {
  source: 'gemini' | 'local';
  analysis: string;
  expectedOutcome: string;
  recommendations: ApiRecommendation[];
  rawGeminiMarkdown?: string;
}

export async function recommendWithGemini(
  task: string,
  customApiKey?: string
): Promise<GeminiRecommenderResult> {
  const apiKey =
    customApiKey ||
    (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    '';

  if (!apiKey) {
    const local = localRecommender(task);
    return { ...local, source: 'local' };
  }

  const prompt = `You are a Principal Software Architect and API Strategist.
The user wants to build a project with this requirement:
"${task}"

Analyze this requirement and recommend the ideal, production-grade API stack.
Return a STRICT JSON response (without any markdown formatting around it, or wrapped in a json block) with this exact schema:
{
  "analysis": "2-3 sentences breaking down the technical requirements, components, and architectural challenges.",
  "expectedOutcome": "2-3 sentences describing the finalized architectural outcome, user experience, and operational capabilities once these APIs are integrated.",
  "recommendedApis": [
    {
      "name": "Standard API Name (e.g., Stripe, Clerk, OpenAI, Google Maps, Supabase, Twilio, Resend, Cloudflare R2, etc.)",
      "category": "payments | auth | ai-ml | cloud-storage | messaging | database | maps-location | crm-business | ecommerce | devops",
      "relevance": "essential | recommended | optional",
      "whyNeeded": "Specific justification for selecting this API for the user's task.",
      "integrationBlueprint": "Step-by-step guidance on how to integrate this API into the application flow."
    }
  ]
}
Select the most suitable, modern APIs for this task.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Gemini API call failed, falling back to local engine:', errText);
      const local = localRecommender(task);
      return { ...local, source: 'local' };
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Strip markdown code fences if present
    const cleanJson = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    // Map recommended APIs back to our registry where available, or synthesize clean ApiEntry
    const mappedRecs: ApiRecommendation[] = parsed.recommendedApis.map((item: any) => {
      const existing = getApiById(item.name);
      if (existing) {
        return {
          api: existing,
          relevance: item.relevance || 'essential',
          reason: item.whyNeeded || existing.shortDescription,
          integrationNotes: item.integrationBlueprint || `Refer to ${existing.docsUrl}`,
        };
      }

      // If not in standard registry, create a high-fidelity entry on the fly
      const syntheticApi = {
        id: item.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: item.name,
        description: item.whyNeeded,
        shortDescription: item.whyNeeded,
        category: item.category || 'devops',
        tags: [item.category || 'api', 'gemini-recommended'],
        website: `https://www.google.com/search?q=${encodeURIComponent(item.name + ' API documentation')}`,
        docsUrl: `https://www.google.com/search?q=${encodeURIComponent(item.name + ' developer docs')}`,
        apiReferenceUrl: `https://www.google.com/search?q=${encodeURIComponent(item.name + ' api reference')}`,
        baseUrl: `https://api.${item.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        authMethod: 'api-key' as const,
        authSetupGuide: `Obtain API key from the ${item.name} developer console and configure in environment variables.`,
        pricing: 'pay-as-you-go' as const,
        pricingDetails: 'Standard developer pricing applies.',
        sdks: [{ language: 'Node/TypeScript', package: item.name.toLowerCase(), installCommand: `npm install ${item.name.toLowerCase()}` }],
        quickstart: `// ${item.name} integration\nconsole.log('Connecting to ${item.name} API...');`,
        endpoints: [],
        useCases: [item.whyNeeded],
        alternatives: [],
        lastUpdated: new Date().toISOString().split('T')[0],
      };

      return {
        api: syntheticApi,
        relevance: item.relevance || 'essential',
        reason: item.whyNeeded,
        integrationNotes: item.integrationBlueprint,
      };
    });

    return {
      source: 'gemini',
      analysis: parsed.analysis,
      expectedOutcome: parsed.expectedOutcome,
      recommendations: mappedRecs,
      rawGeminiMarkdown: rawText,
    };
  } catch (error) {
    console.error('Error in Gemini recommender:', error);
    const local = localRecommender(task);
    return { ...local, source: 'local' };
  }
}
