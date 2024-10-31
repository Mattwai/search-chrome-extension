import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import SearchBar from "../components/SearchBar/SearchBar";
import { SearchResultsList } from "../components/SearchResultsList/SearchResultsList";
import { ServiceToken } from "../../../types/auth.types";
import { UnifiedSearchResult } from "../../../types/search.types";
import { SUPPORTED_SERVICES } from '../../../../../server/src/config/services';
import TokenHandler from "../../../utils/TokenHandler";

const SearchPage = () => {
  const [results, setResults] = useState<UnifiedSearchResult[]>([]);
  const [serviceTokens, setServiceTokens] = useState<{ [key: string]: ServiceToken }>({});
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchServiceTokens = async () => {
      setIsLoading(true);
      try {
        const tokens: { [key: string]: ServiceToken } = {};
        for (const [service] of Object.entries(SUPPORTED_SERVICES)) {
          const token = await TokenHandler.getServiceToken(service);
          if (token) {
            tokens[service] = token;
          }
        }
        setServiceTokens(tokens);
      } catch (error) {
        console.error('Failed to fetch service tokens:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServiceTokens();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="App"
    >
      <Box sx={{ p: 3 }}>
        <div className="search-bar-container" ref={searchContainerRef}>
          <SearchBar 
            setResults={setResults} 
            serviceTokens={serviceTokens}
          />
          <SearchResultsList results={results}/>
        </div>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Connected Services
          </Typography>
          {Object.entries(serviceTokens).map(([service, token]) => (
            <Box key={service} sx={{ mb: 2 }}>
              <Typography variant="body1">
                {service}: {token ? 'Connected' : 'Not Connected'}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </motion.div>
  );
};

export default SearchPage;

