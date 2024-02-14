import { Dispatch, SetStateAction } from "react";
import TokenHandler from "./TokenHandler";
import { Client, AccessTokenResponse } from "./types";
import RefreshApiCall from "./utils/RefreshApiCall";
import ChromeStorageHandler from "./ChromeStorageHandler";

  
  function RefreshAccessToken(client: Client, accessToken: AccessTokenResponse, setTokenResponseState: Dispatch<SetStateAction<AccessTokenResponse | null>>): Promise<AccessTokenResponse | null> {
    return new Promise<AccessTokenResponse | null>((resolve, reject) => {
        console.log("REFRESHHINGGGGGGG")
        console.log("accessToken: " + accessToken)
        console.log("client: " + client)
        RefreshApiCall({
            refreshToken: accessToken.refresh_token!,
            scope: accessToken.scope!,
            client: client!
        })
        .then(newTokenResponse => {
            console.log("newTokenResponse: " + newTokenResponse)
            if (newTokenResponse) {
                const newAccessToken = TokenHandler.setTokenCreation(newTokenResponse)

                console.log("New access token: " + newAccessToken)
                setTokenResponseState(newAccessToken);
                ChromeStorageHandler.SetAccessTokenStorage(newAccessToken);
                resolve(newTokenResponse);
            }
            else{
                resolve(accessToken);
            }
        })
        .catch(error => {
            reject(error);
        });
    });
}

export default RefreshAccessToken;
