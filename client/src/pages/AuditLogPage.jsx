/**
 * AuditLogPage  (Admin only)
 * ─────────────────────────────────────────────────────────────────
 * Fetches and displays the full tamper-proof audit log.
 * Filterable by event category.
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useState } from 'react';
import api                             from '../utils/api';
import { Badge, PageHeader }           from '../components/ui';

// Avatar background colours cycled by row index
const AVATAR_COLORS = ['#6366f1','#8b5cf6','#10b981','#f59e0b','#f43f5e','#0ea5e9'];

// Filter tabs definition
const FILTERS = [
  { label: 'All events',      value: 'all'       },
  { label: 'Workflow',        value: 'workflow'  },
  { label: 'Rules',           value: 'rule'      },
  { label: 'Authentication',  value: 'auth'      },
  { label: 'Execution',       value: 'execution' },
  { label: 'Settings',        value: 'settings'  },
];

const AuditLogPage = () => {
  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');

  // Fetch logs whenever the filter changes
  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auditlogs', {
        params: { filter },
      });
      setLogs(res.data.logs);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Format ISO timestamp to readable string
  const formatTs = (ts) =>
    new Date(ts).toLocaleString('en-GB', {
      day   : '2-digit', month: '2-digit', year: 'numeric',
      hour  : '2-digit', minute: '2-digit', second: '2-digit',
    });

  return (
    <div className="page-enter">

      <PageHeader
        title="Audit Logs"
        subtitle="Complete tamper-proof record of all platform actions and events"
        actions={
          <>
            <input
              type="date"
              defaultValue="2026-03-18"
              className="form-input w-40 text-xs"
            />
            <button className="btn-secondary text-xs px-3 py-1.5">⬇ Export CSV</button>
          </>
        }
      />

      {/* ── Filter tabs ── */}
      <div className="flex items-center gap-1.5 mb-4 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
                        ${filter === f.value
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Audit log table ── */}
      <div className="card overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b border-slate-200">
                {['Timestamp', 'Event', 'Actor', 'Module', 'Status', 'Details'].map((h) => (
                  <th key={h} className="text-left text-xs font-bold uppercase tracking-wide
                                         text-slate-400 px-4 pb-3 pt-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-sm text-slate-400">
                    Loading audit logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-sm text-slate-400">
                    No events found for this filter.
                  </td>
                </tr>
              ) : (
                logs.map((log, i) => (
                  <tr
                    key={log._id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors duration-100"
                  >
                    {/* Timestamp */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-slate-500">
                        {formatTs(log.createdAt)}
                      </span>
                    </td>

                    {/* Event name */}
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-slate-700">{log.event}</span>
                    </td>

                    {/* Actor with avatar */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center
                                     text-white text-[10px] font-bold flex-shrink-0"
                          style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                        >
                          {log.actor.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-slate-600">{log.actor}</span>
                      </div>
                    </td>

                    {/* Module */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-500">{log.module}</span>
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-3">
                      <Badge status={log.status} />
                    </td>

                    {/* Details */}
                    <td className="px-4 py-3 max-w-[200px]">
                      <span className="text-xs text-slate-400 truncate block">{log.details}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AuditLogPage;
