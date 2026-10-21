import { ApiEntry } from '../../types/api';

export const devopsApis: ApiEntry[] = [
  {
    id: 'github',
    name: 'GitHub REST & GraphQL API',
    description: 'Automate repository management, Pull Requests, GitHub Actions CI/CD workflows, releases, issues, organization permissions, and webhooks.',
    shortDescription: 'Repository management, Pull Requests, Issues, and GitHub Actions automation.',
    category: 'devops',
    tags: ['devops', 'git', 'github', 'ci-cd', 'pull-requests', 'actions', 'automation'],
    website: 'https://github.com',
    docsUrl: 'https://docs.github.com/en/rest',
    apiReferenceUrl: 'https://docs.github.com/en/rest/overview/endpoints-available-for-fine-grained-personal-access-tokens',
    baseUrl: 'https://api.github.com',
    authMethod: 'bearer-token',
    authSetupGuide: 'Generate Fine-grained Personal Access Token (PAT) or GitHub App token. Include Authorization: Bearer <TOKEN> and Accept: application/vnd.github+json.',
    pricing: 'free',
    pricingDetails: 'Free for public/private repositories with standard API rate limits (5,000 req/hr for authenticated users).',
    sdks: [
      { language: 'Node/TypeScript', package: '@octokit/rest', installCommand: 'npm install @octokit/rest' },
      { language: 'Python', package: 'PyGithub', installCommand: 'pip install PyGithub' }
    ],
    quickstart: `import { Octokit } from '@octokit/rest';
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const { data: pullRequests } = await octokit.rest.pulls.list({
  owner: 'octocat',
  repo: 'Hello-World',
  state: 'open',
});
console.log(pullRequests.map(pr => pr.title));`,
    endpoints: [
      {
        method: 'GET',
        path: '/repos/{owner}/{repo}/pulls',
        summary: 'List Pull Requests',
        description: 'Returns PRs for repository filtered by state, base branch, or sort.'
      },
      {
        method: 'POST',
        path: '/repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches',
        summary: 'Trigger Workflow Dispatch',
        description: 'Manually triggers a GitHub Actions workflow with custom input parameters.'
      }
    ],
    useCases: ['AI agent PR reviewer automation', 'Custom CI/CD deployment pipelines', 'Issue triaging and release note generation'],
    alternatives: ['gitlab', 'bitbucket'],
    lastUpdated: '2026-03-01'
  },
  {
    id: 'vercel',
    name: 'Vercel REST API',
    description: 'Deploy frontend and serverless applications, configure custom domains, inspect build logs, manage edge configuration (Edge Config), and query analytics.',
    shortDescription: 'Programmatic preview deployments, custom domains, and Edge Config management.',
    category: 'devops',
    tags: ['devops', 'vercel', 'deployments', 'serverless', 'edge-config', 'hosting', 'domains'],
    website: 'https://vercel.com',
    docsUrl: 'https://vercel.com/docs/rest-api',
    apiReferenceUrl: 'https://vercel.com/docs/rest-api/endpoints',
    baseUrl: 'https://api.vercel.com',
    authMethod: 'bearer-token',
    authSetupGuide: 'Generate Personal Access Token from Vercel Account Settings -> Tokens. Send in Authorization: Bearer <VERCEL_TOKEN>.',
    pricing: 'freemium',
    pricingDetails: 'Hobby plan free. Pro plan $20/user/month. Enterprise pricing available.',
    sdks: [
      { language: 'Node/TypeScript', package: '@vercel/sdk', installCommand: 'npm install @vercel/sdk' }
    ],
    quickstart: `import { Vercel } from '@vercel/sdk';
const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN });

const deployments = await vercel.deployments.getDeployments({
  projectId: process.env.VERCEL_PROJECT_ID!,
  limit: 5,
});`,
    endpoints: [
      {
        method: 'POST',
        path: '/v13/deployments',
        summary: 'Create Deployment',
        description: 'Upload files and trigger an instant deployment.'
      },
      {
        method: 'POST',
        path: '/v10/projects/{idOrName}/domains',
        summary: 'Add Domain',
        description: 'Assigns custom domain with automatic SSL certification.'
      }
    ],
    useCases: ['Instant multi-tenant preview environments for customers', 'Dynamic subdomain provisioning for SaaS users'],
    alternatives: ['netlify', 'railway', 'render'],
    lastUpdated: '2026-02-15'
  },
  {
    id: 'sentry',
    name: 'Sentry REST API',
    description: 'Application performance monitoring, crash reporting, distributed tracing, session replay, and release health analytics.',
    shortDescription: 'Real-time error tracking, crash reporting, and APM performance tracing.',
    category: 'devops',
    tags: ['devops', 'sentry', 'monitoring', 'apm', 'error-tracking', 'logging', 'tracing'],
    website: 'https://sentry.io',
    docsUrl: 'https://docs.sentry.io/api/',
    apiReferenceUrl: 'https://docs.sentry.io/api/',
    baseUrl: 'https://sentry.io/api/0',
    authMethod: 'bearer-token',
    authSetupGuide: 'Create an Auth Token under User Settings -> API -> Auth Tokens with appropriate scopes (project:read, event:read).',
    pricing: 'freemium',
    pricingDetails: 'Developer plan free (5K errors/mo). Team plan from $26/mo.',
    sdks: [
      { language: 'React / Web', package: '@sentry/react', installCommand: 'npm install @sentry/react' },
      { language: 'Node.js', package: '@sentry/node', installCommand: 'npm install @sentry/node' }
    ],
    quickstart: `import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
});
Sentry.captureException(new Error('Payment failed'));`,
    endpoints: [
      {
        method: 'GET',
        path: '/projects/{organization_slug}/{project_slug}/issues/',
        summary: 'List Project Issues',
        description: 'Returns unresolved crash groups and stack traces.'
      }
    ],
    useCases: ['Immediate crash detection in web and mobile production apps', 'Automated issue alerts into Slack or Linear'],
    alternatives: ['datadog', 'logrocket'],
    lastUpdated: '2026-02-27'
  }
];
