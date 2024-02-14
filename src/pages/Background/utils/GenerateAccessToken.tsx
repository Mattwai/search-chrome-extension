import { Client, AccessTokenResponse } from "../types";
import TokenHandler from "../TokenHandler";
import { Dispatch, SetStateAction } from "react";
import ChromeStorageHandler from "../ChromeStorageHandler";

async function GenerateAccessToken(code: string, client: Client, setTokenResponseState: Dispatch<SetStateAction<AccessTokenResponse | null>>){
    return new Promise<AccessTokenResponse | null>(async (resolve,reject)=> {
    if(client){
        const response = await fetch("", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json",
            },
            body: new URLSearchParams({
                "grant_type": "authorization_code",
                "client_id": client.id,
                "client_secret": client.secret,
                "code": code,
                "redirect_uri": window.location.origin + "/newtab.html",
            }),
        })
        const responseJson = await response.json()
        if (responseJson.access_token != null) {
            const newAccessToken = TokenHandler.setTokenCreation(responseJson)
            setTokenResponseState(newAccessToken);
            ChromeStorageHandler.SetAccessTokenStorage(newAccessToken);
            resolve(responseJson)
        }
        else {
            reject("Response does not contain an access token");
        }
    }
    else{
        throw new Error("Client does not exist");
    }
})
}

export default GenerateAccessToken;

