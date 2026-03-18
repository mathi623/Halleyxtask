/**
 * Topbar
 * ─────────────────────────────────────────────────────────────────
 * Sticky header bar containing:
 *   - Breadcrumb (role > current page name)
 *   - Search input
 *   - System status pill
 *   - Notification bell with unread dot
 * ─────────────────────────────────────────────────────────────────
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth }     from '../../context/AuthContext';

/**
 * Maps URL paths to human-readable page names for the breadcrumb.
 */
const PAGE_LABELS = {
  '/'          : 'Dashboard',
  '/workflows' : 'Workflows',
  '/rules'     : 'Rule Builder',
  '/analytics' : 'Analytics',
  '/auditlog'  : 'Audit Logs',
  '/settings'  : 'Settings',
};

const Topbar = () => {
  const { currentUser } = useAuth();
  const location        = useLocation();

  const currentPageLabel = PAGE_LABELS[location.pathname] || 'Dashboard';
  const roleLabel        = currentUser?.role === 'admin' ? 'Admin' : 'Employee';

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center
                       px-6 sticky top-0 z-40 gap-3">

      {/* Breadcrumb: Role > Current Page */}
      <div className="flex items-center gap-1.5 text-sm text-slate-400">
        <span>{roleLabel}</span>
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6"/>
        </svg>
        <span className="font-semibold text-slate-800">{currentPageLabel}</span>
      </div>

      {/* Search bar — pushed to the right by auto margin */}
      <div className="ml-auto flex items-center gap-2 bg-slate-50 border border-slate-200
                      rounded-md px-3 w-56 focus-within:border-indigo-500
                      focus-within:ring-2 focus-within:ring-indigo-50 transition-all duration-150">
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-slate-400 flex-shrink-0">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search workflows, rules..."
          className="bg-transparent border-none outline-none text-sm font-sans
                     text-slate-700 py-1.5 w-full placeholder-slate-400"
        />
      </div>

      {/* Right-side actions */}
      <div className="flex items-center gap-2">

        {/* System operational status indicator */}
        <div className="flex items-center gap-1.5 text-xs text-emerald-600
                        bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-pulse"></span>
          All systems operational
        </div>

        {/* Notification bell with unread indicator dot */}
        <button className="relative w-8 h-8 bg-white border border-slate-200 rounded-md
                           flex items-center justify-center text-slate-500
                           hover:bg-slate-50 hover:text-slate-700 transition-all duration-150">
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500
                           rounded-full border-2 border-white"></span>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </button>

      </div>
    </header>
  );
};

export default Topbar;
