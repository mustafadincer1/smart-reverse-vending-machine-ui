import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [transactionNumber, setTransactionNumber] = useState(null);

  return (
    <AuthContext.Provider value={{ token, setToken, transactionNumber, setTransactionNumber }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
