
class ChromeStorageHandler {
  private static ACTIVE_SERVICES_KEY = 'active_services';

  static async GetActiveServices(): Promise<string[]> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.ACTIVE_SERVICES_KEY], (result) => {
        resolve(result[this.ACTIVE_SERVICES_KEY] || []);
      });
    });
  }

  static async SetActiveServices(services: string[]): Promise<void> {
    await chrome.storage.local.set({ [this.ACTIVE_SERVICES_KEY]: services });
  }

  static async ClearStorage(): Promise<void> {
    await chrome.storage.local.clear();
  }
}

export default ChromeStorageHandler;