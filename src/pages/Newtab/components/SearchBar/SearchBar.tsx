import React, { useState, useCallback } from 'react';
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import { UnifiedSearchResult } from '../../../Background/types';
import ChromeStorageHandler from '../../../Background/ChromeStorageHandler';
import { GoogleDriveSearch, NotionSearch, DiscordSearch } from '../../../Background/services/SearchServices';

const searchServices = {
  'Google Drive': new GoogleDriveSearch(),
  'Notion': new NotionSearch(),
  'Discord': new DiscordSearch(),
};

type SearchBarProps = {
  setResults: React.Dispatch<React.SetStateAction<UnifiedSearchResult[]>>;
}

const SearchBar = ({ setResults }: SearchBarProps) => {
  const [input, setInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const tokens = await ChromeStorageHandler.GetServiceTokens();
      const searchPromises = Object.entries(tokens).map(async ([service, token]) => {
        if (searchServices[service]) {
          return searchServices[service].search(query, token.access_token);
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
  }, [setResults]);

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
