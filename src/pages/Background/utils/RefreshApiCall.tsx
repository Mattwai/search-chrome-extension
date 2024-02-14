import { AccessTokenResponse, Client } from '../types';

export type RefreshApiCallProps = {
  scope: string;
  refreshToken: string;
  client: Client;
};

const RefreshApiCall = async ({
  refreshToken,
  scope,
  client,
}: RefreshApiCallProps): Promise<AccessTokenResponse | null> => {
  const canRefresh = scope.includes('offline_access');

  if (!canRefresh) {
    console.log('Cant refresh');
    return null;
  }
  if (!client) {
    console.log('Client is null');
    return null;
  }
  const response = await fetch('', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: client.id,
      client_secret: client.secret,
      refresh_token: refreshToken!,
    }),
  });

  const responseJson = (await response.json()) as AccessTokenResponse;
  console.log('responseJson: ' + responseJson.access_token);

  if (!response.ok) {
    console.error(`HTTP error! status: ${response.status}`);
    console.error(response);
    return null;
  }

  if (responseJson.access_token) {
    console.log('NEW access token');
    return responseJson;
  }
  return null;
};

export default RefreshApiCall;
