import { API_BASE_URL } from '../../../config';

async function getSearchData(value: string, service: string): Promise<any> {
  try {
    const searchResponse = await fetch(`${API_BASE_URL}/search/${service}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: value,
        sessionId: crypto.randomUUID(),
      }),
    });

    if (!searchResponse.ok) {
      throw new Error(`HTTP error! status: ${searchResponse.status}`);
    }
    
    return await searchResponse.json();
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}

export { getSearchData as default };
