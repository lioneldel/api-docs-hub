import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ALL_APIS as CURATED_APIS } from '../src/data/registry';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PublicApiItem {
  API: string;
  Description: string;
  Auth: string;
  HTTPS: boolean;
  Cors: string;
  Link: string;
  Category: string;
}

interface ApisGuruItem {
  added: string;
  preferred: string;
  versions: Record<
    string,
    {
      info: {
        title: string;
        description?: string;
        contact?: { url?: string; email?: string; name?: string };
        'x-apisguru-categories'?: string[];
        'x-origin'?: Array<{ url: string; format: string }>;
        'x-logo'?: { url?: string };
      };
      swaggerUrl?: string;
      swaggerYamlUrl?: string;
      link?: string;
    }
  >;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function mapAuth(auth: string = ''): 'api-key' | 'oauth2' | 'bearer-token' | 'basic-auth' | 'none' {
  const lower = auth.toLowerCase();
  if (lower.includes('oauth')) return 'oauth2';
  if (lower.includes('bearer')) return 'bearer-token';
  if (lower.includes('apikey') || lower.includes('key')) return 'api-key';
  if (lower.includes('basic')) return 'basic-auth';
  return 'none';
}

function mapCategory(cat: string = ''): string {
  const lower = cat.toLowerCase();
  if (lower.includes('ai') || lower.includes('machine_learning')) return 'ai-ml';
  if (lower.includes('pay') || lower.includes('finance') || lower.includes('crypto')) return 'payments';
  if (lower.includes('auth') || lower.includes('security')) return 'auth';
  if (lower.includes('cloud') || lower.includes('storage') || lower.includes('file')) return 'cloud-storage';
  if (lower.includes('email') || lower.includes('message') || lower.includes('telecom')) return 'messaging';
  if (lower.includes('data') || lower.includes('backend')) return 'database';
  if (lower.includes('map') || lower.includes('location') || lower.includes('geocoding') || lower.includes('transport')) return 'maps-location';
  if (lower.includes('crm') || lower.includes('business') || lower.includes('customer') || lower.includes('project_management')) return 'crm-business';
  if (lower.includes('commerce') || lower.includes('store') || lower.includes('shopping')) return 'ecommerce';
  if (lower.includes('dev') || lower.includes('git') || lower.includes('ci') || lower.includes('host') || lower.includes('monitor')) return 'devops';
  return slugify(cat) || 'general';
}

async function main() {
  console.log('🔄 Building Comprehensive Unified API Directory...');

  const finalApis: any[] = [];
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  // 1. Add curated high-value APIs first
  for (const api of CURATED_APIS) {
    seenIds.add(api.id);
    seenNames.add(api.name.toLowerCase().trim());
    finalApis.push(api);
  }
  console.log(`✅ Loaded ${finalApis.length} curated rich developer APIs.`);

  // 2. Add APIs.guru (2,500+ OpenAPI specifications)
  const apisGuruRaw = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../src/data/raw/apis-guru.json'), 'utf8')
  ) as Record<string, ApisGuruItem>;

  let guruAdded = 0;
  for (const [providerKey, provider] of Object.entries(apisGuruRaw)) {
    const prefVersionKey = provider.preferred;
    const version = provider.versions[prefVersionKey];
    if (!version || !version.info) continue;

    const title = version.info.title || providerKey;
    const nameLower = title.toLowerCase().trim();
    if (seenNames.has(nameLower)) continue;

    const id = slugify(providerKey);
    if (seenIds.has(id)) continue;

    const rawCats = version.info['x-apisguru-categories'] || [];
    const mainCat = rawCats[0] || 'developer_tools';
    const normalizedCategory = mapCategory(mainCat);

    const desc = version.info.description || `Official API specification for ${title}.`;
    const cleanDesc = desc.replace(/<[^>]*>?/gm, '').slice(0, 500);

    const docsLink =
      version.info.contact?.url ||
      (version.info['x-origin'] && version.info['x-origin'][0]?.url) ||
      version.swaggerUrl ||
      '';

    const entry = {
      id,
      name: title,
      description: cleanDesc,
      shortDescription: cleanDesc.slice(0, 140) + (cleanDesc.length > 140 ? '...' : ''),
      category: normalizedCategory,
      tags: [normalizedCategory, mainCat, ...rawCats].filter(Boolean),
      website: version.info.contact?.url || docsLink,
      docsUrl: docsLink,
      apiReferenceUrl: version.swaggerUrl || docsLink,
      baseUrl: version.swaggerUrl ? `OpenAPI Spec: ${version.swaggerUrl}` : docsLink,
      authMethod: 'api-key',
      authSetupGuide: `Obtain API credentials from ${title} developer portal. Include credentials in HTTP headers as per standard OpenAPI spec.`,
      pricing: 'freemium',
      pricingDetails: 'Developer tier / public API specifications available.',
      sdks: [
        { language: 'OpenAPI / Swagger', package: id, installCommand: `npx @openapitools/openapi-generator-cli generate -i ${version.swaggerUrl || docsLink} -g typescript-fetch` }
      ],
      quickstart: `// Generated OpenAPI integration for ${title}
// Spec: ${version.swaggerUrl || docsLink}
const response = await fetch('${version.swaggerUrl || docsLink}');
const spec = await response.json();
console.log('API loaded:', spec.info.title);`,
      endpoints: [
        {
          method: 'GET',
          path: '/openapi.json',
          summary: 'Retrieve OpenAPI Specification',
          description: `Full machine-readable OpenAPI schema for ${title}.`,
        }
      ],
      useCases: [`Integrate with ${title}`, 'Automated OpenAPI client generation', 'Custom workflow scripting'],
      alternatives: [],
      logoUrl: version.info['x-logo']?.url,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    seenIds.add(id);
    seenNames.add(nameLower);
    finalApis.push(entry);
    guruAdded++;
  }
  console.log(`✅ Loaded ${guruAdded} APIs from APIs.guru OpenAPI directory.`);

  // 3. Add Public-APIs catalog (1,858 entries)
  const publicApisRaw = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../src/data/raw/public-apis.json'), 'utf8')
  );

  let publicAdded = 0;
  for (const item of publicApisRaw.entries as PublicApiItem[]) {
    const name = item.API.trim();
    const nameLower = name.toLowerCase();
    if (seenNames.has(nameLower)) continue;

    let id = slugify(name);
    if (!id || id.length < 2) id = `api-${Math.random().toString(36).substring(2, 8)}`;
    if (seenIds.has(id)) {
      id = `${id}-${Math.floor(Math.random() * 1000)}`;
    }

    const normalizedCat = mapCategory(item.Category);
    const authMethod = mapAuth(item.Auth);

    const entry = {
      id,
      name,
      description: item.Description,
      shortDescription: item.Description,
      category: normalizedCat,
      tags: [normalizedCat, slugify(item.Category), authMethod].filter(Boolean),
      website: item.Link,
      docsUrl: item.Link,
      apiReferenceUrl: item.Link,
      baseUrl: item.Link,
      authMethod,
      authSetupGuide:
        authMethod === 'none'
          ? 'No authentication required. Direct public access.'
          : `Generate an ${authMethod} from the provider portal (${item.Link}) and pass in request headers.`,
      pricing: authMethod === 'none' ? 'free' : 'freemium',
      pricingDetails: item.Auth === 'No' ? 'Completely free public API' : 'Free tier / developer plan available',
      sdks: [
        { language: 'REST / Fetch', package: 'fetch', installCommand: 'npm install node-fetch' }
      ],
      quickstart: `const response = await fetch('${item.Link}');
const data = await response.json();
console.log(data);`,
      endpoints: [
        {
          method: 'GET',
          path: '/',
          summary: 'Root API Endpoint',
          description: item.Description,
        }
      ],
      useCases: [`Access ${name} services`, item.Category, 'App development'],
      alternatives: [],
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    seenIds.add(id);
    seenNames.add(nameLower);
    finalApis.push(entry);
    publicAdded++;
  }
  console.log(`✅ Loaded ${publicAdded} APIs from Public-APIs catalog.`);

  console.log(`\n🎉 TOTAL UNIFIED APIS IN DIRECTORY: ${finalApis.length} APIS!`);

  // Write out as JSON database
  const outPath = path.resolve(__dirname, '../src/data/all-apis-database.json');
  fs.writeFileSync(outPath, JSON.stringify(finalApis, null, 2), 'utf8');
  console.log(`📁 Wrote all-apis-database.json (${(fs.statSync(outPath).size / 1024 / 1024).toFixed(2)} MB)`);
}

main().catch(console.error);
