import SearchBar from "../components/SearchBar/SearchBar";
import { SearchResultsList } from "../components/SearchResultsList/SearchResultsList";
import React, { useContext, useEffect, useRef, useState } from "react";
import Button from "@atlaskit/button";
import EmptyState from "@atlaskit/empty-state";
import UserApiCall from "../../Background/UserApiCall";
import { AppContext } from "../AppContext";
import TokenHandler from "../../Background/TokenHandler";
import getSearchData from "../../Background/utils/RetrieveSearchData";
import getUserData from "../../Background/utils/RetrieveUserContext";

const SearchPage = () => {
  const [results, setResults] = useState<{}[]>([]);
  const { clientState, setClientState, tokenResponseState, setTokenResponseState } = useContext(AppContext);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAggregatorData = async () => {
      setIsLoading(true);
      try {
        const tokenResponse = await TokenHandler.getTokenResponse(setTokenResponseState);
        if (tokenResponse) {
          const data = await getUserData(tokenResponse);
          console.log("load data " + data);
          setUserData(data); // Set the data to the state
        } else {
          throw new Error("No Access token, Token may have expired");
        }
       } finally {
        setIsLoading(false);
      }
    };
    fetchAggregatorData();
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

      
  useEffect(() => {
    const fetchToken = async () => {
        const tokenResponse = await TokenHandler.getTokenResponse(setTokenResponseState);
        if (tokenResponse) {
            setTokenResponseState(tokenResponse);
        }
    };
    fetchToken();
}, [clientState, setTokenResponseState]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
      <div className="App">
      <div>{tokenResponseState && tokenResponseState.access_token && <UserApiCall accessToken={tokenResponseState.access_token} />}</div>
      <div className="search-bar-container" ref={searchContainerRef}>
        <SearchBar setResults={setResults} tokenResponse={tokenResponseState!} userContext={userData}/>
        <SearchResultsList results={results}/>
      </div>
      <div>{<EmptyState
      header={"Request the user's information"}
      primaryAction={
          <Button appearance={"primary"} onClick={async () => {
            const newToken = await TokenHandler.getTokenResponse(setTokenResponseState);
            if(newToken){
              const data = await getUserData(newToken);
              console.log(data)
            }
            else{
              console.error("No Access token, Token may have expired");
            }
          }}>
              Make Request
          </Button>
      }
  />}
    </div>
    <Button appearance={"primary"} onClick={async () => {
            const searchData = await getSearchData("test", tokenResponseState!);
            console.log(searchData)
          }}>
              query
          </Button>
  </div>
)};

export default SearchPage;

