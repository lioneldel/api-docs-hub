import { ApiEntry } from '../../types/api';

export const ecommerceApis: ApiEntry[] = [
  {
    id: 'shopify',
    name: 'Shopify Admin API (GraphQL & REST)',
    description: 'Premier e-commerce commerce platform API. Manage product catalogs, inventory levels, orders, fulfillments, customer data, and checkout experiences.',
    shortDescription: 'Product inventory, multi-channel orders, customer management, and checkout.',
    category: 'ecommerce',
    tags: ['ecommerce', 'shopify', 'storefront', 'products', 'inventory', 'orders', 'graphql'],
    website: 'https://shopify.dev',
    docsUrl: 'https://shopify.dev/docs/api/admin-graphql',
    apiReferenceUrl: 'https://shopify.dev/docs/api/admin-rest',
    baseUrl: 'https://{shop}.myshopify.com/admin/api/2026-01',
    authMethod: 'bearer-token',
    authSetupGuide: 'Create Custom App in Shopify Admin -> Apps and sales channels -> Develop apps. Use X-Shopify-Access-Token header with Admin API access token.',
    pricing: 'subscription',
    pricingDetails: 'Included with Shopify store plans (Basic $39/mo to Plus $2,000+/mo).',
    sdks: [
      { language: 'Node/TypeScript', package: '@shopify/shopify-api', installCommand: 'npm install @shopify/shopify-api' }
    ],
    quickstart: `import '@shopify/shopify-api/adapters/node';
import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: ['read_products', 'write_orders'],
  hostName: 'my-shop.myshopify.com',
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: false,
});`,
    endpoints: [
      {
        method: 'GET',
        path: '/products.json',
        summary: 'List Products',
        description: 'Retrieves store products with variants and images.'
      },
      {
        method: 'POST',
        path: '/orders.json',
        summary: 'Create Order',
        description: 'Creates a finalized order with line items and customer info.'
      }
    ],
    useCases: ['Syncing product inventory with ERP or warehousing systems', 'Custom headless storefront with Next.js Commerce', 'Automated order fulfillment'],
    alternatives: ['woocommerce', 'bigcommerce', 'medusajs'],
    lastUpdated: '2026-02-14'
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce REST API',
    description: 'Open-source WordPress e-commerce REST API. Full CRUD operations over products, variations, orders, coupons, webhooks, and customer records.',
    shortDescription: 'Open-source WordPress e-commerce REST API for products and orders.',
    category: 'ecommerce',
    tags: ['ecommerce', 'woocommerce', 'wordpress', 'open-source', 'products', 'orders'],
    website: 'https://woocommerce.com',
    docsUrl: 'https://woocommerce.github.io/woocommerce-rest-api-docs/',
    apiReferenceUrl: 'https://woocommerce.github.io/woocommerce-rest-api-docs/#introduction',
    baseUrl: 'https://example.com/wp-json/wc/v3',
    authMethod: 'basic-auth',
    authSetupGuide: 'Generate Consumer Key and Consumer Secret in WooCommerce -> Settings -> Advanced -> REST API. Send via HTTP Basic Auth over HTTPS.',
    pricing: 'free',
    pricingDetails: '100% free open-source software (self-hosted hosting costs apply).',
    sdks: [
      { language: 'Node.js', package: '@woocommerce/woocommerce-rest-api', installCommand: 'npm install @woocommerce/woocommerce-rest-api' }
    ],
    quickstart: `import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
const api = new WooCommerceRestApi({
  url: 'https://example.com',
  consumerKey: process.env.WOO_CONSUMER_KEY!,
  consumerSecret: process.env.WOO_CONSUMER_SECRET!,
  version: 'wc/v3'
});

const { data: products } = await api.get('products', { per_page: 20 });`,
    endpoints: [
      {
        method: 'GET',
        path: '/products',
        summary: 'List Products',
        description: 'Returns products with stock, pricing, and category filters.'
      }
    ],
    useCases: ['Self-hosted digital and physical stores without vendor lock-in', 'Mobile app client for existing WooCommerce site'],
    alternatives: ['shopify', 'medusajs'],
    lastUpdated: '2026-01-20'
  }
];
