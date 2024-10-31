export interface UnifiedSearchResult {
  id: string;
  title: string;
  content: string;
  url: string;
  source: string;
  timestamp: Date;
  type: string;
}

export interface SearchState {
  activeServices: string[];
  tokens: { [service: string]: ServiceToken };
}

// Import ServiceToken if needed
import { ServiceToken } from './auth.types';
