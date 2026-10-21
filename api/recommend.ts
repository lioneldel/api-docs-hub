import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { task } = req.body || {};
  if (!task || typeof task !== 'string') {
    return res.status(400).json({ error: 'task string is required in body' });
  }

  // Keep API key strictly server-side
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on server' });
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
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      return res.status(502).json({ error: 'Gemini upstream error', details: err });
    }

    const data = await geminiRes.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const parsed = JSON.parse(rawJson);

    return res.status(200).json(parsed);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: 'Internal recommendation error', details: msg });
  }
}
