/** Supported API categories */
export type ApiCategory =
  | 'payments'
  | 'auth'
  | 'ai-ml'
  | 'cloud-storage'
  | 'messaging'
  | 'database'
  | 'maps-location'
  | 'crm-business'
  | 'ecommerce'
  | 'devops';

/** HTTP methods */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

/** Authentication method types */
export type AuthMethod =
  | 'api-key'
  | 'oauth2'
  | 'bearer-token'
  | 'basic-auth'
  | 'jwt'
  | 'webhook-signature'
  | 'none';

/** Pricing model types */
export type PricingModel = 'free' | 'freemium' | 'pay-as-you-go' | 'subscription' | 'enterprise';

/** Parameter definition for an endpoint */
export interface ApiParameter {
  readonly name: string;
  readonly type: string;
  readonly required: boolean;
  readonly description: string;
  readonly example?: string;
}

/** Single API endpoint definition */
export interface ApiEndpoint {
  readonly method: HttpMethod;
  readonly path: string;
  readonly summary: string;
  readonly description: string;
  readonly parameters?: readonly ApiParameter[];
  readonly requestBody?: string;
  readonly responseExample?: string;
  readonly rateLimit?: string;
}

/** SDK/library availability */
export interface SdkInfo {
  readonly language: string;
  readonly package: string;
  readonly installCommand: string;
}

/** Full API entry in the registry */
export interface ApiEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly shortDescription: string;
  readonly category: ApiCategory;
  readonly tags: readonly string[];
  readonly website: string;
  readonly docsUrl: string;
  readonly apiReferenceUrl: string;
  readonly baseUrl: string;
  readonly authMethod: AuthMethod;
  readonly authSetupGuide: string;
  readonly pricing: PricingModel;
  readonly pricingDetails: string;
  readonly sdks: readonly SdkInfo[];
  readonly quickstart: string;
  readonly endpoints: readonly ApiEndpoint[];
  readonly useCases: readonly string[];
  readonly alternatives: readonly string[];
  readonly logoUrl?: string;
  readonly lastUpdated: string;
}

/** Category definition with metadata */
export interface CategoryInfo {
  readonly id: ApiCategory;
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly color: string;
  readonly apiCount: number;
}

/** Search result with relevance score */
export interface SearchResult {
  readonly api: ApiEntry;
  readonly score: number;
  readonly matchedFields: readonly string[];
}

/** API recommendation with reasoning */
export interface ApiRecommendation {
  readonly api: ApiEntry;
  readonly relevance: 'essential' | 'recommended' | 'optional';
  readonly reason: string;
  readonly integrationNotes: string;
}

/** Comparison criterion */
export interface ComparisonResult {
  readonly apiIds: readonly string[];
  readonly criteria: readonly ComparisonCriterion[];
}

export interface ComparisonCriterion {
  readonly name: string;
  readonly values: Record<string, string>;
}
