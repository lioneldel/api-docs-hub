import { ApiEntry } from '../../types/api';

export const databaseApis: ApiEntry[] = [
  {
    id: 'supabase-db',
    name: 'Supabase PostgREST Database API',
    description: 'Instant RESTful API generated directly from your PostgreSQL schema with Row Level Security (RLS), Realtime WebSocket subscriptions, and pgvector for AI embeddings.',
    shortDescription: 'PostgreSQL-backed REST & Realtime API with pgvector and Row Level Security.',
    category: 'database',
    tags: ['database', 'postgres', 'postgrest', 'realtime', 'pgvector', 'sql', 'rest'],
    website: 'https://supabase.com',
    docsUrl: 'https://supabase.com/docs',
    apiReferenceUrl: 'https://supabase.com/docs/reference/javascript/select',
    baseUrl: 'https://<project-ref>.supabase.co/rest/v1',
    authMethod: 'api-key',
    authSetupGuide: 'Provide "apikey: <ANON_OR_SERVICE_KEY>" and optional "Authorization: Bearer <JWT>" in request headers.',
    pricing: 'freemium',
    pricingDetails: 'Free tier: 500MB database, 5GB bandwidth. Pro tier $25/mo includes 8GB database, automatic backups.',
    sdks: [
      { language: 'JavaScript/TypeScript', package: '@supabase/supabase-js', installCommand: 'npm install @supabase/supabase-js' },
      { language: 'Python', package: 'supabase', installCommand: 'pip install supabase' }
    ],
    quickstart: `import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

const { data, error } = await supabase
  .from('properties')
  .select('id, title, price, bedrooms')
  .eq('status', 'available')
  .order('price', { ascending: true });`,
    endpoints: [
      {
        method: 'GET',
        path: '/{table}',
        summary: 'Query Records',
        description: 'Filter, sort, paginate, and join related Postgres tables with PostgREST URL parameters.'
      },
      {
        method: 'POST',
        path: '/{table}',
        summary: 'Insert Records',
        description: 'Inserts one or multiple JSON records into table.'
      },
      {
        method: 'PATCH',
        path: '/{table}?{filter}',
        summary: 'Update Records',
        description: 'Updates rows matching the filter condition.'
      }
    ],
    useCases: ['Full-stack web & mobile backend', 'AI vector similarity search with pgvector', 'Real-time collaborative dashboards'],
    alternatives: ['neon', 'planetscale', 'firebase-firestore'],
    lastUpdated: '2026-03-01'
  },
  {
    id: 'neon',
    name: 'Neon Serverless Postgres API',
    description: 'Serverless PostgreSQL with instant autoscaling to zero, database branching (like Git for your database), and high-throughput connection pooling for serverless and edge functions.',
    shortDescription: 'Serverless Postgres with instant branching, autoscaling, and connection pooling.',
    category: 'database',
    tags: ['database', 'postgres', 'serverless', 'branching', 'edge', 'autoscaling'],
    website: 'https://neon.tech',
    docsUrl: 'https://neon.tech/docs',
    apiReferenceUrl: 'https://neon.tech/docs/api-reference/v2',
    baseUrl: 'https://console.neon.tech/api/v2',
    authMethod: 'bearer-token',
    authSetupGuide: 'Create API key on Neon Console and authenticate REST requests with Authorization: Bearer <API_KEY>. Connect over standard postgres:// URI.',
    pricing: 'freemium',
    pricingDetails: 'Free tier: 0.5 GB storage, scales to zero. Launch plan $19/mo.',
    sdks: [
      { language: 'Serverless Driver', package: '@neondatabase/serverless', installCommand: 'npm install @neondatabase/serverless' }
    ],
    quickstart: `import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL!);

const posts = await sql\`SELECT * FROM posts WHERE published = true LIMIT 10\`;
console.log(posts);`,
    endpoints: [
      {
        method: 'POST',
        path: '/projects/{project_id}/branches',
        summary: 'Create Database Branch',
        description: 'Instantly spins up an isolated copy-on-write database branch for preview environments.'
      }
    ],
    useCases: ['Preview environment database branching in CI/CD', 'Serverless Next.js edge functions', 'Cost-effective dev/staging environments'],
    alternatives: ['supabase-db', 'turso', 'planetscale'],
    lastUpdated: '2026-02-22'
  },
  {
    id: 'upstash-redis',
    name: 'Upstash Serverless Redis & QStash',
    description: 'Serverless Redis with REST API support, designed specifically for Cloudflare Workers, Vercel Edge, AWS Lambda, rate limiting, and message queueing (QStash).',
    shortDescription: 'Serverless Redis with HTTP REST API for edge runtimes and rate limiting.',
    category: 'database',
    tags: ['database', 'redis', 'serverless', 'edge', 'rate-limiting', 'caching', 'qstash'],
    website: 'https://upstash.com',
    docsUrl: 'https://docs.upstash.com',
    apiReferenceUrl: 'https://docs.upstash.com/redis/features/restapi',
    baseUrl: 'https://<endpoint>.upstash.io',
    authMethod: 'bearer-token',
    authSetupGuide: 'Pass token via header: Authorization: Bearer <UPSTASH_REDIS_REST_TOKEN>.',
    pricing: 'freemium',
    pricingDetails: 'Free tier: 10,000 commands/day. Pay-as-you-go: $0.2 per 100K commands.',
    sdks: [
      { language: 'Node/Edge', package: '@upstash/redis', installCommand: 'npm install @upstash/redis' },
      { language: 'Ratelimit', package: '@upstash/ratelimit', installCommand: 'npm install @upstash/ratelimit' }
    ],
    quickstart: `import { Redis } from '@upstash/redis';
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

await redis.set('session:123', JSON.stringify({ userId: 42 }), { ex: 3600 });
const data = await redis.get('session:123');`,
    endpoints: [
      {
        method: 'POST',
        path: '/pipeline',
        summary: 'Execute Redis Pipeline',
        description: 'Batches multiple Redis commands over a single HTTP request.'
      }
    ],
    useCases: ['API rate-limiting middleware in Next.js/Vercel', 'Distributed caching in Edge functions', 'Leaderboards and ephemeral counters'],
    alternatives: ['redis-cloud', 'dragonfly'],
    lastUpdated: '2026-02-15'
  }
];
