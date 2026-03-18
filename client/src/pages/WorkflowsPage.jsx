/**
 * WorkflowsPage
 * ─────────────────────────────────────────────────────────────────
 * Lists all workflows in a table with filter tabs and search.
 * Two action buttons:
 *   "Use Existing Workflow" — pick from pre-built templates
 *   "Create New Workflow"   — custom workflow creation modal
 *
 * Also renders the visual step-by-step workflow builder below the table.
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useState, useMemo } from 'react';
import api                                       from '../utils/api';
import { useAuth }                               from '../context/AuthContext';
import { Badge, Modal, PageHeader }              from '../components/ui';

// ── Pre-built template library ────────────────────────────────────
const WORKFLOW_TEMPLATES = [
  { name: 'Invoice Approval',    category: 'Finance · Approval',  trigger: 'Webhook'         },
  { name: 'Employee Onboarding', category: 'HR · Onboarding',     trigger: 'Manual'          },
  { name: 'Leave Request Flow',  category: 'HR · Approval',       trigger: 'Form Submission' },
  { name: 'Deploy Notification', category: 'DevOps · Notify',     trigger: 'Webhook'         },
  { name: 'Data Sync Pipeline',  category: 'IT · Processing',     trigger: 'Scheduled'       },
  { name: 'Compliance Check',    category: 'Legal · Compliance',  trigger: 'Scheduled'       },
];

// ── Visual builder node definition ───────────────────────────────
const BUILDER_NODES = [
  { icon: '🚦', label: 'Trigger',  tag: 'Webhook'       },
  { icon: '🔍', label: 'Condition',tag: 'If / Else'     },
  { icon: '👤', label: 'Assign To',tag: 'Action'        },
  { icon: '✉️', label: 'Notify',   tag: 'Email / Slack' },
  { icon: '✅', label: 'Approve',  tag: 'Manual Review' },
  { icon: '🏁', label: 'Complete', tag: 'End Node'      },
];

const WorkflowsPage = () => {
  const { currentUser } = useAuth();
  const isAdmin         = currentUser?.role === 'admin';

  // All workflows fetched from the server
  const [workflows,       setWorkflows]       = useState([]);
  const [loading,         setLoading]         = useState(true);

  // Filter / search state
  const [statusFilter,    setStatusFilter]    = useState('');
  const [searchQuery,     setSearchQuery]     = useState('');

  // Modal visibility
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPickModal,   setShowPickModal]   = useState(false);

  // Create-new form state
  const [newName,     setNewName]     = useState('');
  const [newCategory, setNewCategory] = useState('Approval');
  const [newStatus,   setNewStatus]   = useState('Draft');
  const [newTrigger,  setNewTrigger]  = useState('Manual');
  const [newPriority, setNewPriority] = useState('Normal');
  const [creating,    setCreating]    = useState(false);

  // Template picker state
  const [pickedTemplate, setPickedTemplate] = useState(null);

  // ── Fetch workflows on mount ────────────────────────────────────
  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const res = await api.get('/workflows');
      setWorkflows(res.data.workflows);
    } catch (err) {
      console.error('Failed to fetch workflows:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Filtered + searched list ────────────────────────────────────
  const visibleWorkflows = useMemo(() => {
    return workflows.filter((wf) => {
      const matchesStatus = !statusFilter || wf.status === statusFilter;
      const matchesSearch = !searchQuery  || wf.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [workflows, statusFilter, searchQuery]);

  // ── Create a new custom workflow ────────────────────────────────
  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await api.post('/workflows', {
        name     : newName,
        category : newCategory,
        status   : newStatus,
        trigger  : newTrigger,
        priority : newPriority,
      });
      await fetchWorkflows();
      setShowCreateModal(false);
      setNewName('');
    } catch (err) {
      console.error('Failed to create workflow:', err.message);
    } finally {
      setCreating(false);
    }
  };

  // ── Add a workflow from the template library ────────────────────
  const handlePickTemplate = async () => {
    if (pickedTemplate === null) return;
    const tmpl = WORKFLOW_TEMPLATES[pickedTemplate];
    try {
      await api.post('/workflows', {
        name     : tmpl.name,
        category : tmpl.category,
        status   : 'Active',
        trigger  : tmpl.trigger,
        priority : 'Normal',
      });
      await fetchWorkflows();
      setShowPickModal(false);
      setPickedTemplate(null);
    } catch (err) {
      console.error('Failed to add template workflow:', err.message);
    }
  };

  // ── Format last-run date nicely ─────────────────────────────────
  const formatLastRun = (date) => {
    if (!date) return 'Never';
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60)   return `${mins} min ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)} day(s) ago`;
  };

  return (
    <div className="page-enter">

      <PageHeader
        title="Workflows"
        subtitle={
          isAdmin
            ? 'Manage and monitor all automated processes across the platform'
            : 'Your assigned workflows — create new or pick from our library'
        }
        actions={
          <>
            <button
              onClick={() => setShowPickModal(true)}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              📂 Use Existing Workflow
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary text-xs px-3 py-1.5"
            >
              ＋ Create New Workflow
            </button>
          </>
        }
      />

      {/* ── Filter tabs + search ── */}
      <div className="flex items-center gap-1.5 mb-4 flex-wrap">
        {['', 'Active', 'Paused', 'Draft'].map((f) => (
          <button
            key={f || 'All'}
            onClick={() => setStatusFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150
                        ${statusFilter === f
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
          >
            {f || 'All'}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 bg-slate-50 border border-slate-200
                        rounded-md px-3 w-48 focus-within:border-indigo-500 transition-all duration-150">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"
               viewBox="0 0 24 24" className="text-slate-400 flex-shrink-0">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs py-1.5 w-full
                       font-sans text-slate-700 placeholder-slate-400"
          />
        </div>
      </div>

      {/* ── Workflows table ── */}
      <div className="card mb-4 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              {['Workflow', 'Category', 'Runs', 'Last Run', 'Status', ''].map((h) => (
                <th key={h} className="text-left text-xs font-bold uppercase tracking-wide
                                       text-slate-400 px-4 pb-3 pt-0">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-sm text-slate-400">
                  Loading workflows...
                </td>
              </tr>
            ) : visibleWorkflows.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-sm text-slate-400">
                  No workflows match your filter.
                </td>
              </tr>
            ) : (
              visibleWorkflows.map((wf) => (
                <tr
                  key={wf._id}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors
                             duration-100 cursor-pointer group"
                >
                  {/* Name + category */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-md bg-indigo-50 flex items-center
                                      justify-center text-sm flex-shrink-0">
                        📋
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{wf.name}</p>
                        <p className="text-xs text-slate-400">{wf.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {wf.category?.split('·')[0]?.trim()}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-600">
                    {wf.runs?.toLocaleString() || 0}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {formatLastRun(wf.lastRun)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={wf.status} />
                  </td>
                  {/* Hover-reveal action buttons */}
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button className="btn-ghost text-xs px-2 py-1">Edit</button>
                      <button className="btn-ghost text-xs px-2 py-1">▶ Run</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Visual workflow builder ── */}
      <div className="card">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Visual Workflow Builder</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Invoice Approval — click any node to configure
            </p>
          </div>
          <button className="btn-primary text-xs px-3 py-1.5">Save Changes</button>
        </div>
        <div className="p-5">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 overflow-x-auto">
            <div className="flex items-center min-w-max">
              {BUILDER_NODES.map((node, i) => (
                <React.Fragment key={node.label}>
                  {/* Flow node */}
                  <div className={`w-28 bg-white border-[1.5px] rounded-xl p-3 text-center
                                   cursor-pointer transition-all duration-150 flex-shrink-0
                                   shadow-sm hover:border-indigo-500 hover:shadow-card hover:-translate-y-0.5
                                   ${i === 0 ? 'border-indigo-500 shadow-[0_0_0_3px_#eef2ff]' : 'border-slate-200'}`}>
                    <span className="text-xl block mb-1.5">{node.icon}</span>
                    <p className="text-xs font-bold text-slate-700">{node.label}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mt-0.5">
                      {node.tag}
                    </p>
                  </div>
                  {/* Connector arrow */}
                  {i < BUILDER_NODES.length - 1 && (
                    <div className="flex items-center px-1 flex-shrink-0">
                      <div className="w-5 h-px bg-slate-300" />
                      <span className="text-slate-400 text-xs ml-[-2px]">▶</span>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal: Create new workflow ── */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Workflow"
        subtitle="Define a custom workflow for your team"
        footer={
          <>
            <button onClick={() => setShowCreateModal(false)} className="btn-secondary text-xs px-3 py-1.5">
              Cancel
            </button>
            <button onClick={handleCreate} disabled={creating} className="btn-primary text-xs px-3 py-1.5">
              {creating ? 'Creating...' : 'Create Workflow'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Workflow name — full width */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-1.5">
              Workflow Name
            </label>
            <input
              className="form-input"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Leave Approval Process"
            />
          </div>
          {/* Category + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-1.5">
                Category
              </label>
              <select className="form-input" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                {['Approval','HR · Onboarding','Finance','IT · DevOps','Compliance','Reporting'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-1.5">
                Status
              </label>
              <select className="form-input" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option>Active</option><option>Draft</option>
              </select>
            </div>
          </div>
          {/* Trigger + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-1.5">
                Trigger
              </label>
              <select className="form-input" value={newTrigger} onChange={(e) => setNewTrigger(e.target.value)}>
                {['Webhook','Scheduled','Manual','Form Submission'].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-1.5">
                Priority
              </label>
              <select className="form-input" value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
                {['Normal','High','Critical'].map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>
      </Modal>

      {/* ── Modal: Pick from template library ── */}
      <Modal
        isOpen={showPickModal}
        onClose={() => { setShowPickModal(false); setPickedTemplate(null); }}
        title="Use Existing Workflow"
        subtitle="Select a pre-built template to add to your account"
        width="max-w-xl"
        footer={
          <>
            <button onClick={() => { setShowPickModal(false); setPickedTemplate(null); }} className="btn-secondary text-xs px-3 py-1.5">
              Cancel
            </button>
            <button onClick={handlePickTemplate} className="btn-primary text-xs px-3 py-1.5">
              Add Selected Workflow
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-2.5">
          {WORKFLOW_TEMPLATES.map((tmpl, i) => (
            <div
              key={tmpl.name}
              onClick={() => setPickedTemplate(i)}
              className={`flex items-center gap-2.5 p-3 border-[1.5px] rounded-lg cursor-pointer
                          transition-all duration-150
                          ${pickedTemplate === i
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-slate-200 hover:border-indigo-300'}`}
            >
              <span className="text-xl flex-shrink-0">📋</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{tmpl.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{tmpl.category}</p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                               flex-shrink-0 text-white text-[10px] transition-all duration-150
                               ${pickedTemplate === i
                                 ? 'bg-indigo-600 border-indigo-600'
                                 : 'border-slate-300'}`}>
                {pickedTemplate === i && '✓'}
              </div>
            </div>
          ))}
        </div>
      </Modal>

    </div>
  );
};

export default WorkflowsPage;
