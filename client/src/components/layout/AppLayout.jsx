/**
 * AppLayout
 * ─────────────────────────────────────────────────────────────────
 * The main shell after login. Renders:
 *   - Sidebar (fixed left navigation)
 *   - Topbar  (sticky header with breadcrumb + search)
 *   - <Outlet /> (where React Router renders the current page)
 * ─────────────────────────────────────────────────────────────────
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar  from './Topbar';

const AppLayout = () => (
  <div className="flex min-h-screen bg-slate-100">

    {/* Fixed sidebar navigation */}
    <Sidebar />

    {/* Main content area — offset by sidebar width */}
    <div className="ml-64 flex-1 flex flex-col min-h-screen">
      <Topbar />
      <main className="flex-1 p-6">
        {/* React Router renders the matched child page here */}
        <Outlet />
      </main>
    </div>

  </div>
);

export default AppLayout;
