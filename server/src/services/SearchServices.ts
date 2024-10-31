import { UnifiedSearchResult } from '../types/types';

export interface SearchService {
  search(query: string, token: string): Promise<UnifiedSearchResult[]>;
}

export class GoogleDriveSearch implements SearchService {
  async search(query: string, token: string): Promise<UnifiedSearchResult[]> {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=fullText contains '${query}'`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to search Google Drive');
    }

    const data = await response.json();
    return data.files.map((file: any) => ({
      id: file.id,
      title: file.name,
      content: file.description || '',
      url: `https://drive.google.com/file/d/${file.id}`,
      source: 'Google Drive',
      timestamp: new Date(file.modifiedTime),
      type: file.mimeType,
    }));
  }
}

export class NotionSearch implements SearchService {
  async search(query: string, token: string): Promise<UnifiedSearchResult[]> {
    const response = await fetch('https://api.notion.com/v1/search', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error('Failed to search Notion');
    }

    const data = await response.json();
    return data.results.map((result: any) => ({
      id: result.id,
      title: result.properties?.title?.title[0]?.text?.content || 'Untitled',
      content: result.properties?.description?.rich_text[0]?.text?.content || '',
      url: result.url,
      source: 'Notion',
      timestamp: new Date(result.last_edited_time),
      type: result.object,
    }));
  }
}

export class DiscordSearch implements SearchService {
  async search(query: string, token: string): Promise<UnifiedSearchResult[]> {
    const response = await fetch('https://discord.com/api/v9/search', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to search Discord');
    }

    const data = await response.json();
    return data.messages.map((message: any) => ({
      id: message.id,
      title: `Message in ${message.channel.name}`,
      content: message.content,
      url: `https://discord.com/channels/${message.guild_id}/${message.channel_id}/${message.id}`,
      source: 'Discord',
      timestamp: new Date(message.timestamp),
      type: 'message',
    }));
  }
} 