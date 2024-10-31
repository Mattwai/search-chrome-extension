export interface UnifiedSearchResult {
  id: string;
  title: string;
  content: string;
  url: string;
  source: string;
  timestamp: Date;
  type: string;
}

async function searchGoogleDrive(query: string, token: string): Promise<UnifiedSearchResult[]> {
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=fullText contains '${query}'`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  return data.files.map((file: any) => ({
    id: file.id,
    title: file.name,
    content: file.description || '',
    url: `https://drive.google.com/file/d/${file.id}`,
    source: 'Google Drive',
    timestamp: new Date(file.modifiedTime),
    type: file.mimeType
  }));
}

async function searchNotion(query: string, token: string): Promise<UnifiedSearchResult[]> {
  const response = await fetch('https://api.notion.com/v1/search', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({ query }),
  });
  const data = await response.json();
  return data.results.map((result: any) => ({
    id: result.id,
    title: result.properties?.title?.title[0]?.text?.content || 'Untitled',
    content: result.properties?.description?.rich_text[0]?.text?.content || '',
    url: result.url,
    source: 'Notion',
    timestamp: new Date(result.last_edited_time),
    type: result.object
  }));
}

export async function unifiedSearch(
  query: string,
  activeServices: { [key: string]: string } // service -> token mapping
): Promise<UnifiedSearchResult[]> {
  const searchPromises: Promise<UnifiedSearchResult[]>[] = [];

  if (activeServices.googleDrive) {
    searchPromises.push(searchGoogleDrive(query, activeServices.googleDrive));
  }
  if (activeServices.notion) {
    searchPromises.push(searchNotion(query, activeServices.notion));
  }
  // Add more services here

  const results = await Promise.all(searchPromises);
  return results
    .flat()
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
} 