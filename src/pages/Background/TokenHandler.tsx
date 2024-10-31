import ChromeStorageHandler from './ChromeStorageHandler';
import { ServiceToken, OAuthConfig } from './types';
import { Dispatch, SetStateAction } from 'react';

class TokenHandler {
  private static createTokenWithTimestamp(token: ServiceToken): ServiceToken {
    return { ...token, created_time: Date.now() };
  }

  static async getServiceToken(service: string): Promise<ServiceToken | null> {
    const token = await ChromeStorageHandler.GetServiceToken(service);
    
    if (token) {
      if (this.isTokenExpired(token)) {
        return await this.refreshServiceToken(service, token);
      }
      return token;
    }
    return null;
  }

  static async refreshServiceToken(service: string, token: ServiceToken): Promise<ServiceToken | null> {
    if (!token.refresh_token) {
      return null;
    }

    try {
      const config = await this.getServiceConfig(service);
      if (!config) return null;

      const response = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: token.refresh_token,
          client_id: config.clientId,
          client_secret: config.clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      const newToken: ServiceToken = this.createTokenWithTimestamp({
        access_token: data.access_token,
        refresh_token: data.refresh_token || token.refresh_token,
        expires_in: data.expires_in,
        created_time: Date.now(),
        service: service,
      });

      await ChromeStorageHandler.SetServiceToken(newToken);
      return newToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  static async generateServiceToken(
    service: string,
    code: string,
    config: OAuthConfig,
    setTokenState?: Dispatch<SetStateAction<ServiceToken | null>>
  ): Promise<ServiceToken | null> {
    try {
      const response = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          client_id: config.clientId,
          client_secret: config.clientSecret,
          redirect_uri: config.redirectUri,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate token');
      }

      const data = await response.json();
      const token: ServiceToken = this.createTokenWithTimestamp({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        created_time: Date.now(),
        service: service,
      });

      await ChromeStorageHandler.SetServiceToken(token);
      if (setTokenState) {
        setTokenState(token);
      }
      return token;
    } catch (error) {
      console.error('Error generating token:', error);
      return null;
    }
  }

  private static isTokenExpired(token: ServiceToken): boolean {
    return (Date.now() - token.created_time) / 1000 > token.expires_in;
  }

  private static async getServiceConfig(service: string): Promise<OAuthConfig | null> {
    // Implementation would depend on where you store your service configurations
    // This could be fetched from chrome storage or a central configuration file
    return null;
  }
}

export default TokenHandler;