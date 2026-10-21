import { ApiEntry } from '../../types/api';

export const authApis: ApiEntry[] = [
  {
    id: 'clerk',
    name: 'Clerk Auth API',
    description: 'Complete user management and authentication platform built for React, Next.js, and modern full-stack web frameworks with drop-in UI components, multi-session support, and organization management.',
    shortDescription: 'Modern authentication, user management, and org RBAC for Next.js & React.',
    category: 'auth',
    tags: ['auth', 'user-management', 'oauth', 'passkeys', 'sso', 'organizations', 'react', 'nextjs'],
    website: 'https://clerk.com',
    docsUrl: 'https://clerk.com/docs',
    apiReferenceUrl: 'https://clerk.com/docs/reference/backend-api',
    baseUrl: 'https://api.clerk.com/v1',
    authMethod: 'bearer-token',
    authSetupGuide: 'Obtain CLERK_SECRET_KEY from Clerk Dashboard. Include in request header: Authorization: Bearer <CLERK_SECRET_KEY>.',
    pricing: 'freemium',
    pricingDetails: 'Free up to 10,000 monthly active users (MAUs). Pro plans from $25/mo.',
    sdks: [
      { language: 'Node/Next.js', package: '@clerk/nextjs', installCommand: 'npm install @clerk/nextjs' },
      { language: 'JavaScript Backend', package: '@clerk/backend', installCommand: 'npm install @clerk/backend' }
    ],
    quickstart: `import { clerkClient } from '@clerk/backend';

const userList = await clerkClient.users.getUserList({ limit: 10 });
console.log(userList.data);`,
    endpoints: [
      {
        method: 'GET',
        path: '/users',
        summary: 'List Users',
        description: 'Returns a list of all users in the instance with pagination and filters.',
        parameters: [
          { name: 'limit', type: 'integer', required: false, description: 'Number of results to return (max 500)' },
          { name: 'email_address', type: 'string', required: false, description: 'Filter by email' }
        ]
      },
      {
        method: 'POST',
        path: '/users',
        summary: 'Create User',
        description: 'Directly creates a new user record with verified or unverified credentials.'
      },
      {
        method: 'POST',
        path: '/organizations',
        summary: 'Create Organization',
        description: 'Creates a multi-tenant B2B organization entity for team management.'
      }
    ],
    useCases: ['Next.js App Router authentication', 'B2B multi-tenant organization switching', 'Passkeys and passwordless logins'],
    alternatives: ['auth0', 'supabase-auth', 'workos', 'stytch'],
    lastUpdated: '2026-03-01'
  },
  {
    id: 'auth0',
    name: 'Auth0 by Okta Management API',
    description: 'Enterprise identity platform supporting enterprise federation (SAML, WS-Fed, OIDC), social logins, multi-factor authentication (MFA), and universal login.',
    shortDescription: 'Enterprise identity & access management platform with deep federation.',
    category: 'auth',
    tags: ['auth', 'enterprise', 'saml', 'sso', 'mfa', 'oauth2', 'jwt'],
    website: 'https://auth0.com',
    docsUrl: 'https://auth0.com/docs',
    apiReferenceUrl: 'https://auth0.com/docs/api/management/v2',
    baseUrl: 'https://{yourDomain}/api/v2',
    authMethod: 'oauth2',
    authSetupGuide: 'Request a Machine-to-Machine JWT token using OAuth2 client credentials flow at https://{yourDomain}/oauth/token with audience https://{yourDomain}/api/v2/.',
    pricing: 'freemium',
    pricingDetails: 'Free up to 7,500 MAUs. B2B / Enterprise plans custom pricing with SAML/SSO.',
    sdks: [
      { language: 'Node.js', package: 'auth0', installCommand: 'npm install auth0' },
      { language: 'Python', package: 'auth0-python', installCommand: 'pip install auth0-python' }
    ],
    quickstart: `import { ManagementClient } from 'auth0';

const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
});
const users = await auth0.users.getAll();`,
    endpoints: [
      {
        method: 'GET',
        path: '/users',
        summary: 'Get Users',
        description: 'List or search users using Lucene query syntax.'
      },
      {
        method: 'POST',
        path: '/connections',
        summary: 'Create Connection',
        description: 'Configures a social, enterprise (SAML/AD), or database identity provider.'
      }
    ],
    useCases: ['Enterprise B2B SAML SSO integration', 'Strict compliance and MFA regulatory requirements'],
    alternatives: ['clerk', 'okta', 'workos'],
    lastUpdated: '2026-02-15'
  },
  {
    id: 'supabase-auth',
    name: 'Supabase GoTrue Auth API',
    description: 'Open-source authentication service integrated with PostgreSQL Row Level Security (RLS). Supports email/password, magic links, phone OTP, OAuth, and custom JWT tokens.',
    shortDescription: 'Open-source Postgres-native auth with built-in Row Level Security.',
    category: 'auth',
    tags: ['auth', 'postgres', 'rls', 'jwt', 'open-source', 'magic-link', 'otp'],
    website: 'https://supabase.com/docs/guides/auth',
    docsUrl: 'https://supabase.com/docs/reference/javascript/auth-signup',
    apiReferenceUrl: 'https://supabase.com/docs/reference/api',
    baseUrl: 'https://<project-ref>.supabase.co/auth/v1',
    authMethod: 'api-key',
    authSetupGuide: 'Pass "apikey: <SUPABASE_ANON_KEY>" or "apikey: <SERVICE_ROLE_KEY>" in headers along with "Authorization: Bearer <JWT>".',
    pricing: 'freemium',
    pricingDetails: 'Free up to 50,000 monthly active users. Paid tier $25/month.',
    sdks: [
      { language: 'JavaScript/TypeScript', package: '@supabase/supabase-js', installCommand: 'npm install @supabase/supabase-js' },
      { language: 'Python', package: 'supabase', installCommand: 'pip install supabase' }
    ],
    quickstart: `import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'SecurePassword123!',
});`,
    endpoints: [
      {
        method: 'POST',
        path: '/signup',
        summary: 'Sign Up with Email/Password',
        description: 'Creates a new user record and sends confirmation email if configured.'
      },
      {
        method: 'POST',
        path: '/token?grant_type=password',
        summary: 'Sign In with Password',
        description: 'Exchanges email & password credentials for access and refresh JWT tokens.'
      },
      {
        method: 'GET',
        path: '/user',
        summary: 'Get Current User',
        description: 'Validates JWT token and returns authenticated user object.'
      }
    ],
    useCases: ['Direct integration with PostgreSQL RLS policies', 'Mobile & web apps using Supabase stack'],
    alternatives: ['firebase-auth', 'clerk', 'auth0'],
    lastUpdated: '2026-03-01'
  },
  {
    id: 'firebase-auth',
    name: 'Firebase Authentication API',
    description: 'Google Identity platform backend offering phone auth, social logins (Google, Apple, Facebook), anonymous login, and custom tokens across iOS, Android, and Web.',
    shortDescription: 'Cross-platform mobile and web identity powered by Google.',
    category: 'auth',
    tags: ['auth', 'google', 'firebase', 'mobile', 'sms', 'anonymous-auth'],
    website: 'https://firebase.google.com/products/auth',
    docsUrl: 'https://firebase.google.com/docs/auth',
    apiReferenceUrl: 'https://firebase.google.com/docs/reference/rest/auth',
    baseUrl: 'https://identitytoolkit.googleapis.com/v1',
    authMethod: 'api-key',
    authSetupGuide: 'Append API key to query params ?key=AIzaSy... or use Firebase Admin SDK initialized with service account JSON.',
    pricing: 'freemium',
    pricingDetails: 'Generous free tier. Phone auth free up to 10k/month, then pay-per-SMS.',
    sdks: [
      { language: 'Web/Node', package: 'firebase', installCommand: 'npm install firebase' },
      { language: 'Admin Node', package: 'firebase-admin', installCommand: 'npm install firebase-admin' }
    ],
    quickstart: `import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth(initializeApp({ apiKey: 'YOUR_KEY', projectId: 'YOUR_PROJECT' }));
const cred = await signInWithEmailAndPassword(auth, 'user@example.com', 'pwd123');`,
    endpoints: [
      {
        method: 'POST',
        path: '/accounts:signInWithPassword',
        summary: 'Sign In With Password',
        description: 'Authenticates user with email and password via REST.'
      },
      {
        method: 'POST',
        path: '/accounts:lookup',
        summary: 'Lookup User Info',
        description: 'Returns account profile for a given Firebase ID token.'
      }
    ],
    useCases: ['Mobile applications (Flutter, React Native, Swift)', 'Google account one-tap logins'],
    alternatives: ['supabase-auth', 'clerk', 'cognito'],
    lastUpdated: '2026-01-30'
  },
  {
    id: 'workos',
    name: 'WorkOS API',
    description: 'APIs to make your SaaS app enterprise-ready. Enables Enterprise SSO (SAML/OIDC), SCIM Directory Sync, Fine-Grained Authorization (FGA), and Audit Logs with minimal engineering overhead.',
    shortDescription: 'Enterprise SSO, Directory Sync (SCIM), and AuthKit for B2B SaaS.',
    category: 'auth',
    tags: ['auth', 'enterprise', 'saml', 'scim', 'directory-sync', 'audit-logs', 'b2b-saas'],
    website: 'https://workos.com',
    docsUrl: 'https://workos.com/docs',
    apiReferenceUrl: 'https://workos.com/docs/reference',
    baseUrl: 'https://api.workos.com',
    authMethod: 'bearer-token',
    authSetupGuide: 'Obtain API Key from WorkOS Dashboard and send as Authorization: Bearer <API_KEY>.',
    pricing: 'freemium',
    pricingDetails: 'AuthKit free up to 1M users. SSO starts at $125/connection/month.',
    sdks: [
      { language: 'Node.js', package: '@workos-inc/node', installCommand: 'npm install @workos-inc/node' },
      { language: 'Python', package: 'workos', installCommand: 'pip install workos' }
    ],
    quickstart: `import { WorkOS } from '@workos-inc/node';
const workos = new WorkOS(process.env.WORKOS_API_KEY);

const authorizationUrl = workos.sso.getAuthorizationUrl({
  clientID: process.env.WORKOS_CLIENT_ID!,
  redirectURI: 'https://myapp.com/callback',
  domain: 'acme.com',
});`,
    endpoints: [
      {
        method: 'GET',
        path: '/sso/authorize',
        summary: 'Get SSO Authorization URL',
        description: 'Initiates SAML or OIDC single sign-on redirect flow.'
      },
      {
        method: 'GET',
        path: '/directory_sync/users',
        summary: 'List Directory Users',
        description: 'Retrieves corporate users synced via SCIM (Okta, Azure AD, etc.).'
      }
    ],
    useCases: ['Enterprise plan upgrades for SaaS', 'SCIM employee onboarding/deprovisioning', 'Audit logs compliance'],
    alternatives: ['auth0', 'stytch', 'clerk'],
    lastUpdated: '2026-03-02'
  }
];
