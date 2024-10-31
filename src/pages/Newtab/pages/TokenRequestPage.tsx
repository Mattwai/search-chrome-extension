import { Alert, Box, Button, Typography } from '@mui/material';
import React from 'react';
import TokenHandler from '../../Background/TokenHandler';
import { useNavigate } from 'react-router-dom';

type TokenRequestPageProps = {
  code: string;
  service: string;
  state: string;
};

const TokenRequestPage = ({ code, service, state }: TokenRequestPageProps) => {
  const navigate = useNavigate();

  const handleTokenExchange = async () => {
    try {
      const token = await TokenHandler.generateServiceToken(service, code, state);
      if (token) {
        navigate('/search');
      } else {
        throw new Error('Failed to generate token');
      }
    } catch (error) {
      console.error('Token exchange failed:', error);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Connecting to {service}
      </Typography>

      <Alert severity="info" sx={{ mb: 4 }}>
        Completing authentication for {service}...
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
