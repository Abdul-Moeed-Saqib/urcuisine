import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

const AuthContext = createContext();

const AUTH_STATE_KEY = 'authState'; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded; 
    } catch (error) {
      console.error('Failed to decode token', error);
      return null;
    }
  };

  const setAuthState = (state) => {
    localStorage.setItem(AUTH_STATE_KEY, state); 
  };

  // 
  const isAuthValid = () => {
    const authState = localStorage.getItem(AUTH_STATE_KEY); 

    return authState === 'true';
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post('/auth/login', credentials, {
        withCredentials: true, 
      });

      const token = response.data.token; 
      const decodedToken = decodeToken(token); 
      setUser({ name: decodedToken.name }); 

      setAuthState('true'); 
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const signup = async (credentials) => {
    try {
      const response = await axios.post('/auth/signup', credentials, {
        withCredentials: true, 
      });

      const token = response.data.token; 
      const decodedToken = decodeToken(token); 
      setUser({ name: decodedToken.name }); 

      setAuthState('true'); 
    } catch (error) {
      console.error('Signup failed', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout', {}, {
        withCredentials: true, 
      });
      setUser(null); 
      setAuthState('false'); 
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthValid()) {
        console.log('Skipping token validation due to invalid or expired auth state');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/auth/validate', {
          withCredentials: true, 
        });

        const token = response.data.token; 
        if (token) {
          const decodedToken = decodeToken(token); 
          setUser({ name: decodedToken.name }); 
        } else {
          setAuthState('false'); 
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to validate token on refresh', error);
        setAuthState('false'); 
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth(); 
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);