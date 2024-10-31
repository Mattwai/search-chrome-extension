import { ServiceToken } from '../types/auth.types';

class TokenHandler {
  private static readonly TOKEN_PREFIX = 'service_token_';

  static async getServiceToken(service: string): Promise<ServiceToken | null> {
    try {
      const token = await chrome.storage.local.get(this.getTokenKey(service));
      const storedToken = token[this.getTokenKey(service)];
      
      if (!storedToken) {
        return null;
      }

      // Check if token is expired
      if (this.isTokenExpired(storedToken)) {
        await this.removeServiceToken(service);
        return null;
      }

      return storedToken;
    } catch (error) {
      console.error(`Failed to get token for ${service}:`, error);
      return null;
    }
  }

  static async setServiceToken(service: string, token: ServiceToken): Promise<void> {
    try {
      await chrome.storage.local.set({
        [this.getTokenKey(service)]: {
          ...token,
          created_time: Date.now() // Ensure we have a creation timestamp
        }
      });
    } catch (error) {
      console.error(`Failed to save token for ${service}:`, error);
      throw error;
    }
  }

  static async removeServiceToken(service: string): Promise<void> {
    try {
      await chrome.storage.local.remove(this.getTokenKey(service));
    } catch (error) {
      console.error(`Failed to remove token for ${service}:`, error);
      throw error;
    }
  }

  static async getAllServiceTokens(): Promise<{ [service: string]: ServiceToken }> {
    try {
      const allStorage = await chrome.storage.local.get(null);
      const tokens: { [service: string]: ServiceToken } = {};
      
      Object.entries(allStorage).forEach(([key, value]) => {
        if (key.startsWith(this.TOKEN_PREFIX)) {
          const service = key.replace(this.TOKEN_PREFIX, '');
          if (!this.isTokenExpired(value as ServiceToken)) {
            tokens[service] = value as ServiceToken;
          }
        }
      });
      
      return tokens;
    } catch (error) {
      console.error('Failed to get all service tokens:', error);
      return {};
    }
  }

  private static getTokenKey(service: string): string {
    return `${this.TOKEN_PREFIX}${service.toLowerCase()}`;
  }

  private static isTokenExpired(token: ServiceToken): boolean {
    return (Date.now() - token.created_time) / 1000 > token.expires_in;
  }
}

export default TokenHandler;
