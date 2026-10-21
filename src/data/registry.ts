import { ApiEntry, CategoryInfo } from '../types/api';
import { CATEGORIES } from './categories';
import allApisJson from './all-apis-database.json';

export const ALL_APIS: ApiEntry[] = allApisJson as ApiEntry[];

// Dynamically compute category counts across all 3,910 APIs
export const CATEGORIES_WITH_COUNTS: CategoryInfo[] = CATEGORIES.map((cat) => ({
  ...cat,
  apiCount: ALL_APIS.filter((api) => api.category === cat.id).length,
}));

export function getApiById(id: string): ApiEntry | undefined {
  const normalized = id.toLowerCase().trim();
  return ALL_APIS.find(
    (api) =>
      api.id.toLowerCase() === normalized ||
      api.name.toLowerCase() === normalized ||
      api.name.toLowerCase().includes(normalized)
  );
}

export function getApisByCategory(categoryId: string): ApiEntry[] {
  return ALL_APIS.filter((api) => api.category === categoryId);
}
