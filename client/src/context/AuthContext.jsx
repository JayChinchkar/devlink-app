import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Look at the URL for the token after GitHub redirect
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');

    if (urlToken) {
      // Alert helps us confirm the handshake happened
      alert("Success! Token found in URL. Saving to storage...");
      
      localStorage.setItem('token', urlToken);
      setToken(urlToken);
      
      // Clean the URL so the token isn't visible in the address bar
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  // THE MISSING LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem('token'); // Remove from browser storage
    setToken(null);                  // Clear state to trigger App.jsx re-render
    setUser(null);                   // Clear user data
    window.location.href = "/";      // Hard redirect to the login screen
  };

  return (
    /* We MUST include 'logout' in the value object below */
    <AuthContext.Provider value={{ token, setToken, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};