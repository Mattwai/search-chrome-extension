import React, {useState} from 'react';
import {FaSearch} from "react-icons/fa"
import "./SearchBar.css"
import getSearchData from '../../../Background/utils/RetrieveSearchData';
import { AccessTokenResponse } from '../../../Background/types';

type ResultProps = {
  setResults: React.Dispatch<React.SetStateAction<{}[]>>,
  tokenResponse: AccessTokenResponse,
  userData: any
}
  
const SearchBar = ({setResults, tokenResponse, userData} : ResultProps) => {
  const [input, setInput] = useState("");
  const handleChange = async (value:string) => {
    setInput(value)
    const searchData = await getSearchData(value, tokenResponse);
    const results = searchData.scopes.flatMap((scope: { results: any; }) => scope.results);
    console.log(results);
    setResults(results);
  }
  const ref = React.useRef(null);
  return (
    <div className="input-wrapper" ref={ref}>
        <FaSearch id="search-icon"/>
        <input 
          placeholder="Type to search..." 
          value={input} 
          onChange={(e) => handleChange(e.target.value)}
        />
    </div>
  );
};

export default SearchBar;
