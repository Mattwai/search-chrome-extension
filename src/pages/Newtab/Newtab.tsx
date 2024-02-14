import React, { useEffect, useState, useContext } from 'react';
import './Newtab.css';
import SearchPage from './pages/SearchPage';
import TokenRequestPage from './pages/TokenRequestPage';
import AuthorizePage from './pages/AuthorizePage';
import TokenHandler from '../Background/TokenHandler';
import { AppContext } from './AppContext'; // import the context

function Newtab() {
  const [page, setPage] = useState<any>(null);
  const urlParams = new URLSearchParams(window.location.search);

  // Use useContext to access the state and state updating functions
  const { clientState, setClientState, tokenResponseState, setTokenResponseState } = useContext(AppContext);

  useEffect(() => {
    const fetchTokenResponse = async () => {
      let code = urlParams.get("code");
      await TokenHandler.getTokenResponse(setTokenResponseState)
      .then(tokenResponse => {
        if (tokenResponse != null) {
          setPage(<SearchPage />);
        } else if (code !=null) {
          console.log("Got access code of ", code);
          setPage(<TokenRequestPage code={code} />);
        } else {
          setPage(<AuthorizePage />);
        }
      })
    }
    fetchTokenResponse();
  }, [clientState, tokenResponseState]);

  return (
      <div className="Newtab">
        {page}
      </div>
  );
}

export default Newtab;