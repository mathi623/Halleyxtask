/**
 * Auth Context
 * ─────────────────────────────────────────────────────────────────
 * Provides authentication state to the entire application.
 *
 * Exposes:
 *   currentUser  — the logged-in user object (or null)
 *   isLoading    — true while checking if a token exists on load
 *   login()      — calls the API, stores the token, sets the user
 *   logout()     — clears the token and user from state
 *
 * Usage anywhere in the app:
 *   const { currentUser, login, logout } = useAuth();
 * ─────────────────────────────────────────────────────────────────
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

// Create the context with a default of null
const AuthContext = createContext(null);

/**
 * AuthProvider wraps the entire app and makes auth state
 * available to every child component via the useAuth hook.
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading,   setIsLoading]   = useState(true);

  /**
   * On initial load — if a token exists in localStorage,
   * fetch the current user profile to restore the session.
   * This keeps the user logged in after a page refresh.
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    api.get('/auth/me')
      .then((res) => setCurrentUser(res.data.user))
      .catch(()   => localStorage.removeItem('token'))
      .finally(()  => setIsLoading(false));
  }, []);

  /**
   * Sends login credentials to the API.
   * On success, stores the JWT and sets the current user.
   * Returns the user object so the caller can redirect.
   */
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setCurrentUser(res.data.user);
    return res.data.user;
  };

  /**
   * Clears the JWT and user state.
   * The response interceptor in api.js handles 401 redirects,
   * but calling this directly gives a clean logout experience.
   */
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook — shorthand for useContext(AuthContext).
 * Import and call this in any component that needs auth state.
 */
export const useAuth = () => useContext(AuthContext);
