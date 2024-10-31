export interface ServiceToken {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  created_time: number;
  service: string;
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
