/**
 * React Entry Point
 * ─────────────────────────────────────────────────────────────────
 * Mounts the root App component into the #root div in index.html.
 * Also imports the global CSS file (Tailwind + custom styles).
 * ─────────────────────────────────────────────────────────────────
 */

import React    from 'react';
import ReactDOM from 'react-dom/client';

import App         from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
