import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { useState } from 'react';
import { SUPPORTED_SERVICES } from '../../Background/config/services';

type ServiceConfig = {
  name: string;
  authUrl: string;
  scopes: string[];
  clientId: string;
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

    localStorage.setItem(`${service.name}_state`, state);
    window.location.href = authUrl;
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Connect Your Services
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Select and authorize the services you want to search through:
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
        {Object.entries(SUPPORTED_SERVICES).map(([key, service]) => (
          <motion.div
            key={key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'background.paper',
                boxShadow: 1,
                transition: 'all 0.2s',
                border: selectedServices.includes(key) ? '2px solid primary.main' : '2px solid transparent'
              }}
            >
              <Typography variant="h6" gutterBottom>
                {service.name}
              </Typography>
              <Button
                variant="contained"
                color={selectedServices.includes(key) ? "secondary" : "primary"}
                fullWidth
                onClick={() => handleAuthorize(service)}
              >
                Connect {service.name}
              </Button>
            </Box>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default AuthorizePage;
