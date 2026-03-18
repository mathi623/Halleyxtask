/**
 * App.jsx — Root Component & Route Configuration
 * ─────────────────────────────────────────────────────────────────
 * Sets up React Router with two route types:
 *
 *   Public routes  — accessible without login (/login)
 *   Private routes — require authentication (everything else)
 *
 * The AuthProvider wraps the entire tree so every component
 * can access the logged-in user via the useAuth hook.
 * ─────────────────────────────────────────────────────────────────
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage     from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import WorkflowsPage from './pages/WorkflowsPage';
import RulesPage     from './pages/RulesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AuditLogPage  from './pages/AuditLogPage';
import SettingsPage  from './pages/SettingsPage';

// Layout shell (sidebar + topbar wrapper)
import AppLayout from './components/layout/AppLayout';

/**
 * PrivateRoute — wraps routes that need authentication.
 * Redirects to /login if there is no logged-in user.
 * Shows a loading screen while the auth state is being resolved.
 */
const PrivateRoute = ({ children }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="text-slate-500 text-sm font-sans">Loading...</div>
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/login" replace />;
};

/**
 * AdminRoute — wraps routes that only admins can access.
 * Redirects employees back to the dashboard if they try to visit.
 */
const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser?.role === 'admin' ? children : <Navigate to="/" replace />;
};

/**
 * App — top-level component.
 * Wraps everything in AuthProvider and BrowserRouter,
 * then defines the full route tree.
 */
const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>

        {/* Public route — the login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Private routes — all wrapped in the sidebar/topbar layout */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          {/* Default page — dashboard */}
          <Route index element={<DashboardPage />} />

          {/* Automation section — available to all authenticated users */}
          <Route path="workflows" element={<WorkflowsPage />} />
          <Route path="rules"     element={<RulesPage />}     />
          <Route path="analytics" element={<AnalyticsPage />} />

          {/* Admin-only routes */}
          <Route
            path="auditlog"
            element={<AdminRoute><AuditLogPage /></AdminRoute>}
          />
          <Route
            path="settings"
            element={<AdminRoute><SettingsPage /></AdminRoute>}
          />
        </Route>

        {/* Catch-all — redirect unknown URLs to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
