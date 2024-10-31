import { UnifiedSearchResult } from '../types/types';
import axios from 'axios';

export class NotionService {
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  async search(query: string): Promise<UnifiedSearchResult[]> {
    try {
      const response = await axios.post('https://api.notion.com/v1/search', 
        { query },
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Notion-Version': '2022-06-28',
          },
        }
      );

      return response.data.results.map((result: any) => ({
        id: result.id,
        title: result.properties?.title?.title[0]?.text?.content || 'Untitled',
        content: result.properties?.description?.rich_text[0]?.text?.content || '',
        url: result.url,
        source: 'Notion',
        timestamp: new Date(result.last_edited_time),
        type: result.object,
      }));
    } catch (error) {
      console.error('Notion search error:', error);
      throw new Error('Failed to search Notion');
    }
  }
}
