import { AccessTokenResponse } from '../types';

async function getSearchData(
  value: string,
  tokenResponse: AccessTokenResponse
): Promise<any> {
  try {
    if (!tokenResponse) {
      throw new Error('No Access token');
    }

    const searchResponse = await fetch('', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
      body: JSON.stringify({
        query: value,
        limit: 50,
        filters: [],
        searchSession: {
          sessionId: crypto.randomUUID(),
          referrerId: '',
        },
      }),
    });

    if (!searchResponse.ok) {
      throw new Error(`HTTP error! status: ${searchResponse.status}`);
    }
    
    return await searchResponse.json();
  } catch (error) {
    console.error('An error occurred while fetching data from the endpoint: ', error);
    throw error;
  }
}

async function getSearchDataJira(
  value: string,
  tokenResponse: AccessTokenResponse
): Promise<any> {
  try {
    if (!tokenResponse) {
      throw new Error('No Access token');
    }

    const searchResponse = await fetch('', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
      body: JSON.stringify({
        query: value,
        filters: [],
        searchSession: {
          sessionId: crypto.randomUUID(),
          referrerId: '',
        },
      }),
    });

    if (!searchResponse.ok) {
      throw new Error(`HTTP error! status: ${searchResponse.status}`);
    }
    
    return await searchResponse.json();
  } catch (error) {
    console.error('An error occurred while fetching data from the endpoint: ', error);
    throw error;
  }
}

export { getSearchData as default, getSearchDataJira };
