import { Alert, Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../config';

type TokenRequestPageProps = {
  code: string;
  service: string;
  state: string;
};

const TokenRequestPage = ({ code, service, state }: TokenRequestPageProps) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleTokenExchange = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/${service}/callback?code=${code}&state=${state}`);
      const data = await response.json();
      
      if (data.success && data.token) {
        navigate('/search');
      } else {
        throw new Error(data.error || 'Failed to generate token');
      }
    } catch (error) {
      console.error('Token exchange failed:', error);
      setError('Failed to connect to service. Please try again.');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Connecting to {service}
      </Typography>

      <Alert severity={error ? "error" : "info"} sx={{ mb: 4 }}>
        {error || `Completing authentication for ${service}...`}
      </Alert>

      <Box sx={{ mt: 4 }}>
        <Button 
          variant="contained" 
          onClick={handleTokenExchange}
          fullWidth
        >
          Complete Connection
        </Button>
      </Box>
    </Box>
  );
};

export default TokenRequestPage;
