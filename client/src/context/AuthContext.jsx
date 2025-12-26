import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Helps us read the token data

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1. Check URL for token after GitHub redirect
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');

    if (urlToken) {
      localStorage.setItem('token', urlToken);
      setToken(urlToken);
      
      // Decode the user info from the new token
      try {
        const decoded = jwtDecode(urlToken);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token in URL");
      }

      // Clean the URL
      window.history.replaceState({}, document.title, "/");
    } else if (token) {
      // 2. If no token in URL, but we have one in LocalStorage, decode it
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Expired or invalid session");
        logout();
      }
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};