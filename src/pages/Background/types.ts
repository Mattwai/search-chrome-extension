export interface ServiceToken {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  created_time: number;
  service: string;
}

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

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authUrl: string;
  tokenUrl: string;
  scopes: string[];
  service: string;
}

export interface ServiceConfig {
  name: string;
  authUrl: string;
  tokenUrl: string;
  scopes: string[];
  clientId: string;
} 