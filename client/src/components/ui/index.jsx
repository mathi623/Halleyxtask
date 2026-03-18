/**
 * Shared UI Components
 * ─────────────────────────────────────────────────────────────────
 * Small, reusable components used across multiple pages.
 *
 * Exports:
 *   KpiCard   — stat card with coloured accent bar
 *   Badge     — status label pill (success, warning, error, info)
 *   Modal     — overlay dialog with backdrop
 *   Toggle    — on/off switch for rules
 *   PageHeader — page title + subtitle + action buttons row
 * ─────────────────────────────────────────────────────────────────
 */

import React from 'react';

// ── KpiCard ───────────────────────────────────────────────────────

/**
 * Dashboard stat card.
 * @param {string}  label     — card title (uppercase, small)
 * @param {string}  value     — big number displayed
 * @param {string}  delta     — small change text below the value
 * @param {string}  icon      — emoji icon
 * @param {string}  variant   — 'indigo' | 'emerald' | 'amber' | 'rose'
 */
export const KpiCard = ({ label, value, delta, icon, variant = 'indigo' }) => {
  const accentMap = {
    indigo  : 'from-indigo-500',
    emerald : 'from-emerald-500',
    amber   : 'from-amber-500',
    rose    : 'from-rose-500',
  };
  const iconBgMap = {
    indigo  : 'bg-indigo-50',
    emerald : 'bg-emerald-50',
    amber   : 'bg-amber-50',
    rose    : 'bg-rose-50',
  };
  const valueColorMap = {
    indigo  : 'text-indigo-600',
    emerald : 'text-emerald-600',
    amber   : 'text-amber-500',
    rose    : 'text-rose-500',
  };

  return (
    <div className="card p-5 relative overflow-hidden hover:shadow-card-md
                    hover:-translate-y-px transition-all duration-200">

      {/* Coloured bottom accent bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5
                       bg-gradient-to-r ${accentMap[variant]} to-transparent`} />

      <div className="flex items-start justify-between mb-2.5">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <div className={`w-9 h-9 rounded-md flex items-center justify-center
                         text-base ${iconBgMap[variant]}`}>
          {icon}
        </div>
      </div>

      <p className={`text-3xl font-extrabold leading-none tracking-tight ${valueColorMap[variant]}`}>
        {value}
      </p>

      {delta && (
        <p className="text-xs text-slate-500 mt-1.5">{delta}</p>
      )}
    </div>
  );
};

// ── Badge ─────────────────────────────────────────────────────────

/**
 * Status badge pill.
 * @param {string} status — 'Active'|'Paused'|'Draft'|'success'|'warning'|'error'|'info'
 * @param {string} label  — optional override text (defaults to status)
 */
export const Badge = ({ status, label }) => {
  const styleMap = {
    Active  : 'bg-emerald-50 text-emerald-600',
    Paused  : 'bg-amber-50 text-amber-700',
    Draft   : 'bg-slate-100 text-slate-600',
    Failed  : 'bg-rose-50 text-rose-600',
    success : 'bg-emerald-50 text-emerald-600',
    warning : 'bg-amber-50 text-amber-700',
    error   : 'bg-rose-50 text-rose-600',
    info    : 'bg-sky-50 text-sky-600',
  };
  const dotMap = {
    Active  : 'bg-emerald-500',
    Paused  : 'bg-amber-500',
    Draft   : 'bg-slate-400',
    Failed  : 'bg-rose-500',
    success : 'bg-emerald-500',
    warning : 'bg-amber-500',
    error   : 'bg-rose-500',
    info    : 'bg-sky-500',
  };

  return (
    <span className={`badge ${styleMap[status] || 'bg-slate-100 text-slate-600'}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotMap[status] || 'bg-slate-400'}`} />
      {label || status}
    </span>
  );
};

// ── Modal ─────────────────────────────────────────────────────────

/**
 * Overlay modal dialog.
 * @param {boolean}  isOpen   — controls visibility
 * @param {function} onClose  — called when backdrop is clicked
 * @param {string}   title    — modal heading
 * @param {string}   subtitle — optional sub-heading
 * @param {node}     children — modal body content
 * @param {node}     footer   — modal footer (action buttons)
 * @param {string}   width    — optional Tailwind max-width class
 */
export const Modal = ({ isOpen, onClose, title, subtitle, children, footer, width = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 z-50 flex items-center
                 justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Stop click from bubbling to backdrop */}
      <div
        className={`bg-white rounded-2xl shadow-card-lg w-full ${width} p-7`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2 className="font-serif text-lg font-semibold text-slate-900 mb-1">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-slate-500 mb-5">{subtitle}</p>
        )}

        {/* Body */}
        <div>{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-slate-200">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Toggle ────────────────────────────────────────────────────────

/**
 * On/off toggle switch.
 * @param {boolean}  checked   — current state
 * @param {function} onChange  — called with the new boolean value
 */
export const Toggle = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="sr-only"
    />
    <div className={`w-9 h-5 rounded-full transition-colors duration-200 relative
                     ${checked ? 'bg-indigo-500' : 'bg-slate-200'}`}>
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full
                       shadow transition-transform duration-200
                       ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </div>
  </label>
);

// ── PageHeader ────────────────────────────────────────────────────

/**
 * Standard page heading row used at the top of every page.
 * @param {string} title    — page title (uses serif font)
 * @param {string} subtitle — smaller description below the title
 * @param {node}   actions  — buttons rendered on the right side
 */
export const PageHeader = ({ title, subtitle, actions }) => (
  <div className="flex items-start justify-between mb-5">
    <div>
      <h1 className="font-serif text-xl font-semibold text-slate-900 tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      )}
    </div>
    {actions && (
      <div className="flex items-center gap-2">{actions}</div>
    )}
  </div>
);
