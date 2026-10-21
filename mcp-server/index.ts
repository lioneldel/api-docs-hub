import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { ALL_APIS, getApiById } from '../src/data/registry';
import { searchApis, compareApis } from '../src/data/search-index';
import { recommendWithGemini } from '../src/data/gemini-recommender';
import { fetchLiveApiDocumentation } from './utils/live-docs-resolver';

const server = new Server(
  {
    name: 'api-docs-hub-mcp',
    version: '2.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 1. List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_apis',
        description:
          'Search across 3,900+ production APIs and the live web by keyword, category, capability, or use case.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Keywords to search (e.g. "recurring payments", "vector database", "SAML SSO", "weather radar")',
            },
            category: {
              type: 'string',
              description:
                'Optional category filter: payments, auth, ai-ml, cloud-storage, messaging, database, maps-location, crm-business, ecommerce, devops',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results to return (default: 10)',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_api_docs',
        description:
          'Fetch targeted, accurate documentation for ANY API (from 3,900+ indexed catalog or live web fallback) including auth instructions, base URL, endpoints, and quickstart code.',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'The unique ID or name of the API (e.g. "stripe", "clerk", "openai", "spotify", "nasa")',
            },
            section: {
              type: 'string',
              enum: ['all', 'auth', 'endpoints', 'quickstart', 'pricing', 'sdks'],
              description: 'Specific section of documentation to retrieve (default: "all")',
            },
          },
          required: ['apiId'],
        },
      },
      {
        name: 'recommend_apis',
        description:
          'Deep AI Architectural Analysis: powered by Gemini 3.8 Flash, analyzes any software task and recommends the exact set of APIs required, explaining WHY each is needed and what the EXPECTED OUTCOME will be.',
        inputSchema: {
          type: 'object',
          properties: {
            task: {
              type: 'string',
              description:
                'Description of the task or feature to implement (e.g. "Build an AI real-estate platform with user logins, map search, and subscription checkout")',
            },
          },
          required: ['task'],
        },
      },
      {
        name: 'get_api_endpoints',
        description: 'Get the detailed endpoint specification and parameters for an API.',
        inputSchema: {
          type: 'object',
          properties: {
            apiId: {
              type: 'string',
              description: 'API ID or name',
            },
          },
          required: ['apiId'],
        },
      },
      {
        name: 'compare_apis',
        description: 'Compare two or more APIs side-by-side on auth, pricing, use cases, and SDK support.',
        inputSchema: {
          type: 'object',
          properties: {
            apiIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of API IDs to compare (e.g. ["stripe", "paddle", "razorpay"])',
            },
          },
          required: ['apiIds'],
        },
      },
    ],
  };
});

// 2. Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'search_apis': {
        const query = (args?.query as string) || '';
        const category = args?.category as string | undefined;
        const limit = Number(args?.limit) || 10;
        let results = searchApis(query, category, limit);

        if (results.length === 0 && query.trim()) {
          const live = await fetchLiveApiDocumentation(query);
          return {
            content: [{ type: 'text', text: live.documentationText }],
          };
        }

        const formatted = results.map((r) => ({
          id: r.api.id,
          name: r.api.name,
          category: r.api.category,
          shortDescription: r.api.shortDescription,
          pricing: r.api.pricing,
          docsUrl: r.api.docsUrl,
          matchScore: `${(r.score * 100).toFixed(0)}%`,
        }));

        return {
          content: [{ type: 'text', text: JSON.stringify(formatted, null, 2) }],
        };
      }

      case 'get_api_docs': {
        const apiId = (args?.apiId as string) || '';
        const section = (args?.section as string) || 'all';
        let api = getApiById(apiId);

        if (!api) {
          const liveResult = await fetchLiveApiDocumentation(apiId);
          return {
            content: [{ type: 'text', text: liveResult.documentationText }],
          };
        }

        let docText = '';
        if (section === 'auth' || section === 'all') {
          docText += `## Authentication for ${api.name}\n` +
            `- **Method**: ${api.authMethod}\n` +
            `- **Base URL**: ${api.baseUrl}\n` +
            `- **Setup Guide**: ${api.authSetupGuide}\n\n`;
        }
        if (section === 'quickstart' || section === 'all') {
          docText += `## Quickstart Code (${api.name})\n` +
            `\`\`\`typescript\n${api.quickstart}\n\`\`\`\n\n`;
        }
        if (section === 'endpoints' || section === 'all') {
          docText += `## Core Endpoints (${api.name})\n` +
            api.endpoints
              .map(
                (ep) =>
                  `### ${ep.method} ${ep.path}\n- **Summary**: ${ep.summary}\n- **Description**: ${ep.description}${
                    ep.parameters
                      ? '\n- **Parameters**: ' +
                        ep.parameters.map((p) => `${p.name} (${p.type}${p.required ? ', required' : ''}): ${p.description}`).join('; ')
                      : ''
                  }${ep.responseExample ? `\n- **Response Example**:\n\`\`\`json\n${ep.responseExample}\n\`\`\`` : ''}`
              )
              .join('\n\n') +
            '\n\n';
        }
        if (section === 'pricing' || section === 'all') {
          docText += `## Pricing (${api.name})\n- **Model**: ${api.pricing}\n- **Details**: ${api.pricingDetails}\n\n`;
        }
        if (section === 'sdks' || section === 'all') {
          docText += `## SDKs & Libraries (${api.name})\n` +
            api.sdks.map((s) => `- **${s.language}**: \`${s.installCommand}\` (package: ${s.package})`).join('\n') +
            '\n\n';
        }

        docText += `## Official Documentation Links\n- Portal: ${api.website}\n- Documentation: ${api.docsUrl}\n- API Reference: ${api.apiReferenceUrl}\n`;

        return {
          content: [{ type: 'text', text: docText }],
        };
      }

      case 'recommend_apis': {
        const task = (args?.task as string) || '';
        const result = await recommendWithGemini(task);

        let report = `# 🎯 Architectural API Recommendations (Powered by ${result.source === 'gemini' ? 'Google Gemini 3.8 Flash' : 'Architecture Engine'})\n\n`;
        report += `**Task**: ${task}\n\n`;
        report += `**Technical Analysis**: ${result.analysis}\n\n`;
        report += `## 🛠️ Required APIs Stack\n\n`;

        result.recommendations.forEach((rec, idx) => {
          const badge =
            rec.relevance === 'essential' ? '🔴 REQUIRED' : rec.relevance === 'recommended' ? '🟡 RECOMMENDED' : '🟢 OPTIONAL';
          report += `### ${idx + 1}. ${rec.api.name} (${badge})\n`;
          report += `- **Category**: ${rec.api.category}\n`;
          report += `- **Why Required**: ${rec.reason}\n`;
          report += `- **Integration Blueprint**: ${rec.integrationNotes}\n`;
          report += `- **Auth Method**: ${rec.api.authMethod}\n`;
          report += `- **Pricing Model**: ${rec.api.pricing} (${rec.api.pricingDetails})\n`;
          report += `- **Docs**: [${rec.api.docsUrl}](${rec.api.docsUrl})\n\n`;
        });

        report += `## 🚀 Expected Outcome\n`;
        report += `${result.expectedOutcome}\n\n`;
        report += `## 💡 Next Steps for Developer\n`;
        report += `1. Review auth credentials and set environment variables as outlined above.\n`;
        report += `2. Run provided install commands for the relevant SDKs.\n`;
        report += `3. Use \`get_api_docs\` with each API ID to retrieve exact endpoint schemas and snippets.\n`;

        return {
          content: [{ type: 'text', text: report }],
        };
      }

      case 'get_api_endpoints': {
        const apiId = (args?.apiId as string) || '';
        const api = getApiById(apiId);
        if (!api) {
          const live = await fetchLiveApiDocumentation(apiId);
          return {
            content: [{ type: 'text', text: live.documentationText }],
          };
        }

        return {
          content: [{ type: 'text', text: JSON.stringify(api.endpoints, null, 2) }],
        };
      }

      case 'compare_apis': {
        const apiIds = (args?.apiIds as string[]) || [];
        const comparison = compareApis(apiIds);

        let markdownTable = `| Feature | ${comparison.apiIds.map((id) => getApiById(id)?.name || id).join(' | ')} |\n`;
        markdownTable += `| --- | ${comparison.apiIds.map(() => '---').join(' | ')} |\n`;

        for (const crit of comparison.criteria) {
          markdownTable += `| **${crit.name}** | ${comparison.apiIds.map((id) => crit.values[id] || '-').join(' | ')} |\n`;
        }

        return {
          content: [{ type: 'text', text: markdownTable }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      isError: true,
      content: [{ type: 'text', text: `Error executing tool ${name}: ${message}` }],
    };
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`API Docs Hub MCP Server running with Gemini 3.8 Flash Recommender`);
}

run().catch((error) => {
  console.error('Fatal error running MCP server:', error);
  process.exit(1);
});
