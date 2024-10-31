import React, { ReactNode, useState } from 'react';

interface AuthState {
  authenticatedServices: string[];
  isAuthenticating: boolean;
}

export const AppContext = React.createContext({
  authState: { authenticatedServices: [], isAuthenticating: false } as AuthState,
  setAuthState: (() => {}) as React.Dispatch<React.SetStateAction<AuthState>>,
});

export function Provider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    authenticatedServices: [],
    isAuthenticating: false,
  });

  return (
    <AppContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AppContext.Provider>
  );
}