import React, { createContext, useState } from 'react';

// Create a context object
const AuthContext = createContext();

// Create a provider component
const ProvideAuth = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [uni, setUni] = useState(null);
  return (
    <AuthContext.Provider value={{ username, setUsername, uni, setUni}}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, ProvideAuth };