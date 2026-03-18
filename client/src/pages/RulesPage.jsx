/**
 * RulesPage
 * ─────────────────────────────────────────────────────────────────
 * Displays all configured rules.
 * Two action buttons:
 *   "Use Our Rule Template" — pick from pre-built rule templates
 *   "Add Custom Rule"       — inline form to create from scratch
 *
 * Each rule shows:
 *   - Name + workflow it applies to
 *   - Condition chips: field → operator → value
 *   - "Then" action badge
 *   - Toggle to enable/disable
 *   - Delete button
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useState } from 'react';
import api                             from '../utils/api';
import { useAuth }                     from '../context/AuthContext';
import { Badge, Modal, Toggle, PageHeader } from '../components/ui';

// ── Pre-built rule templates ──────────────────────────────────────
const RULE_TEMPLATES = [
  { name: 'High Value Invoice',  field: 'invoice.amount',   operator: 'greater_than', value: '5000',       action: 'Require Manager Approval', workflow: 'Invoice Approval'    },
  { name: 'New Employee Start',  field: 'employee.status',  operator: 'equals',       value: 'onboarding', action: 'Send Slack Notification',   workflow: 'Employee Onboarding' },
  { name: 'Long Leave Request',  field: 'leave.days',       operator: 'greater_than', value: '5',          action: 'Escalate to HR Director',   workflow: 'Leave Request Flow'  },
  { name: 'Low Priority Deploy', field: 'request.priority', operator: 'equals',       value: 'low',        action: 'Auto-approve',              workflow: 'Deploy Notification' },
  { name: 'Overdue Invoice',     field: 'invoice.amount',   operator: 'greater_than', value: '10000',      action: 'Escalate to HR Director',   workflow: 'Invoice Approval'    },
];

const RulesPage = () => {
  const { currentUser } = useAuth();
  const isAdmin         = currentUser?.role === 'admin';

  const [rules,          setRules]          = useState([]);
  const [loading,        setLoading]        = useState(true);

  // Inline custom rule form visibility
  const [showForm,       setShowForm]       = useState(false);

  // Rule template picker modal
  const [showPickModal,  setShowPickModal]  = useState(false);
  const [pickedTemplate, setPickedTemplate] = useState(null);

  // Custom rule form state
  const [rName,     setRName]     = useState('');
  const [rField,    setRField]    = useState('invoice.amount');
  const [rOperator, setROperator] = useState('greater_than');
  const [rValue,    setRValue]    = useState('');
  const [rAction,   setRAction]   = useState('Require Manager Approval');
  const [rWorkflow, setRWorkflow] = useState('Invoice Approval');
  const [saving,    setSaving]    = useState(false);

  // ── Fetch rules on mount ────────────────────────────────────────
  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await api.get('/rules');
      setRules(res.data.rules);
    } catch (err) {
      console.error('Failed to fetch rules:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Toggle a rule's enabled state ──────────────────────────────
  const handleToggle = async (rule, newValue) => {
    try {
      await api.patch(`/rules/${rule._id}`, { enabled: newValue });
      setRules((prev) =>
        prev.map((r) => r._id === rule._id ? { ...r, enabled: newValue } : r)
      );
    } catch (err) {
      console.error('Failed to toggle rule:', err.message);
    }
  };

  // ── Delete a rule ───────────────────────────────────────────────
  const handleDelete = async (ruleId) => {
    try {
      await api.delete(`/rules/${ruleId}`);
      setRules((prev) => prev.filter((r) => r._id !== ruleId));
    } catch (err) {
      console.error('Failed to delete rule:', err.message);
    }
  };

  // ── Save a custom rule ──────────────────────────────────────────
  const handleSaveCustomRule = async () => {
    if (!rName.trim() || !rValue.trim()) return;
    setSaving(true);
    try {
      await api.post('/rules', {
        name     : rName,
        field    : rField,
        operator : rOperator,
        value    : rValue,
        action   : rAction,
        workflow : rWorkflow,
      });
      await fetchRules();
      setShowForm(false);
      setRName(''); setRValue('');
    } catch (err) {
      console.error('Failed to create rule:', err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Add a rule from template ────────────────────────────────────
  const handlePickTemplate = async () => {
    if (pickedTemplate === null) return;
    const tmpl = RULE_TEMPLATES[pickedTemplate];
    try {
      await api.post('/rules', tmpl);
      await fetchRules();
      setShowPickModal(false);
      setPickedTemplate(null);
    } catch (err) {
      console.error('Failed to add template rule:', err.message);
    }
  };

  return (
    <div className="page-enter">

      <PageHeader
        title="Rule Builder"
        subtitle="Define conditions and automated actions for your workflows"
        actions={
          <>
            <button onClick={() => setShowPickModal(true)} className="btn-secondary text-xs px-3 py-1.5">
              📋 Use Our Rule Template
            </button>
            <button onClick={() => setShowForm((v) => !v)} className="btn-primary text-xs px-3 py-1.5">
              ＋ Add Custom Rule
            </button>
          </>
        }
      />

      {/* Employee info banner */}
      {!isAdmin && (
        <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-sky-50
                        border border-indigo-100 rounded-xl px-5 py-4 mb-4">
          <span className="text-xl">💡</span>
          <div>
            <p className="text-sm font-bold text-indigo-700">Customise rules for your workflows</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Use our pre-built templates or create your own rules below.
            </p>
          </div>
        </div>
      )}

      {/* ── Inline custom rule form ── */}
      {showForm && (
        <div className="bg-slate-50 border-[1.5px] border-indigo-100 rounded-xl p-5 mb-4">
          <p className="text-sm font-bold text-slate-800 mb-4">Custom Rule Configuration</p>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Rule Name</label>
              <input className="form-input" value={rName} onChange={(e) => setRName(e.target.value)} placeholder="e.g. High Value Invoice" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Field</label>
              <select className="form-input" value={rField} onChange={(e) => setRField(e.target.value)}>
                {['invoice.amount','user.department','request.priority','employee.status','order.value','leave.days'].map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Operator</label>
              <select className="form-input" value={rOperator} onChange={(e) => setROperator(e.target.value)}>
                {['greater_than','less_than','equals','not_equals','contains'].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Value</label>
              <input className="form-input" value={rValue} onChange={(e) => setRValue(e.target.value)} placeholder="e.g. 5000" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Then — Action</label>
              <select className="form-input" value={rAction} onChange={(e) => setRAction(e.target.value)}>
                {['Require Manager Approval','Send Slack Notification','Flag for Review','Auto-approve','Escalate to HR Director','Send Email Alert'].map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Workflow</label>
              <select className="form-input" value={rWorkflow} onChange={(e) => setRWorkflow(e.target.value)}>
                {['Invoice Approval','Employee Onboarding','Data Sync Pipeline','Deploy Notification','Leave Request Flow'].map((w) => (
                  <option key={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSaveCustomRule} disabled={saving} className="btn-primary text-xs px-3 py-1.5">
              {saving ? 'Saving...' : 'Save Rule'}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-secondary text-xs px-3 py-1.5">Cancel</button>
          </div>
        </div>
      )}

      {/* ── Rules list card ── */}
      <div className="card">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Configured Rules</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {rules.length} rule{rules.length !== 1 ? 's' : ''} configured
            </p>
          </div>
          <Badge status="success" label="Engine running" />
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-slate-400">Loading rules...</div>
        ) : rules.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400">
            No rules yet. Add a custom rule or pick a template above.
          </div>
        ) : (
          rules.map((rule) => (
            <div
              key={rule._id}
              className="px-5 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors duration-100"
            >
              {/* Rule header row */}
              <div className="flex items-center gap-2.5 mb-2.5">
                <p className="text-sm font-bold text-slate-800 flex-1">{rule.name}</p>
                <span className="text-xs text-slate-400">{rule.workflow}</span>
                <Toggle checked={rule.enabled} onChange={(val) => handleToggle(rule, val)} />
                <button
                  onClick={() => handleDelete(rule._id)}
                  className="text-slate-300 hover:text-rose-500 text-base leading-none
                             px-1 transition-colors duration-150"
                  title="Delete rule"
                >
                  ✕
                </button>
              </div>

              {/* Condition chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full
                                 bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {rule.field}
                </span>
                <span className="text-slate-400 text-xs">→</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full
                                 bg-slate-100 text-slate-600 border border-slate-200">
                  {rule.operator}
                </span>
                <span className="text-slate-400 text-xs">→</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full
                                 bg-emerald-50 text-emerald-600 border border-emerald-200">
                  {rule.value}
                </span>
              </div>

              {/* Then action */}
              <div className="flex items-center gap-2 mt-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  then →
                </span>
                <Badge status={rule.enabled ? 'success' : 'neutral'} label={rule.action} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Modal: Pick rule template ── */}
      <Modal
        isOpen={showPickModal}
        onClose={() => { setShowPickModal(false); setPickedTemplate(null); }}
        title="Use Our Rule Template"
        subtitle="Choose a pre-built rule and it will be added to your rule set"
        width="max-w-xl"
        footer={
          <>
            <button onClick={() => { setShowPickModal(false); setPickedTemplate(null); }} className="btn-secondary text-xs px-3 py-1.5">Cancel</button>
            <button onClick={handlePickTemplate} className="btn-primary text-xs px-3 py-1.5">Add Selected Rule</button>
          </>
        }
      >
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {RULE_TEMPLATES.map((tmpl, i) => (
            <div
              key={tmpl.name}
              onClick={() => setPickedTemplate(i)}
              className={`flex items-center gap-3 p-3 border-[1.5px] rounded-lg cursor-pointer
                          transition-all duration-150
                          ${pickedTemplate === i ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}
            >
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800 mb-1.5">{tmpl.name}</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">{tmpl.field}</span>
                  <span className="text-slate-400 text-xs">→</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">{tmpl.operator}</span>
                  <span className="text-slate-400 text-xs">→</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">{tmpl.value}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">
                  Then: <strong className="text-emerald-600">{tmpl.action}</strong> · {tmpl.workflow}
                </p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                               text-white text-xs flex-shrink-0 transition-all duration-150
                               ${pickedTemplate === i ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                {pickedTemplate === i && '✓'}
              </div>
            </div>
          ))}
        </div>
      </Modal>

    </div>
  );
};

export default RulesPage;
