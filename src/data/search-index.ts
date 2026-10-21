import Fuse from 'fuse.js';
import { ALL_APIS, getApiById } from './registry';
import { ApiEntry, SearchResult, ApiRecommendation, ComparisonResult } from '../types/api';

const fuseOptions = {
  includeScore: true,
  includeMatches: true,
  threshold: 0.35,
  keys: [
    { name: 'name', weight: 3 },
    { name: 'tags', weight: 2.5 },
    { name: 'shortDescription', weight: 2 },
    { name: 'useCases', weight: 1.8 },
    { name: 'description', weight: 1 },
    { name: 'endpoints.summary', weight: 1 },
  ],
};

const fuse = new Fuse(ALL_APIS, fuseOptions);

export function searchApis(
  query: string,
  category?: string,
  limit: number = 20
): SearchResult[] {
  let listToSearch = ALL_APIS;
  if (category && category !== 'all') {
    listToSearch = ALL_APIS.filter((api) => api.category === category);
  }

  if (!query || query.trim() === '') {
    return listToSearch.slice(0, limit).map((api) => ({
      api,
      score: 1,
      matchedFields: [],
    }));
  }

  const scopedFuse = category && category !== 'all' ? new Fuse(listToSearch, fuseOptions) : fuse;
  const results = scopedFuse.search(query);

  return results.slice(0, limit).map((res) => ({
    api: res.item,
    score: 1 - (res.score ?? 0),
    matchedFields: res.matches?.map((m) => m.key || '') || [],
  }));
}

/**
 * Task-based API Recommender:
 * Analyzes the user's task prompt, identifies keywords, patterns, and architectural needs,
 * then maps out the required APIs, reasons, and expected outcome integration stack.
 */
export function recommendApisForTask(
  task: string,
  constraints: string[] = []
): {
  analysis: string;
  expectedOutcome: string;
  recommendations: ApiRecommendation[];
} {
  const lowerTask = task.toLowerCase();
  const recs: ApiRecommendation[] = [];

  // 1. Auth detection
  if (
    lowerTask.includes('login') ||
    lowerTask.includes('auth') ||
    lowerTask.includes('signup') ||
    lowerTask.includes('user') ||
    lowerTask.includes('sso') ||
    lowerTask.includes('rbac') ||
    lowerTask.includes('multi-tenant')
  ) {
    if (lowerTask.includes('next') || lowerTask.includes('react') || lowerTask.includes('modern')) {
      const clerk = getApiById('clerk');
      if (clerk) {
        recs.push({
          api: clerk,
          relevance: 'essential',
          reason: 'Provides turnkey React/Next.js UI components, user management, and organization switching.',
          integrationNotes: 'Wrap app with <ClerkProvider> and protect routes using clerkMiddleware().',
        });
      }
    } else if (lowerTask.includes('enterprise') || lowerTask.includes('saml') || lowerTask.includes('scim')) {
      const workos = getApiById('workos');
      if (workos) {
        recs.push({
          api: workos,
          relevance: 'essential',
          reason: 'Industry standard for enterprise SSO (SAML/OIDC) and SCIM directory sync.',
          integrationNotes: 'Use workos.sso.getAuthorizationUrl() to trigger enterprise sign-in.',
        });
      }
    } else {
      const supaAuth = getApiById('supabase-auth');
      if (supaAuth) {
        recs.push({
          api: supaAuth,
          relevance: 'essential',
          reason: 'Seamless integration with Postgres Row Level Security (RLS) and JWT auth.',
          integrationNotes: 'Initialize with createClient() and call supabase.auth.signUp() / signInWithPassword().',
        });
      }
    }
  }

  // 2. Payments & Checkout
  if (
    lowerTask.includes('pay') ||
    lowerTask.includes('checkout') ||
    lowerTask.includes('subscription') ||
    lowerTask.includes('billing') ||
    lowerTask.includes('stripe') ||
    lowerTask.includes('monetiz') ||
    lowerTask.includes('charge')
  ) {
    if (lowerTask.includes('tax') || lowerTask.includes('vat') || lowerTask.includes('merchant of record')) {
      const paddle = getApiById('paddle');
      if (paddle) {
        recs.push({
          api: paddle,
          relevance: 'essential',
          reason: 'Merchant of Record handles worldwide sales tax, VAT calculation, and remittance automatically.',
          integrationNotes: 'Create transaction via POST /transactions and present Paddle.js overlay checkout.',
        });
      }
    } else if (lowerTask.includes('india') || lowerTask.includes('upi')) {
      const rzp = getApiById('razorpay');
      if (rzp) {
        recs.push({
          api: rzp,
          relevance: 'essential',
          reason: 'Native UPI QR codes, Indian cards, NetBanking, and recurring mandate compliance.',
          integrationNotes: 'Generate order with razorpay.orders.create() and open standard checkout popup.',
        });
      }
    } else {
      const stripe = getApiById('stripe');
      if (stripe) {
        recs.push({
          api: stripe,
          relevance: 'essential',
          reason: 'Unmatched global standard for card processing, subscriptions, and webhooks.',
          integrationNotes: 'Create Stripe Checkout Session on the server and redirect the user.',
        });
      }
    }
  }

  // 3. AI / LLM
  if (
    lowerTask.includes('ai') ||
    lowerTask.includes('llm') ||
    lowerTask.includes('summar') ||
    lowerTask.includes('chat') ||
    lowerTask.includes('extract') ||
    lowerTask.includes('intelligence') ||
    lowerTask.includes('voice') ||
    lowerTask.includes('transcri')
  ) {
    if (lowerTask.includes('fast') || lowerTask.includes('latency') || lowerTask.includes('speed')) {
      const groq = getApiById('groq');
      if (groq) {
        recs.push({
          api: groq,
          relevance: 'essential',
          reason: 'Lightning fast 500+ tokens/sec inference powered by LPUs for sub-second responses.',
          integrationNotes: 'Use OpenAI-compatible SDK pointing to https://api.groq.com/openai/v1.',
        });
      }
    } else if (lowerTask.includes('voice') || lowerTask.includes('speech')) {
      const eleven = getApiById('elevenlabs');
      if (eleven) {
        recs.push({
          api: eleven,
          relevance: 'essential',
          reason: 'State-of-the-art realistic text-to-speech and conversational voice agent synthesis.',
          integrationNotes: 'Stream audio chunks from /text-to-speech/{voice_id} directly to client speakers.',
        });
      }
    } else if (lowerTask.includes('reason') || lowerTask.includes('code') || lowerTask.includes('claude')) {
      const anthropic = getApiById('anthropic');
      if (anthropic) {
        recs.push({
          api: anthropic,
          relevance: 'essential',
          reason: 'Claude 3.7 Sonnet delivers top-tier coding, instruction adherence, and extended thinking.',
          integrationNotes: 'Invoke anthropic.messages.create() with model claude-3-7-sonnet-20250219.',
        });
      }
    } else {
      const openai = getApiById('openai');
      if (openai) {
        recs.push({
          api: openai,
          relevance: 'essential',
          reason: 'Versatile ecosystem: GPT-4o vision, function calling, structured outputs, and embeddings.',
          integrationNotes: 'Use openai.chat.completions.create() with response_format: { type: "json_object" }.',
        });
      }
    }
  }

  // 4. Database & Storage
  if (
    lowerTask.includes('database') ||
    lowerTask.includes('store') ||
    lowerTask.includes('postgres') ||
    lowerTask.includes('data') ||
    lowerTask.includes('crud') ||
    lowerTask.includes('schema')
  ) {
    const supaDb = getApiById('supabase-db');
    if (supaDb && !recs.some((r) => r.api.id === 'supabase-db')) {
      recs.push({
        api: supaDb,
        relevance: 'essential',
        reason: 'Instant REST/GraphQL endpoints with real-time websocket sync and pgvector support.',
        integrationNotes: 'Define PostgreSQL tables in dashboard and query directly using @supabase/supabase-js.',
      });
    }
  }

  // 5. File upload / Cloud Storage
  if (
    lowerTask.includes('upload') ||
    lowerTask.includes('file') ||
    lowerTask.includes('image') ||
    lowerTask.includes('avatar') ||
    lowerTask.includes('pdf') ||
    lowerTask.includes('storage') ||
    lowerTask.includes('s3')
  ) {
    if (lowerTask.includes('transform') || lowerTask.includes('thumbnail')) {
      const cl = getApiById('cloudinary');
      if (cl) {
        recs.push({
          api: cl,
          relevance: 'recommended',
          reason: 'Automatic responsive image cropping, face detection, and AVIF/WebP delivery.',
          integrationNotes: 'Upload via cloudinary.uploader.upload() with desired transformation flags.',
        });
      }
    } else {
      const r2 = getApiById('cloudflare-r2');
      if (r2) {
        recs.push({
          api: r2,
          relevance: 'recommended',
          reason: 'S3-compatible object storage with $0 egress bandwidth costs for high file volume.',
          integrationNotes: 'Use standard @aws-sdk/client-s3 pointing to your Cloudflare R2 bucket endpoint.',
        });
      }
    }
  }

  // 6. Messaging & Email
  if (
    lowerTask.includes('email') ||
    lowerTask.includes('notification') ||
    lowerTask.includes('sms') ||
    lowerTask.includes('message') ||
    lowerTask.includes('alert')
  ) {
    if (lowerTask.includes('email')) {
      const resend = getApiById('resend');
      if (resend) {
        recs.push({
          api: resend,
          relevance: 'essential',
          reason: 'Clean developer UX and first-class React Email component integration.',
          integrationNotes: 'Call resend.emails.send() with verified custom sending domain.',
        });
      }
    }
    if (lowerTask.includes('sms') || lowerTask.includes('phone') || lowerTask.includes('whatsapp')) {
      const twilio = getApiById('twilio');
      if (twilio) {
        recs.push({
          api: twilio,
          relevance: 'essential',
          reason: 'Global SMS/WhatsApp delivery reliability and phone number routing.',
          integrationNotes: 'Call twilio.messages.create() with Twilio sender phone number.',
        });
      }
    }
    if (lowerTask.includes('push')) {
      const onesignal = getApiById('onesignal');
      if (onesignal) {
        recs.push({
          api: onesignal,
          relevance: 'recommended',
          reason: 'Cross-platform mobile and web push notifications with segment targeting.',
          integrationNotes: 'Init OneSignal SDK in frontend and dispatch alerts via REST API.',
        });
      }
    }
  }

  // 7. Maps & Location
  if (
    lowerTask.includes('map') ||
    lowerTask.includes('location') ||
    lowerTask.includes('address') ||
    lowerTask.includes('geocode') ||
    lowerTask.includes('route') ||
    lowerTask.includes('distance') ||
    lowerTask.includes('property')
  ) {
    const gmaps = getApiById('google-maps');
    if (gmaps) {
      recs.push({
        api: gmaps,
        relevance: 'essential',
        reason: 'Most complete global points-of-interest, street geocoding, and address validation.',
        integrationNotes: 'Use Places Autocomplete on input fields and Geocoding API to store lat/lng.',
      });
    }
  }

  // 8. Fallback if no specific keyword triggered
  if (recs.length === 0) {
    const results = searchApis(task, undefined, 4);
    for (const res of results) {
      recs.push({
        api: res.api,
        relevance: 'recommended',
        reason: `Matched task intent with score ${(res.score * 100).toFixed(0)}%.`,
        integrationNotes: `Refer to ${res.api.docsUrl} for integration guide.`,
      });
    }
  }

  const analysis = `Identified ${recs.length} core API services needed to satisfy the requirements for: "${task}".`;
  const expectedOutcome = `By integrating ${recs.map((r) => r.api.name).join(', ')}, the system will have fully authenticated flows, resilient backend storage, automated notifications, and production-grade reliability.`;

  return { analysis, expectedOutcome, recommendations: recs };
}

export function compareApis(apiIds: string[]): ComparisonResult {
  const apis = apiIds.map(getApiById).filter((a): a is ApiEntry => a !== undefined);

  const criteria = [
    {
      name: 'Category',
      values: Object.fromEntries(apis.map((a) => [a.id, a.category])),
    },
    {
      name: 'Auth Method',
      values: Object.fromEntries(apis.map((a) => [a.id, a.authMethod])),
    },
    {
      name: 'Pricing Model',
      values: Object.fromEntries(apis.map((a) => [a.id, a.pricing])),
    },
    {
      name: 'Pricing Details',
      values: Object.fromEntries(apis.map((a) => [a.id, a.pricingDetails])),
    },
    {
      name: 'Supported SDKs',
      values: Object.fromEntries(apis.map((a) => [a.id, a.sdks.map((s) => s.language).join(', ')])),
    },
    {
      name: 'Core Use Cases',
      values: Object.fromEntries(apis.map((a) => [a.id, a.useCases.slice(0, 3).join('; ')])),
    },
  ];

  return {
    apiIds: apis.map((a) => a.id),
    criteria,
  };
}
