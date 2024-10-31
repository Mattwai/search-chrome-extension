import { ServiceToken } from "./types";

class ChromeStorageHandler {
  private static TOKENS_KEY = 'service_tokens';
  private static CLIENT_KEY = 'client_data';

  static async GetServiceTokens(): Promise<{ [service: string]: ServiceToken }> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.TOKENS_KEY], (result) => {
        resolve(result[this.TOKENS_KEY] || {});
      });
    });
  }

  static async GetServiceToken(service: string): Promise<ServiceToken | null> {
    const tokens = await this.GetServiceTokens();
    return tokens[service] || null;
  }

  static async SetServiceToken(token: ServiceToken): Promise<void> {
    const tokens = await this.GetServiceTokens();
    tokens[token.service] = token;
    await chrome.storage.local.set({ [this.TOKENS_KEY]: tokens });
  }

  static async RemoveServiceToken(service: string): Promise<void> {
    const tokens = await this.GetServiceTokens();
    delete tokens[service];
    await chrome.storage.local.set({ [this.TOKENS_KEY]: tokens });
  }

  static async ClearAllTokens(): Promise<void> {
    await chrome.storage.local.remove([this.TOKENS_KEY]);
  }

  static async setClientStorage(client: { id: string, secret: string }): Promise<void> {
    await chrome.storage.local.set({ [this.CLIENT_KEY]: client });
  }
}

export default ChromeStorageHandler;