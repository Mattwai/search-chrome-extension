import { AccessTokenResponse } from '../types';

async function getUserData(
  tokenResponse: AccessTokenResponse | null
): Promise<any> {
  try {
    if (tokenResponse) {
      const response = await fetch('', {
        headers: {
          Authorization: 'Bearer ' + tokenResponse.access_token,
          Accept: 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } else {
      console.error('No Access token');
    }
  } catch (error) {
    console.error(
      'An error occurred while fetching data from the endpoint: ',
      error
    );
    throw error;
  }
}

export default getUserData;
