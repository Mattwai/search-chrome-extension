import React, { ReactNode, useState } from 'react';
import { AccessTokenResponse, Client } from '../Background/types';

export const AppContext = React.createContext({
    clientState: null as Client | null,
    setClientState: (() => {}) as React.Dispatch<React.SetStateAction<Client | null>>,
    tokenResponseState: null as AccessTokenResponse | null,
    setTokenResponseState: (() => {}) as React.Dispatch<React.SetStateAction<AccessTokenResponse | null>>,
  });

export function Provider({ children }: { children: ReactNode })  {
    const [clientState, setClientState] = useState<Client | null>(null);
    const [tokenResponseState, setTokenResponseState] = useState<AccessTokenResponse | null>(null);
  
    return (
    <AppContext.Provider value={{ clientState, setClientState, tokenResponseState, setTokenResponseState }}>
      {children}
    </AppContext.Provider>
  );
}