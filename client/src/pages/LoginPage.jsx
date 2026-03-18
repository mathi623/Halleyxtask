/**
 * LoginPage
 * ─────────────────────────────────────────────────────────────────
 * Two-column layout:
 *   Left  — branded hero panel with feature list
 *   Right — sign-in form with Admin / Employee tab switcher
 *
 * On successful login, redirects to the dashboard.
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useState } from 'react';
import { useNavigate }      from 'react-router-dom';
import { useAuth }          from '../context/AuthContext';

const LoginPage = () => {
  const { login }   = useAuth();
  const navigate    = useNavigate();

  // Form state
  const [role,       setRole]       = useState('admin');
  const [email,      setEmail]      = useState('admin@company.com');
  const [password,   setPassword]   = useState('admin123');
  const [name,       setName]       = useState('');
  const [department, setDepartment] = useState('Finance');
  const [error,      setError]      = useState('');
  const [loading,    setLoading]    = useState(false);

  /** Switches between Admin and Employee tabs and pre-fills demo credentials */
  const switchRole = (selectedRole) => {
    setRole(selectedRole);
    setError('');
    if (selectedRole === 'admin') {
      setEmail('admin@company.com');
      setPassword('admin123');
    } else {
      setEmail('employee@company.com');
      setPassword('emp123');
    }
  };

  /** Submits credentials to the API via the AuthContext login function */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* ── Left: Hero branding panel ── */}
      <div className="flex-1 bg-gradient-to-br from-indigo-600 to-violet-500
                      flex flex-col justify-center items-start p-16 relative overflow-hidden">

        {/* Subtle dot-grid overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='2' fill='white'/%3E%3C/svg%3E")`}} />

        <div className="relative z-10">
          {/* Brand icon */}
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl
                          flex items-center justify-center mb-6">
            <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>

          <h1 className="font-serif text-4xl font-semibold text-white leading-tight mb-3">
            Workflow Management<br />Platform
          </h1>
          <p className="text-white/70 text-base leading-relaxed max-w-sm">
            Automate, monitor, and manage your HR processes with intelligent
            workflows and real-time analytics.
          </p>

          {/* Feature bullets */}
          <ul className="mt-10 space-y-3.5">
            {[
              'Role-based access — Admin & Employee views',
              'Choose from existing workflows or create your own',
              'Customise rules to match your requirements',
              'Full audit trail & real-time analytics',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-white/85 text-sm">
                <span className="w-2 h-2 rounded-full bg-white/50 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Right: Sign-in form ── */}
      <div className="w-[480px] flex items-center justify-center p-10">
        <div className="w-full max-w-sm">

          <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-slate-500 mb-7">
            Sign in to access your workflow dashboard
          </p>

          {/* Admin / Employee tab switcher */}
          <div className="flex bg-slate-100 rounded-md p-1 mb-6">
            {['admin', 'employee'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => switchRole(r)}
                className={`flex-1 py-2 rounded text-sm font-semibold capitalize transition-all duration-150
                            ${role === r
                              ? 'bg-white text-indigo-600 shadow-sm'
                              : 'text-slate-500 hover:text-slate-700'}`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600
                            text-xs px-4 py-2.5 rounded-md mb-4">
              {error}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleLogin} className="space-y-4">

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide
                                text-slate-600 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide
                                text-slate-600 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="form-input"
              />
            </div>

            {/* Employee-only fields */}
            {role === 'employee' && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide
                                    text-slate-600 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide
                                    text-slate-600 mb-1.5">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="form-input"
                  >
                    {['Finance','Human Resources','IT & DevOps','Operations','Sales','Legal & Compliance']
                      .map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white text-sm font-bold
                         rounded-md transition-all duration-150 mt-1
                         hover:bg-indigo-700 hover:shadow-card-md disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>

          </form>

          {/* Demo credentials hint */}
          <p className="text-center text-xs text-slate-400 mt-5 leading-relaxed">
            <strong>Admin demo:</strong> admin@company.com / admin123<br />
            <strong>Employee demo:</strong> employee@company.com / emp123
          </p>

        </div>
      </div>

    </div>
  );
};

export default LoginPage;
