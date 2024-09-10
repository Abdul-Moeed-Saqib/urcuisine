import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    try {
      const response = await axios.post('/auth/login', credentials);
      setUser(response.data.user);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const signup = async (credentials) => {
    try {
      const response = await axios.post('/auth/signup', credentials);
      setUser(response.data.user);
    } catch (error) {
      console.error('Signup failed', error);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);