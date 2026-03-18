/**
 * Axios API Instance
 * ─────────────────────────────────────────────────────────────────
 * A pre-configured Axios instance used by all API calls.
 *
 * - baseURL is /api (proxied to Express by Vite in development)
 * - Request interceptor automatically attaches the JWT token
 *   from localStorage to every outgoing request header
 * ─────────────────────────────────────────────────────────────────
 */

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * Runs before every request is sent.
 * Reads the JWT from localStorage and adds it as a Bearer token.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor
 * Runs after every response is received.
 * If the server returns 401 (unauthorised), clear the stored token
 * and redirect to the login page.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
