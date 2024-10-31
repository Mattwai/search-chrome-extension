import { Box, Typography, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';

export type UserApiCallProps = {
  accessToken: string | null;
};

async function getUser(accessToken: string | null): Promise<{ name: string; email: string; } | null> {
  try {
    const response = await fetch("", {
      headers: {
        "Authorization": "Bearer " + accessToken,
        "Accept": "application/json",
      },
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("An error occurred while fetching data from the endpoint: ", error);
    throw error;
  }
}

const UserApiCall = ({ accessToken }: UserApiCallProps) => {
  const [user, setUser] = useState<{ name: string, email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUser(accessToken);
        setUser(data);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [accessToken]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: 2 }}>
      {!user ? (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5">Not Logged In</Typography>
          <Typography variant="body1">Request the user's information</Typography>
        </Box>
      ) : (
        <Box>
          <Typography variant="h5" gutterBottom>Logged in User Details</Typography>
          <Typography>Name: {user.name}</Typography>
          <Typography>Email: {user.email}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default UserApiCall;
