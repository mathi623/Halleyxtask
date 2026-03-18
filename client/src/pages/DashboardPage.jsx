/**
 * DashboardPage
 * ─────────────────────────────────────────────────────────────────
 * Overview page shown after login.
 *
 * - KPI cards (different for admin vs employee)
 * - Execution trend line chart
 * - Status breakdown donut chart
 * - Recent workflows mini list
 * - Activity timeline
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { Link }           from 'react-router-dom';

import { useAuth }    from '../context/AuthContext';
import api            from '../utils/api';
import { KpiCard, Badge, PageHeader } from '../components/ui';

// Register Chart.js components once
ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler
);

// ── Static recent workflows data ─────────────────────────────────
const RECENT_WORKFLOWS = [
  { name: 'Invoice Approval',    category: 'Finance',  status: 'Active', time: '2 min ago' },
  { name: 'Employee Onboarding', category: 'HR',       status: 'Active', time: '1h ago'    },
  { name: 'Data Sync Pipeline',  category: 'IT',       status: 'Paused', time: '45 min ago'},
  { name: 'Deploy Notification', category: 'DevOps',   status: 'Active', time: '3h ago'    },
];

// ── Static activity timeline ──────────────────────────────────────
const TIMELINE = [
  { color: 'border-emerald-500 bg-emerald-50', title: 'Invoice workflow executed successfully',     meta: '2 min ago · system'      },
  { color: 'border-indigo-500 bg-indigo-50',   title: 'Rule #14 threshold updated',                meta: '18 min ago · admin'       },
  { color: 'border-amber-500 bg-amber-50',     title: 'Data Sync pipeline paused for maintenance', meta: '45 min ago · dev.ops'      },
  { color: 'border-rose-500 bg-rose-50',       title: 'ETL Job failed — connection timeout',       meta: '1h ago · auto-alert sent' },
  { color: 'border-emerald-500 bg-emerald-50', title: 'New workflow deployed to production',        meta: '3h ago · ops.team'        },
];

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const isAdmin         = currentUser?.role === 'admin';

  // KPI summary from the API
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/analytics/summary')
      .then((res) => setSummary(res.data))
      .catch(()   => {});
  }, []);

  // ── Trend chart data ──────────────────────────────────────────
  const trendData = {
    labels   : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets : [{
      label           : 'Executions',
      data            : [820, 1100, 940, 1300, 1080, 760, 1243],
      borderColor     : '#6366f1',
      backgroundColor : 'rgba(99,102,241,0.12)',
      borderWidth     : 2.5,
      tension         : 0.45,
      fill            : true,
      pointBackgroundColor : '#6366f1',
      pointRadius     : 4,
      pointHoverRadius: 6,
      pointBorderColor: 'white',
      pointBorderWidth: 2,
    }],
  };

  const trendOptions = {
    responsive          : true,
    maintainAspectRatio : false,
    plugins : { legend: { display: false } },
    scales  : {
      y : { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#94a3b8', font: { size: 11 } } },
      x : { grid: { display: false },             ticks: { color: '#94a3b8', font: { size: 11 } } },
    },
  };

  // ── Donut chart data ──────────────────────────────────────────
  const donutData = {
    labels   : ['Success', 'Failed', 'Pending', 'Paused'],
    datasets : [{
      data            : [1147, 32, 41, 23],
      backgroundColor : ['#10b981', '#f43f5e', '#f59e0b', '#6366f1'],
      borderWidth     : 0,
      hoverOffset     : 8,
    }],
  };

  const donutOptions = {
    responsive          : true,
    maintainAspectRatio : false,
    cutout  : '74%',
    plugins : {
      legend: {
        position : 'right',
        labels   : { boxWidth: 9, padding: 12, color: '#64748b', font: { size: 12 } },
      },
    },
  };

  // ── Hour of day greeting ──────────────────────────────────────
  const hour  = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page-enter">

      <PageHeader
        title={`${greet}${!isAdmin ? `, ${currentUser?.name}` : ''} 👋`}
        subtitle={
          isAdmin
            ? 'Full platform overview — Wednesday, 18 March 2026'
            : `Your workflow dashboard · ${currentUser?.department} department`
        }
        actions={
          isAdmin && (
            <>
              <button className="btn-secondary text-xs px-3 py-1.5">⬇ Export Report</button>
              <Link to="/workflows" className="btn-primary text-xs px-3 py-1.5">＋ New Workflow</Link>
            </>
          )
        }
      />

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {isAdmin ? (
          <>
            <KpiCard label="Active Workflows"  value={summary?.activeWorkflows ?? '24'}   icon="⚡" variant="indigo"  delta="↑ 4 added this week" />
            <KpiCard label="Completed Today"   value={summary?.executionsToday ?? '1,243'} icon="✅" variant="emerald" delta="↑ 18% vs yesterday"   />
            <KpiCard label="Monthly Approvals" value="342"                                 icon="📋" variant="amber"   delta="47 pending · action needed" />
            <KpiCard label="Failed Executions" value={summary?.failedRuns ?? '3'}          icon="⚠️" variant="rose"    delta="↓ 2 vs yesterday" />
          </>
        ) : (
          <>
            <KpiCard label="My Workflows"     value="2"   icon="⚡" variant="indigo"  delta="Active workflows assigned"    />
            <KpiCard label="Runs This Month"  value="48"  icon="✅" variant="emerald" delta="↑ 12% vs last month"          />
            <KpiCard label="Pending Approvals"value="2"   icon="⏳" variant="amber"   delta="Awaiting your action"         />
            <KpiCard label="My Active Rules"  value={summary?.totalRules ?? '3'} icon="🎯" variant="rose" delta="Custom rules configured" />
          </>
        )}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-[1.65fr_1fr] gap-4 mb-4">

        {/* Trend line chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Execution Activity</h3>
              <p className="text-xs text-slate-400 mt-0.5">Last 7 days</p>
            </div>
            <Badge status="success" label="Live" />
          </div>
          <div className="h-52">
            <Line data={trendData} options={trendOptions} />
          </div>
        </div>

        {/* Status donut chart */}
        <div className="card p-5">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Status Breakdown</h3>
          <div className="h-52">
            <Doughnut data={donutData} options={donutOptions} />
          </div>
        </div>

      </div>

      {/* ── Recent workflows + Timeline ── */}
      <div className="grid grid-cols-2 gap-4">

        {/* Recent workflows mini table */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Recent Workflows</h3>
            <Link to="/workflows" className="btn-ghost text-xs px-2 py-1">View all →</Link>
          </div>
          <div>
            {(isAdmin ? RECENT_WORKFLOWS : RECENT_WORKFLOWS.slice(0, 2)).map((wf) => (
              <Link
                key={wf.name}
                to="/workflows"
                className="flex items-center gap-2.5 py-2.5 border-b border-slate-100
                           last:border-0 hover:bg-slate-50 -mx-1 px-1 rounded-md transition-colors duration-100"
              >
                <div className="w-8 h-8 rounded-md bg-indigo-50 flex items-center justify-center text-sm flex-shrink-0">
                  📋
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{wf.name}</p>
                  <p className="text-xs text-slate-400">{wf.category} · {wf.time}</p>
                </div>
                <Badge status={wf.status} />
              </Link>
            ))}
          </div>
        </div>

        {/* Activity timeline */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Recent Activity</h3>
            {isAdmin && (
              <Link to="/auditlog" className="btn-ghost text-xs px-2 py-1">View audit log →</Link>
            )}
          </div>
          <div>
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex gap-3 pb-3.5 last:pb-0">
                <div className="flex flex-col items-center w-5 flex-shrink-0">
                  <div className={`w-2.5 h-2.5 rounded-full border-2 mt-0.5 ${item.color}`} />
                  {i < TIMELINE.length - 1 && (
                    <div className="flex-1 w-px bg-slate-200 mt-1" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
