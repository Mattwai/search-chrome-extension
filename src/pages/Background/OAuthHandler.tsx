import { OAuthConfig, ServiceToken } from './types';
import ChromeStorageHandler from './ChromeStorageHandler';

export class OAuthHandler {
  private config: OAuthConfig;

  constructor(config: OAuthConfig) {
    this.config = config;
  }

  async authorize(): Promise<void> {
    const state = Math.random().toString(36).substring(7);
    const authUrl = this.buildAuthUrl(state);
    
    // Store state for validation
    localStorage.setItem(`${this.config.service}_state`, state);
    
    // Open authorization window
    window.location.href = authUrl;
  }

  private buildAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scopes.join(' '),
      state: state,
    });

    return `${this.config.authUrl}?${params.toString()}`;
  }

  async handleCallback(code: string, state: string): Promise<ServiceToken> {
    // Validate state
    const savedState = localStorage.getItem(`${this.config.service}_state`);
    if (state !== savedState) {
      throw new Error('Invalid state parameter');
    }

    // Exchange code for token
    const response = await fetch(this.config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUri,
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
      service: this.config.service,
    };

    // Store the token
    await ChromeStorageHandler.SetServiceToken(token);

    return token;
  }

  async refreshToken(refreshToken: string): Promise<ServiceToken> {
    const response = await fetch(this.config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
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
      service: this.config.service,
    };

    // Store the token
    await ChromeStorageHandler.SetServiceToken(token);

    return token;
  }
} 