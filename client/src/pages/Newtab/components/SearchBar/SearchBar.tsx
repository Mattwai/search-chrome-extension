import React, { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import { ServiceToken, UnifiedSearchResult } from '../../../../../../server/src/types/types';
import { GoogleDriveSearch, NotionSearch, DiscordSearch } from '../../../../../../server/src/services/SearchServices';

const searchServices = {
  'Google Drive': new GoogleDriveSearch(),
  'Notion': new NotionSearch(),
  'Discord': new DiscordSearch(),
} as const;

type ServiceKey = keyof typeof searchServices;

interface SearchBarProps {
  setResults: Dispatch<SetStateAction<UnifiedSearchResult[]>>;
  serviceTokens: { [key: string]: ServiceToken };
}

const SearchBar = ({ setResults, serviceTokens }: SearchBarProps) => {
  const [input, setInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const searchPromises = Object.entries(serviceTokens).map(async ([service, token]) => {
        if (service in searchServices && searchServices[service as ServiceKey]) {
          return searchServices[service as ServiceKey].search(query, token.access_token);
        }
        return [];
      });

      const results = await Promise.all(searchPromises);
      const flatResults = results
        .flat()
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setResults(flatResults);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [setResults, serviceTokens]);

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon"/>
      <input 
        placeholder="Search across all your services..." 
        value={input} 
        onChange={(e) => {
          setInput(e.target.value);
          handleSearch(e.target.value);
        }}
      />
      {isSearching && <div className="search-spinner" />}
    </div>
  );
};

export default SearchBar;
