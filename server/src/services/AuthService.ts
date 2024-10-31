import { ServiceToken, OAuthConfig } from '../types/auth.types';

export class AuthService {
  private static tokens: Map<string, ServiceToken> = new Map();
  private static oauthConfigs: Map<string, OAuthConfig> = new Map();

  static registerService(config: OAuthConfig): void {
    this.oauthConfigs.set(config.service, config);
  }

  static async getServiceToken(service: string): Promise<ServiceToken | null> {
    const token = this.tokens.get(service);
    if (!token) return null;

    if (this.isTokenExpired(token)) {
      return await this.refreshServiceToken(service);
    }
    return token;
  }

  static async handleAuthCallback(service: string, code: string, state: string): Promise<ServiceToken> {
    const config = this.oauthConfigs.get(service);
    if (!config) {
      throw new Error(`Service ${service} not configured`);
    }

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const data = await response.json();
    const token: ServiceToken = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      created_time: Date.now(),
      service: config.service,
    };

    this.tokens.set(service, token);
    return token;
  }

  private static async refreshServiceToken(service: string): Promise<ServiceToken | null> {
    const config = this.oauthConfigs.get(service);
    const currentToken = this.tokens.get(service);
    
    if (!config || !currentToken?.refresh_token) return null;

    try {
      const response = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: currentToken.refresh_token,
          client_id: config.clientId,
          client_secret: config.clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      const token: ServiceToken = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        created_time: Date.now(),
        service: config.service,
      };

      this.tokens.set(service, token);
      return token;
    } catch (error) {
      console.error(`Failed to refresh token for ${service}:`, error);
      return null;
    }
  }

  private static isTokenExpired(token: ServiceToken): boolean {
    return (Date.now() - token.created_time) / 1000 > token.expires_in;
  }
}
