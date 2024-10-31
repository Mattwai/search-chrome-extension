export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:6900';

export const SUPPORTED_SERVICES = {
    NOTION: {
      name: 'Notion',
      authUrl: `${API_BASE_URL}/auth/notion/authorize`,
      tokenUrl: `${API_BASE_URL}/auth/notion/token`,
      scopes: ['read_content'],
      clientId: process.env.NOTION_CLIENT_ID || ''
    },
    GOOGLE_DRIVE: {
      name: 'Google Drive',
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      clientId: process.env.GOOGLE_CLIENT_ID || ''
    },
    DISCORD: {
      name: 'Discord',
      authUrl: 'https://discord.com/api/oauth2/authorize',
      scopes: ['messages.read'],
      clientId: process.env.DISCORD_CLIENT_ID || ''
    }
  };

// Add validation
Object.entries(SUPPORTED_SERVICES).forEach(([service, config]) => {
  if (!config.clientId) {
    console.warn(`Missing client ID for ${service}. Please check your environment variables.`);
  }
});