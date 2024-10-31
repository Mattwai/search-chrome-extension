import React, { useEffect, useState, useContext } from 'react';
import './Newtab.css';
import SearchPage from './pages/SearchPage';
import TokenRequestPage from './pages/TokenRequestPage';
import AuthorizePage from './pages/AuthorizePage';
import { AppContext } from './AppContext';
import { API_BASE_URL } from '../../config';

function Newtab() {
  const [page, setPage] = useState<any>(null);
  const urlParams = new URLSearchParams(window.location.search);
  const { setAuthState } = useContext(AppContext);

  useEffect(() => {
    const fetchTokenResponse = async () => {
      const code = urlParams.get("code");
      const state = urlParams.get("state");
      const service = urlParams.get("service");
      
      if (code && service) {
        try {
          setAuthState(prev => ({ ...prev, isAuthenticating: true }));
          const response = await fetch(`${API_BASE_URL}/auth/${service}/token`);
          const data = await response.json();
          
          if (data.success) {
            setAuthState(prev => ({
              authenticatedServices: [...prev.authenticatedServices, service],
              isAuthenticating: false
            }));
            setPage(<SearchPage />);
          } else {
            setPage(<TokenRequestPage 
              code={code} 
              service={service} 
              state={state || ''} 
            />);
          }
        } catch (error) {
          console.error('Token fetch failed:', error);
          setAuthState(prev => ({ ...prev, isAuthenticating: false }));
          setPage(<TokenRequestPage 
            code={code} 
            service={service} 
            state={state || ''} 
          />);
        }
      } else {
        setPage(<AuthorizePage />);
      }
    };
    
    fetchTokenResponse();
  }, [urlParams]);

  return (
    <div className="Newtab">
      {page}
    </div>
  );
}

export default Newtab;