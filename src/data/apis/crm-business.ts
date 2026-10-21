import { ApiEntry } from '../../types/api';

export const crmBusinessApis: ApiEntry[] = [
  {
    id: 'hubspot',
    name: 'HubSpot CRM API',
    description: 'Inbound marketing, sales pipelines, contact management, deal stages, tickets, marketing automation, and CMS integration via unified CRM objects v3.',
    shortDescription: 'CRM contacts, sales deals, companies, and marketing automation pipelines.',
    category: 'crm-business',
    tags: ['crm-business', 'crm', 'leads', 'deals', 'sales', 'marketing', 'hubspot'],
    website: 'https://hubspot.com',
    docsUrl: 'https://developers.hubspot.com/docs/api/overview',
    apiReferenceUrl: 'https://developers.hubspot.com/docs/api/crm/contacts',
    baseUrl: 'https://api.hubapi.com',
    authMethod: 'bearer-token',
    authSetupGuide: 'Create Private App in HubSpot Portal Settings -> Integrations -> Private Apps. Provide Authorization: Bearer <ACCESS_TOKEN>.',
    pricing: 'freemium',
    pricingDetails: 'Free tools available; Starter starts at $20/seat/month; Enterprise custom.',
    sdks: [
      { language: 'Node.js', package: '@hubspot/api-client', installCommand: 'npm install @hubspot/api-client' },
      { language: 'Python', package: 'hubspot-api-client', installCommand: 'pip install hubspot-api-client' }
    ],
    quickstart: `import { Client } from '@hubspot/api-client';
const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

const contact = await hubspotClient.crm.contacts.basicApi.create({
  properties: { email: 'prospect@example.com', firstname: 'Sarah', lastname: 'Connor' },
});
console.log(contact.id);`,
    endpoints: [
      {
        method: 'POST',
        path: '/crm/v3/objects/contacts',
        summary: 'Create Contact',
        description: 'Creates lead or customer record with custom properties.'
      },
      {
        method: 'POST',
        path: '/crm/v3/objects/deals',
        summary: 'Create Deal',
        description: 'Creates sales pipeline deal with stage and monetary amount.'
      }
    ],
    useCases: ['Automating website lead capture into sales pipeline', 'Syncing customer order records with CRM contacts'],
    alternatives: ['salesforce', 'zoho', 'pipedrive'],
    lastUpdated: '2026-02-18'
  },
  {
    id: 'notion',
    name: 'Notion API',
    description: 'Programmatically read, write, update, and query Notion databases, pages, blocks, user comments, and collaborative workspaces.',
    shortDescription: 'Read/write Notion databases, blocks, and collaborative workspaces.',
    category: 'crm-business',
    tags: ['crm-business', 'notion', 'databases', 'workspace', 'productivity', 'cms'],
    website: 'https://developers.notion.com',
    docsUrl: 'https://developers.notion.com/docs/getting-started',
    apiReferenceUrl: 'https://developers.notion.com/reference/intro',
    baseUrl: 'https://api.notion.com/v1',
    authMethod: 'bearer-token',
    authSetupGuide: 'Create an internal integration at notion.so/my-integrations, copy Internal Integration Token, and include Notion-Version: 2022-06-28.',
    pricing: 'free',
    pricingDetails: 'API access included free on all Notion plans (Free, Plus, Business, Enterprise).',
    sdks: [
      { language: 'Node/TypeScript', package: '@notionhq/client', installCommand: 'npm install @notionhq/client' }
    ],
    quickstart: `import { Client } from '@notionhq/client';
const notion = new Client({ auth: process.env.NOTION_TOKEN });

const response = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID!,
  filter: { property: 'Status', select: { equals: 'In Progress' } },
});`,
    endpoints: [
      {
        method: 'POST',
        path: '/databases/{id}/query',
        summary: 'Query Database',
        description: 'Filters and sorts rows/pages within a Notion database.'
      },
      {
        method: 'POST',
        path: '/pages',
        summary: 'Create Page',
        description: 'Creates a new page or database item.'
      }
    ],
    useCases: ['Using Notion as a headless CMS for blogs', 'Syncing form submissions directly into internal team boards'],
    alternatives: ['airtable', 'coda'],
    lastUpdated: '2026-01-28'
  },
  {
    id: 'slack',
    name: 'Slack Web API & Bolt',
    description: 'Build interactive chatbots, send rich Block Kit messages, manage channels, respond to slash commands, and capture workspace events in real time.',
    shortDescription: 'Send rich Block Kit messages, build bots, and handle workspace events.',
    category: 'crm-business',
    tags: ['crm-business', 'slack', 'chatops', 'bots', 'block-kit', 'notifications', 'webhooks'],
    website: 'https://api.slack.com',
    docsUrl: 'https://api.slack.com/docs',
    apiReferenceUrl: 'https://api.slack.com/methods',
    baseUrl: 'https://slack.com/api',
    authMethod: 'bearer-token',
    authSetupGuide: 'Create a Slack App at api.slack.com/apps, install to workspace, and use Bot User OAuth Token (xoxb-...) in Authorization header.',
    pricing: 'free',
    pricingDetails: 'API usage is free; subject to Slack workspace tiers and standard rate limits.',
    sdks: [
      { language: 'Bolt for JavaScript', package: '@slack/bolt', installCommand: 'npm install @slack/bolt' },
      { language: 'Web API Client', package: '@slack/web-api', installCommand: 'npm install @slack/web-api' }
    ],
    quickstart: `import { WebClient } from '@slack/web-api';
const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

await slack.chat.postMessage({
  channel: '#dev-alerts',
  text: '🚀 Deployment successful: v2.4.0 is now live in production!',
});`,
    endpoints: [
      {
        method: 'POST',
        path: '/chat.postMessage',
        summary: 'Post Message',
        description: 'Publishes message with text and Block Kit layout to channel.'
      }
    ],
    useCases: ['Internal operational alerts and server error warnings', 'Interactive approval workflows with buttons', 'Customer escalation triaging'],
    alternatives: ['discord', 'microsoft-teams'],
    lastUpdated: '2026-02-19'
  }
];
