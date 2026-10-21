import { ApiEntry } from '../../types/api';

export const paymentsApis: ApiEntry[] = [
  {
    id: 'stripe',
    name: 'Stripe API',
    description: 'Financial infrastructure platform for internet businesses. Enables card processing, subscriptions, global payouts, fraud detection (Radar), and billing.',
    shortDescription: 'Global payments, billing, and subscription infrastructure.',
    category: 'payments',
    tags: ['payments', 'checkout', 'subscriptions', 'invoicing', 'cards', 'financial'],
    website: 'https://stripe.com',
    docsUrl: 'https://docs.stripe.com',
    apiReferenceUrl: 'https://docs.stripe.com/api',
    baseUrl: 'https://api.stripe.com/v1',
    authMethod: 'bearer-token',
    authSetupGuide: 'Obtain secret key (sk_test_... or sk_live_...) from Dashboard -> Developers -> API Keys. Pass in Authorization header as "Bearer sk_test_...".',
    pricing: 'pay-as-you-go',
    pricingDetails: '2.9% + 30¢ per successful card charge in the US. Volume discounts for enterprise.',
    sdks: [
      { language: 'Node.js', package: 'stripe', installCommand: 'npm install stripe' },
      { language: 'Python', package: 'stripe', installCommand: 'pip install stripe' },
      { language: 'Go', package: 'github.com/stripe/stripe-go/v79', installCommand: 'go get -u github.com/stripe/stripe-go/v79' }
    ],
    quickstart: `import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000,
  currency: 'usd',
  automatic_payment_methods: { enabled: true },
});
console.log(paymentIntent.client_secret);`,
    endpoints: [
      {
        method: 'POST',
        path: '/payment_intents',
        summary: 'Create PaymentIntent',
        description: 'Creates a PaymentIntent object to start a payment flow.',
        parameters: [
          { name: 'amount', type: 'integer', required: true, description: 'Amount in cents (e.g. 2000 for $20.00)' },
          { name: 'currency', type: 'string', required: true, description: 'Three-letter ISO currency code (e.g. usd)' }
        ],
        responseExample: '{\n  "id": "pi_123",\n  "amount": 2000,\n  "currency": "usd",\n  "status": "requires_payment_method"\n}'
      },
      {
        method: 'POST',
        path: '/checkout/sessions',
        summary: 'Create Checkout Session',
        description: 'Generates a pre-built hosted Stripe checkout page URL.',
        parameters: [
          { name: 'success_url', type: 'string', required: true, description: 'Redirect URL upon success' },
          { name: 'line_items', type: 'array', required: true, description: 'Items to purchase' }
        ]
      },
      {
        method: 'POST',
        path: '/refunds',
        summary: 'Create Refund',
        description: 'Initiate full or partial refund for a charge or payment intent.'
      }
    ],
    useCases: ['E-commerce checkout', 'SaaS subscriptions', 'Marketplace payouts with Stripe Connect', 'Invoicing and billing'],
    alternatives: ['paypal', 'square', 'paddle', 'razorpay'],
    lastUpdated: '2026-03-01'
  },
  {
    id: 'paypal',
    name: 'PayPal REST API',
    description: 'Comprehensive global payment gateway supporting PayPal wallet, card transactions, recurring subscriptions, and peer-to-peer transfers.',
    shortDescription: 'Accept PayPal wallet payments and cards worldwide.',
    category: 'payments',
    tags: ['payments', 'wallet', 'checkout', 'subscriptions', 'cards'],
    website: 'https://developer.paypal.com',
    docsUrl: 'https://developer.paypal.com/docs/api/overview/',
    apiReferenceUrl: 'https://developer.paypal.com/api/rest/',
    baseUrl: 'https://api-m.paypal.com/v2',
    authMethod: 'oauth2',
    authSetupGuide: 'POST to /v1/oauth2/token with client ID and secret using Basic Auth to obtain OAuth 2.0 Bearer access token.',
    pricing: 'pay-as-you-go',
    pricingDetails: '3.49% + $0.49 for standard credit/debit, 2.99% for standard PayPal.',
    sdks: [
      { language: 'Node.js', package: '@paypal/paypal-server-sdk', installCommand: 'npm install @paypal/paypal-server-sdk' },
      { language: 'Python', package: 'paypalrestsdk', installCommand: 'pip install paypalrestsdk' }
    ],
    quickstart: `import { Client, Environment, OrdersController } from '@paypal/paypal-server-sdk';
const client = new Client({
  clientCredentialsAuthCredentials: {
    clientId: process.env.PAYPAL_CLIENT_ID!,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET!
  },
  environment: Environment.Sandbox
});
const ordersController = new OrdersController(client);
const { result } = await ordersController.createOrder({
  body: { intent: 'CAPTURE', purchaseUnits: [{ amount: { currencyCode: 'USD', value: '25.00' } }] }
});`,
    endpoints: [
      {
        method: 'POST',
        path: '/checkout/orders',
        summary: 'Create Order',
        description: 'Initiates a PayPal checkout order that the buyer approves.',
        parameters: [
          { name: 'intent', type: 'string', required: true, description: 'CAPTURE or AUTHORIZE' }
        ]
      },
      {
        method: 'POST',
        path: '/checkout/orders/{id}/capture',
        summary: 'Capture Payment for Order',
        description: 'Captures payment for approved order.'
      }
    ],
    useCases: ['PayPal button on e-commerce sites', 'International buyer conversion', 'Subscription billing'],
    alternatives: ['stripe', 'square', 'braintree'],
    lastUpdated: '2026-02-15'
  },
  {
    id: 'square',
    name: 'Square Web Payments API',
    description: 'Omnichannel payment API unifying brick-and-mortar POS, in-person hardware, online web checkouts, gift cards, and inventory management.',
    shortDescription: 'Omnichannel in-person & online payment processing.',
    category: 'payments',
    tags: ['payments', 'pos', 'retail', 'in-person', 'cards'],
    website: 'https://squareup.com',
    docsUrl: 'https://developer.squareup.com/docs',
    apiReferenceUrl: 'https://developer.squareup.com/reference/square',
    baseUrl: 'https://connect.squareup.com/v2',
    authMethod: 'bearer-token',
    authSetupGuide: 'Get Developer Access Token from Square Developer Dashboard and add Authorization: Bearer <ACCESS_TOKEN>.',
    pricing: 'pay-as-you-go',
    pricingDetails: '2.9% + 30¢ for online transactions; 2.6% + 10¢ in-person.',
    sdks: [
      { language: 'Node.js', package: 'square', installCommand: 'npm install square' },
      { language: 'Python', package: 'squareup', installCommand: 'pip install squareup' }
    ],
    quickstart: `import { Client, Environment } from 'square';
const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox
});
const response = await client.paymentsApi.createPayment({
  sourceId: 'cnon:card-nonce-ok',
  idempotencyKey: crypto.randomUUID(),
  amountMoney: { amount: BigInt(1500), currency: 'USD' }
});`,
    endpoints: [
      {
        method: 'POST',
        path: '/payments',
        summary: 'Create Payment',
        description: 'Charges a payment source (card nonce, customer card on file).'
      },
      {
        method: 'POST',
        path: '/online-checkout/payment-links',
        summary: 'Create Payment Link',
        description: 'Creates a checkout link for customer payment.'
      }
    ],
    useCases: ['Retail POS integration', 'Restaurant ordering', 'Web checkout with sync to in-store catalog'],
    alternatives: ['stripe', 'paypal', 'clover'],
    lastUpdated: '2026-01-20'
  },
  {
    id: 'razorpay',
    name: 'Razorpay API',
    description: 'Leading payment gateway in India supporting UPI, Cards, NetBanking, Wallets, EMI, and recurring subscription payments.',
    shortDescription: 'All-in-one payment gateway for India and emerging markets (UPI, cards, netbanking).',
    category: 'payments',
    tags: ['payments', 'upi', 'india', 'netbanking', 'subscriptions'],
    website: 'https://razorpay.com',
    docsUrl: 'https://razorpay.com/docs',
    apiReferenceUrl: 'https://razorpay.com/docs/api',
    baseUrl: 'https://api.razorpay.com/v1',
    authMethod: 'basic-auth',
    authSetupGuide: 'Use Key ID and Key Secret as HTTP Basic Auth credentials.',
    pricing: 'pay-as-you-go',
    pricingDetails: '2% standard fee on Indian cards, UPI, and netbanking.',
    sdks: [
      { language: 'Node.js', package: 'razorpay', installCommand: 'npm install razorpay' },
      { language: 'Python', package: 'razorpay', installCommand: 'pip install razorpay' }
    ],
    quickstart: `import Razorpay from 'razorpay';
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});
const order = await instance.orders.create({
  amount: 50000, // in paise = INR 500
  currency: 'INR',
  receipt: 'order_rcptid_11'
});`,
    endpoints: [
      {
        method: 'POST',
        path: '/orders',
        summary: 'Create Order',
        description: 'Creates an order for tracking payment transactions.'
      },
      {
        method: 'POST',
        path: '/payments/{id}/capture',
        summary: 'Capture Payment',
        description: 'Captures authorized payment.'
      }
    ],
    useCases: ['Indian e-commerce stores', 'UPI QR and intent flows', 'Domestic subscription recurring debits'],
    alternatives: ['stripe', 'cashfree', 'phonepe'],
    lastUpdated: '2026-02-10'
  },
  {
    id: 'paddle',
    name: 'Paddle Billing API',
    description: 'Merchant of Record (MoR) platform tailored for SaaS businesses that handles sales tax calculation, EU VAT compliance, invoicing, and subscriptions.',
    shortDescription: 'Merchant of Record for SaaS handling global taxes and billing.',
    category: 'payments',
    tags: ['payments', 'saas', 'merchant-of-record', 'tax-compliance', 'subscriptions'],
    website: 'https://paddle.com',
    docsUrl: 'https://developer.paddle.com',
    apiReferenceUrl: 'https://developer.paddle.com/api-reference/overview',
    baseUrl: 'https://api.paddle.com',
    authMethod: 'bearer-token',
    authSetupGuide: 'Generate API Key in Paddle dashboard under Developer Tools -> Authentication and include in Authorization header as Bearer token.',
    pricing: 'pay-as-you-go',
    pricingDetails: '5% + 50¢ per transaction; covers sales tax liability.',
    sdks: [
      { language: 'Node.js', package: '@paddle/paddle-node-sdk', installCommand: 'npm install @paddle/paddle-node-sdk' }
    ],
    quickstart: `import { Paddle, Environment } from '@paddle/paddle-node-sdk';
const paddle = new Paddle(process.env.PADDLE_API_KEY!, { environment: Environment.sandbox });
const customer = await paddle.customers.create({ email: 'user@example.com', name: 'Alex Doe' });`,
    endpoints: [
      {
        method: 'POST',
        path: '/transactions',
        summary: 'Create Transaction',
        description: 'Creates a checkout transaction with items and tax calculations.'
      },
      {
        method: 'GET',
        path: '/subscriptions/{id}',
        summary: 'Get Subscription',
        description: 'Retrieve details of an active SaaS subscription.'
      }
    ],
    useCases: ['Global SaaS product without establishing international tax entities', 'Digital software sales'],
    alternatives: ['lemon-squeezy', 'stripe'],
    lastUpdated: '2026-03-05'
  },
  {
    id: 'lemon-squeezy',
    name: 'Lemon Squeezy API',
    description: 'Merchant of Record for digital products, software licenses, SaaS subscriptions, and digital downloads with automated tax handling.',
    shortDescription: 'All-in-one MoR platform for creators and software developers.',
    category: 'payments',
    tags: ['payments', 'saas', 'digital-goods', 'merchant-of-record', 'license-keys'],
    website: 'https://lemonsqueezy.com',
    docsUrl: 'https://docs.lemonsqueezy.com',
    apiReferenceUrl: 'https://docs.lemonsqueezy.com/api',
    baseUrl: 'https://api.lemonsqueezy.com/v1',
    authMethod: 'bearer-token',
    authSetupGuide: 'Create API key in Settings -> API and send in headers as Authorization: Bearer <API_KEY>.',
    pricing: 'pay-as-you-go',
    pricingDetails: '5% + 50¢ per transaction.',
    sdks: [
      { language: 'Node.js', package: '@lemonsqueezy/lemonsqueezy.js', installCommand: 'npm install @lemonsqueezy/lemonsqueezy.js' }
    ],
    quickstart: `import { lemonSqueezySetup, createCheckout } from '@lemonsqueezy/lemonsqueezy.js';
lemonSqueezySetup({ apiKey: process.env.LEMON_SQUEEZY_API_KEY });
const checkout = await createCheckout(process.env.STORE_ID!, process.env.VARIANT_ID!);`,
    endpoints: [
      {
        method: 'POST',
        path: '/checkouts',
        summary: 'Create Checkout',
        description: 'Generates a customized checkout session.'
      },
      {
        method: 'POST',
        path: '/licenses/validate',
        summary: 'Validate License Key',
        description: 'Verify license key status and activation limit.'
      }
    ],
    useCases: ['Selling developer tools and desktop apps', 'Creator digital downloads', 'Software licensing'],
    alternatives: ['paddle', 'stripe', 'gumroad'],
    lastUpdated: '2026-02-28'
  }
];
