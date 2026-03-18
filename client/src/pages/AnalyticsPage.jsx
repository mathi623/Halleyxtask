/**
 * AnalyticsPage
 * ─────────────────────────────────────────────────────────────────
 * Performance metrics and charts.
 * Admin sees platform-wide data; employee sees personal data.
 *
 * Charts:
 *   - Runs over time (line, 30 days)
 *   - Execution time per workflow (bar)
 *   - Error breakdown (doughnut)
 *   - Hourly activity distribution (bar)
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, BarElement, ArcElement,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

import { useAuth }          from '../context/AuthContext';
import api                  from '../utils/api';
import { KpiCard, PageHeader } from '../components/ui';

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement,
  Title, Tooltip, Legend, Filler
);

// Shared chart scale options for a consistent look
const GRID_OPTS = { color: 'rgba(0,0,0,0.04)' };
const TICK_OPTS = { color: '#94a3b8', font: { size: 11 } };

const AnalyticsPage = () => {
  const { currentUser } = useAuth();
  const isAdmin         = currentUser?.role === 'admin';

  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/analytics/summary')
      .then((res) => setSummary(res.data))
      .catch(() => {});
  }, []);

  // ── Chart data ─────────────────────────────────────────────────

  // Runs over 30 days — randomised demo data
  const days30   = Array.from({ length: 30 }, (_, i) => `${i + 1}/3`);
  const runValues = Array.from({ length: 30 }, () => Math.floor(700 + Math.random() * 800));

  const runData = {
    labels   : days30,
    datasets : [{
      data            : runValues,
      borderColor     : '#6366f1',
      backgroundColor : 'rgba(99,102,241,0.1)',
      borderWidth     : 2,
      tension         : 0.4,
      fill            : true,
      pointRadius     : 0,
    }],
  };

  const perfData = {
    labels   : ['Invoice', 'Onboard', 'DataSync', 'Deploy', 'ETL'],
    datasets : [{
      data            : [1.4, 2.1, 0.9, 0.6, 3.2],
      backgroundColor : ['#6366f1cc','#8b5cf6cc','#10b981cc','#f59e0bcc','#f43f5ecc'],
      borderRadius    : 6,
    }],
  };

  const errorData = {
    labels   : ['Timeout', 'Auth Fail', 'Bad Data', 'Rate Limit'],
    datasets : [{
      data            : [38, 22, 27, 13],
      backgroundColor : ['#f43f5e', '#f59e0b', '#8b5cf6', '#6366f1'],
      borderWidth     : 0,
      hoverOffset     : 8,
    }],
  };

  const hourData = {
    labels   : Array.from({ length: 24 }, (_, i) => `${i}h`),
    datasets : [{
      data            : [12,8,5,3,4,9,45,120,180,210,195,220,198,185,173,190,210,225,190,160,95,60,40,20],
      backgroundColor : 'rgba(99,102,241,0.35)',
      borderRadius    : 4,
    }],
  };

  // Common chart options factory
  const lineOpts   = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: GRID_OPTS, ticks: TICK_OPTS }, x: { ticks: { ...TICK_OPTS, maxTicksLimit: 7 }, grid: { display: false } } } };
  const barOpts    = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: GRID_OPTS, ticks: TICK_OPTS }, x: { grid: { display: false }, ticks: TICK_OPTS } } };
  const donutOpts  = { responsive: true, maintainAspectRatio: false, cutout: '67%', plugins: { legend: { position: 'right', labels: { boxWidth: 9, padding: 10, color: '#64748b', font: { size: 11 } } } } };
  const hourOpts   = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: GRID_OPTS, ticks: TICK_OPTS }, x: { ticks: { ...TICK_OPTS, maxTicksLimit: 10 }, grid: { display: false } } } };

  // Volume bars data (role-specific)
  const volumeBars = isAdmin
    ? [
        { label: 'Invoice Approval',    value: '8,231', pct: 82, color: 'bg-indigo-500'  },
        { label: 'Data Sync Pipeline',  value: '6,104', pct: 61, color: 'bg-violet-500'  },
        { label: 'Employee Onboarding', value: '4,890', pct: 49, color: 'bg-emerald-500' },
        { label: 'Deploy Notification', value: '3,210', pct: 32, color: 'bg-amber-500'   },
        { label: 'ETL Job',             value: '1,890', pct: 19, color: 'bg-rose-500'    },
      ]
    : [
        { label: 'Leave Request Flow', value: '980', pct: 82, color: 'bg-indigo-500'  },
        { label: 'Invoice Approval',   value: '186', pct: 30, color: 'bg-emerald-500' },
      ];

  return (
    <div className="page-enter">

      <PageHeader
        title="Analytics"
        subtitle={
          isAdmin
            ? 'Full platform performance — last 30 days'
            : 'Your personal workflow analytics — last 30 days'
        }
        actions={
          <>
            <button className="btn-secondary text-xs px-3 py-1.5">⬇ Download PDF</button>
            <button className="btn-secondary text-xs px-3 py-1.5">📅 Last 30 days ▾</button>
          </>
        }
      />

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {isAdmin ? (
          <>
            <KpiCard label="Total Runs"    value={summary ? (summary.executionsToday * 30).toLocaleString() : '28,491'} icon="📈" variant="indigo"  delta="↑ 23% vs last month"  />
            <KpiCard label="Success Rate"  value="97.4%"  icon="✅" variant="emerald" delta="↑ 0.8% improvement"  />
            <KpiCard label="Avg Exec Time" value="1.2s"   icon="⏱" variant="amber"   delta="↓ 0.3s faster"       />
            <KpiCard label="Failed Runs"   value={summary?.failedRuns ?? '742'} icon="❌" variant="rose" delta="2.6% failure rate" />
          </>
        ) : (
          <>
            <KpiCard label="My Total Runs"  value="186"   icon="📈" variant="indigo"  delta="↑ 12% vs last month"    />
            <KpiCard label="Success Rate"   value="98.9%" icon="✅" variant="emerald" delta="↑ 1.2% improvement"      />
            <KpiCard label="Avg Exec Time"  value="0.9s"  icon="⏱" variant="amber"   delta="Faster than platform avg" />
            <KpiCard label="Failed Runs"    value="2"     icon="❌" variant="rose"    delta="1.1% failure rate"        />
          </>
        )}
      </div>

      {/* ── Three charts ── */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="card p-5">
          <div className="mb-3"><p className="text-sm font-bold text-slate-800">Runs Over Time</p><p className="text-xs text-slate-400 mt-0.5">30-day volume</p></div>
          <div className="h-48"><Line data={runData} options={lineOpts} /></div>
        </div>
        <div className="card p-5">
          <div className="mb-3"><p className="text-sm font-bold text-slate-800">Execution Time</p><p className="text-xs text-slate-400 mt-0.5">By workflow (avg sec)</p></div>
          <div className="h-48"><Bar data={perfData} options={barOpts} /></div>
        </div>
        <div className="card p-5">
          <div className="mb-3"><p className="text-sm font-bold text-slate-800">Error Breakdown</p><p className="text-xs text-slate-400 mt-0.5">By error type</p></div>
          <div className="h-48"><Doughnut data={errorData} options={donutOpts} /></div>
        </div>
      </div>

      {/* ── Volume bars + Hourly chart ── */}
      <div className="grid grid-cols-2 gap-4">

        <div className="card p-5">
          <p className="text-sm font-bold text-slate-800 mb-4">
            {isAdmin ? 'Top Workflows by Volume' : 'My Workflow Volume'}
          </p>
          <div className="space-y-3.5">
            {volumeBars.map((bar) => (
              <div key={bar.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs font-medium text-slate-700">{bar.label}</span>
                  <span className="text-xs font-bold text-slate-500">{bar.value}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${bar.color}`}
                    style={{ width: `${bar.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-3"><p className="text-sm font-bold text-slate-800">Hourly Activity</p><p className="text-xs text-slate-400 mt-0.5">Today's peak hours</p></div>
          <div className="h-48"><Bar data={hourData} options={hourOpts} /></div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsPage;
