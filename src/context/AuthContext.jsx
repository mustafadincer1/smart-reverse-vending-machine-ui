// context/AuthContext.js

import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => localStorage.getItem("token"));
  const [transactionNumber, setTransactionNumber] = useState(null);

  const setToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setTokenState(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setTokenState(null);
    setTransactionNumber(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout, transactionNumber, setTransactionNumber }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
