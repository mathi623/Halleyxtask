/**
 * SettingsPage  (Admin only)
 * ─────────────────────────────────────────────────────────────────
 * Five sub-panels accessible via a left settings nav:
 *   General, Notifications, Integrations, Security, Team Members
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { Badge, Toggle, PageHeader } from '../components/ui';

// Sub-panel definitions
const PANELS = [
  { id: 'general',       label: 'General'       },
  { id: 'notifications', label: 'Notifications' },
  { id: 'integrations',  label: 'Integrations'  },
  { id: 'security',      label: 'Security'      },
  { id: 'team',          label: 'Team Members'  },
];

// ── Reusable row inside a settings panel ─────────────────────────
const SettingRow = ({ label, hint, children }) => (
  <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
    <div>
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
    </div>
    <div>{children}</div>
  </div>
);

// ── Individual panel components ───────────────────────────────────

const GeneralPanel = ({ onSave }) => (
  <>
    <SettingRow label="Workspace Name"       hint="Shown across the platform">
      <input className="form-input w-52" defaultValue="Acme Corp — HR" />
    </SettingRow>
    <SettingRow label="Timezone"             hint="For scheduling and timestamps">
      <select className="form-input w-52">
        <option>Asia/Kolkata (IST)</option>
        <option>UTC</option>
        <option>America/New_York (EST)</option>
        <option>Europe/London (GMT)</option>
      </select>
    </SettingRow>
    <SettingRow label="Default Timeout (sec)" hint="Max execution time per workflow">
      <input className="form-input w-52" type="number" defaultValue={30} />
    </SettingRow>
    <SettingRow label="Date Format"           hint="Applied across all date fields">
      <select className="form-input w-52">
        <option>DD/MM/YYYY</option>
        <option>MM/DD/YYYY</option>
        <option>YYYY-MM-DD</option>
      </select>
    </SettingRow>
    <SettingRow label="Auto-save Drafts"      hint="Automatically save workflow edits">
      <Toggle checked={true} onChange={() => {}} />
    </SettingRow>
    <div className="pt-4">
      <button onClick={onSave} className="btn-primary text-xs px-4 py-1.5">
        Save Changes
      </button>
    </div>
  </>
);

const NotificationsPanel = ({ onSave }) => (
  <>
    <SettingRow label="Email Notifications"   hint="Receive workflow alerts via email">
      <Toggle checked={true} onChange={() => {}} />
    </SettingRow>
    <SettingRow label="Slack Alerts"          hint="Post notifications to Slack channels">
      <Toggle checked={true} onChange={() => {}} />
    </SettingRow>
    <SettingRow label="Failure Alerts"        hint="Immediately notify on failed executions">
      <Toggle checked={true} onChange={() => {}} />
    </SettingRow>
    <SettingRow label="Approval Reminders"    hint="Remind approvers of pending items">
      <Toggle checked={false} onChange={() => {}} />
    </SettingRow>
    <SettingRow label="Notification Email"    hint="Primary address for all alerts">
      <input className="form-input w-52" defaultValue="admin@company.com" />
    </SettingRow>
    <div className="pt-4">
      <button onClick={onSave} className="btn-primary text-xs px-4 py-1.5">
        Save Changes
      </button>
    </div>
  </>
);

const IntegrationsPanel = () => (
  <>
    <SettingRow label="Slack"         hint="acmecorp.slack.com">
      <Badge status="success" label="Connected" />
    </SettingRow>
    <SettingRow label="Jira"          hint="Project & ticket tracking">
      <Badge status="success" label="Connected" />
    </SettingRow>
    <SettingRow label="GitHub"        hint="Trigger workflows on PR/push events">
      <Badge status="warning" label="Configure" />
    </SettingRow>
    <SettingRow label="Salesforce CRM" hint="Sync HR events with CRM">
      <Badge status="error" label="Disconnected" />
    </SettingRow>
    <SettingRow label="Webhook URL"   hint="Use this to trigger workflows externally">
      <input className="form-input w-52" readOnly defaultValue="https://api.workflow.io/wh/sr92k" />
    </SettingRow>
    <div className="pt-4">
      <button className="btn-primary text-xs px-4 py-1.5">+ Connect New</button>
    </div>
  </>
);

const SecurityPanel = ({ onSave }) => (
  <>
    <SettingRow label="Two-Factor Authentication" hint="Require 2FA for all admin accounts">
      <Toggle checked={true} onChange={() => {}} />
    </SettingRow>
    <SettingRow label="Session Timeout (min)"     hint="Auto-logout after inactivity">
      <input className="form-input w-52" type="number" defaultValue={60} />
    </SettingRow>
    <SettingRow label="Audit Log Retention (days)" hint="How long audit records are stored">
      <input className="form-input w-52" type="number" defaultValue={180} />
    </SettingRow>
    <SettingRow label="IP Allowlist"              hint="Restrict access to specific IP addresses">
      <Toggle checked={false} onChange={() => {}} />
    </SettingRow>
    <SettingRow label="Platform API Key"          hint="For external integrations">
      <input className="form-input w-52" type="password" defaultValue="sk-pf-live-••••••••" />
    </SettingRow>
    <div className="pt-4">
      <button onClick={onSave} className="btn-primary text-xs px-4 py-1.5">Save Changes</button>
    </div>
  </>
);

const TEAM_MEMBERS = [
  { initial: 'A', bg: 'from-indigo-400 to-violet-500', name: 'Administrator',    email: 'admin@company.com',    role: 'Admin',    badge: 'info'    },
  { initial: 'E', bg: 'from-emerald-400 to-emerald-600', name: 'Employee (Finance)', email: 'employee@company.com', role: 'Employee', badge: 'success' },
  { initial: 'M', bg: 'from-amber-400 to-amber-600',   name: 'Manager (HR)',     email: 'manager@company.com',  role: 'Approver', badge: 'warning' },
];

const TeamPanel = () => (
  <>
    {TEAM_MEMBERS.map((m) => (
      <SettingRow key={m.email} label="" hint="">
        <div className="flex items-center gap-2.5 w-full">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${m.bg}
                           flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {m.initial}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700">{m.name}</p>
            <p className="text-xs text-slate-400">{m.email}</p>
          </div>
          <Badge status={m.badge} label={m.role} />
        </div>
      </SettingRow>
    ))}
    <div className="pt-4">
      <button className="btn-primary text-xs px-4 py-1.5">+ Invite Member</button>
    </div>
  </>
);

// ── SettingsPage ──────────────────────────────────────────────────

const SettingsPage = () => {
  const [activePanel,  setActivePanel]  = useState('general');
  const [savedPanel,   setSavedPanel]   = useState('');

  // Show "✓ Saved" feedback briefly
  const handleSave = () => {
    setSavedPanel(activePanel);
    setTimeout(() => setSavedPanel(''), 2000);
  };

  const renderPanel = () => {
    switch (activePanel) {
      case 'general':       return <GeneralPanel       onSave={handleSave} />;
      case 'notifications': return <NotificationsPanel onSave={handleSave} />;
      case 'integrations':  return <IntegrationsPanel />;
      case 'security':      return <SecurityPanel      onSave={handleSave} />;
      case 'team':          return <TeamPanel />;
      default:              return null;
    }
  };

  return (
    <div className="page-enter">

      <PageHeader
        title="Settings"
        subtitle="Configure platform preferences, integrations, and team access"
      />

      <div className="grid grid-cols-[192px_1fr] gap-5">

        {/* Settings sub-nav */}
        <div className="flex flex-col gap-0.5">
          {PANELS.map((panel) => (
            <button
              key={panel.id}
              onClick={() => setActivePanel(panel.id)}
              className={`text-left px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150
                          ${activePanel === panel.id
                            ? 'bg-indigo-50 text-indigo-600 font-semibold'
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
            >
              {panel.label}
              {savedPanel === panel.id && (
                <span className="ml-2 text-xs text-emerald-600 font-bold">✓ Saved</span>
              )}
            </button>
          ))}
        </div>

        {/* Active panel card */}
        <div className="card">
          <div className="p-5 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800">
              {PANELS.find((p) => p.id === activePanel)?.label}
            </h3>
          </div>
          <div className="p-5">
            {renderPanel()}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
