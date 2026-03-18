/**
 * Sidebar
 * ─────────────────────────────────────────────────────────────────
 * Fixed left navigation panel.
 *
 * - Logo mark at the top with a role pill (Admin / Employee)
 * - Nav sections: Overview, Automation, Admin Only
 * - User profile footer with logout button
 *
 * Admin-only items (Audit Logs, Settings) are hidden for employees.
 * ─────────────────────────────────────────────────────────────────
 */

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ── SVG icon components ───────────────────────────────────────────

const GridIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const WorkflowIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="5" cy="12" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="19" cy="19" r="2"/>
    <path d="M7 12h10M17 5l-8 7M17 19l-8-7"/>
  </svg>
);

const RuleIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M3 3v18h18"/><path d="M18 9l-5 5-2-2-5 5"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

const GearIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);

// ── NavItem — a single navigation link ───────────────────────────

const NavItem = ({ to, icon, label, badge, badgeRed }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium
       transition-all duration-150 mb-0.5 border
       ${isActive
         ? 'bg-indigo-50 text-indigo-600 border-indigo-100 font-semibold'
         : 'text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-700'
       }`
    }
  >
    {({ isActive }) => (
      <>
        {/* Icon container */}
        <div className={`w-7 h-7 rounded-md flex items-center justify-content-center
                         flex-shrink-0 flex items-center justify-center
                         ${isActive ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400'}`}>
          {icon}
        </div>

        {/* Label */}
        <span className="flex-1">{label}</span>

        {/* Optional badge (e.g. workflow count or alert count) */}
        {badge !== undefined && (
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full text-white
                            ${badgeRed ? 'bg-rose-500' : 'bg-indigo-500'}`}>
            {badge}
          </span>
        )}
      </>
    )}
  </NavLink>
);

// ── Sidebar component ─────────────────────────────────────────────

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const navigate                = useNavigate();
  const isAdmin                 = currentUser?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200
                      flex flex-col fixed top-0 left-0 h-screen z-50 overflow-y-auto">

      {/* ── Logo + role pill ── */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-slate-200">
        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-indigo-600 to-violet-500
                        flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <span
          className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full
                      ${isAdmin
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'bg-emerald-50 text-emerald-600'}`}
        >
          {isAdmin ? 'Admin' : 'Employee'}
        </span>
      </div>

      {/* ── Overview section ── */}
      <div className="px-3 pt-4 pb-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 px-2 mb-1">
          Overview
        </p>
        <NavItem to="/"          icon={<GridIcon />}     label="Dashboard"    />
      </div>

      {/* ── Automation section ── */}
      <div className="px-3 pt-3 pb-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 px-2 mb-1">
          Automation
        </p>
        <NavItem to="/workflows" icon={<WorkflowIcon />} label="Workflows"    />
        <NavItem to="/rules"     icon={<RuleIcon />}     label="Rule Builder" />
        <NavItem to="/analytics" icon={<ChartIcon />}    label="Analytics"    />
      </div>

      {/* ── Admin-only section — hidden for employees ── */}
      {isAdmin && (
        <div className="px-3 pt-3 pb-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 px-2 mb-1">
            Admin Only
          </p>
          <NavItem to="/auditlog" icon={<ClockIcon />} label="Audit Logs" badge={4} badgeRed />
          <NavItem to="/settings" icon={<GearIcon />}  label="Settings"             />
        </div>
      )}

      {/* ── User profile footer ── */}
      <div className="mt-auto border-t border-slate-200 p-3">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-slate-50 cursor-pointer">

          {/* Avatar circle with gradient */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500
                          flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {currentUser?.name || 'User'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {isAdmin ? 'Administrator' : currentUser?.department}
            </p>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-xs text-slate-400 hover:text-rose-500 hover:bg-rose-50
                       px-1.5 py-1 rounded transition-all duration-150"
          >
            ↩
          </button>

        </div>
      </div>

    </aside>
  );
};

export default Sidebar;
