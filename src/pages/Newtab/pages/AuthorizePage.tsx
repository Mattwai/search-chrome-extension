import '@atlaskit/css-reset'
import { Code } from '@atlaskit/code'
import Heading from '@atlaskit/heading'
import Form, { Field, FormFooter, FormHeader } from "@atlaskit/form"
import { Box } from '@atlaskit/primitives'
import Select, {ValueType} from '@atlaskit/select'
import TextField from '@atlaskit/textfield'
import React, {useState} from "react"
import Button from "@atlaskit/button"

type ServiceConfig = {
  name: string;
  authUrl: string;
  scopes: string[];
  clientId: string;
}

const SUPPORTED_SERVICES = {
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

const AuthorizePage = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleServiceToggle = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleAuthorize = async (service: ServiceConfig) => {
    const redirectUri = `${window.location.origin}/newtab.html`;
    const state = Math.random().toString(36).substring(7);
    
    const authUrl = `${service.authUrl}?` +
      `client_id=${service.clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(service.scopes.join(' '))}` +
      `&response_type=code` +
      `&state=${state}`;

    // Store state for validation when the auth callback returns
    localStorage.setItem(`${service.name}_state`, state);
    
    window.location.href = authUrl;
  };

  return (
    <div>
      <Heading level="h900">Connect Your Services</Heading>
      <p>Select and authorize the services you want to search through:</p>
      
      <div className="services-grid">
        {Object.entries(SUPPORTED_SERVICES).map(([key, service]) => (
          <div key={key} className="service-card">
            <h3>{service.name}</h3>
            <Button
              appearance="primary"
              onClick={() => handleAuthorize(service)}
            >
              Connect {service.name}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthorizePage;
