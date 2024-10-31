export const SUPPORTED_SERVICES = {
    GOOGLE_DRIVE: {
      name: 'Google Drive',
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      clientId: process.env.GOOGLE_CLIENT_ID || ''
    },
    NOTION: {
      name: 'Notion',
      authUrl: 'https://api.notion.com/v1/oauth/authorize',
      scopes: ['read_content'],
      clientId: process.env.NOTION_CLIENT_ID || ''
    },
    DISCORD: {
      name: 'Discord',
      authUrl: 'https://discord.com/api/oauth2/authorize',
      scopes: ['messages.read'],
      clientId: process.env.DISCORD_CLIENT_ID || ''
    }
  };