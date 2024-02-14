import ChromeStorageHandler from './ChromeStorageHandler';
import GenerateAccessToken from './utils/GenerateAccessToken';
import { AccessTokenResponse, Client } from './types';
import RefreshAccessToken from './RefreshAccessToken';
import { Dispatch, SetStateAction } from 'react';


const setTokenCreation = (tokenResponse: AccessTokenResponse): AccessTokenResponse => {
  const newTokenResponse = { ...tokenResponse, created_time: Date.now()};
  return newTokenResponse
}

const getTokenResponse = async (setTokenResponseState: Dispatch<SetStateAction<AccessTokenResponse | null>>): Promise<AccessTokenResponse | null> => {
  const tokenResponseResult = await ChromeStorageHandler.GetAccessTokenStorage();
  const clientResponseResult = await ChromeStorageHandler.GetClientStorage();
  if(tokenResponseResult && clientResponseResult){
    console.log('FROM LOCAL STORAGE: Token response is set to ' + JSON.stringify(tokenResponseResult.access_token));
    if (isTokenExpired(tokenResponseResult)) {
        return await refreshAccessToken(clientResponseResult, tokenResponseResult, setTokenResponseState);
      } else {
          return tokenResponseResult;
      }
    }
  else{
    return null;
  }
}

const refreshAccessToken = async (client: Client, accessToken: AccessTokenResponse, setTokenResponseState: Dispatch<SetStateAction<AccessTokenResponse | null>>): Promise<AccessTokenResponse | null> => {
  return await RefreshAccessToken(client, accessToken, setTokenResponseState);
}

const generateAccessToken = (code: string, client: Client, setTokenResponseState: Dispatch<SetStateAction<AccessTokenResponse | null>>) => {
  GenerateAccessToken(code, client, setTokenResponseState);
}

const isTokenExpired = (tokenResponse: AccessTokenResponse) => {
  return (Date.now() - tokenResponse.created_time) / 1000 > tokenResponse.expires_in;
}

export const TokenHandler = {
  setTokenCreation, 
  getTokenResponse,
  refreshAccessToken,
  generateAccessToken
}

export default TokenHandler;