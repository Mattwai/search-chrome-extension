import { AccessTokenResponse, Client } from "./types";


function GetAccessTokenStorage(): Promise<AccessTokenResponse | null> {
    return new Promise((resolve) => {
        chrome.storage.local.get(['tokenResponse'], (tokenResult) => {
            const tokenResponseResult = tokenResult.tokenResponse as AccessTokenResponse;
            resolve(tokenResponseResult);});
    });
}

function SetAccessTokenStorage(tokenResponse: AccessTokenResponse): void {
    chrome.storage.local.set({'tokenResponse':tokenResponse}, () =>{
        console.log('SET NEW: Token response is set to ' + JSON.stringify(tokenResponse));
      });
    }

// should NOT store client in local storage, only for testing (need backend)
function SetClientStorage(client: Client){
    chrome.storage.local.set({'client':client}, () => {
        console.log('SET Client ' + JSON.stringify(client));
      });
}

function GetClientStorage(): Promise<Client | null> {
    return new Promise((resolve) => {
        chrome.storage.local.get(['client'], (clientResult) => {
            const clientResponseResult = clientResult.client as Client;
            resolve(clientResponseResult);});
    });
}
      

export const ChromeStorageHandler = {
    GetAccessTokenStorage,
    SetAccessTokenStorage,
    SetClientStorage,
    GetClientStorage
  }
  
  export default ChromeStorageHandler;