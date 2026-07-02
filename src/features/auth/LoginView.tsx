import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Cpu, AlertCircle } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await login();
    } catch (err: any) {
      setError(err?.message || "Google sign-in encountered an error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Decorative premium glow background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md glass-panel rounded-2xl p-8 relative z-10 shadow-2xl border-slate-800">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-tr from-blue-600 to-purple-600 p-4 rounded-2xl shadow-lg shadow-blue-500/20 mb-4 animate-pulse">
            <Cpu className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Antigravity Embedded
          </h1>
          <p className="text-slate-400 text-sm mt-2 text-center">
            AI-powered collaborative embedded systems engineering platform
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-start gap-2 mb-6 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700/80 rounded-xl flex items-center justify-center gap-3 text-slate-100 font-medium transition-all shadow-lg hover:shadow-blue-500/5 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 group-hover:scale-105 transition-transform" viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.437-2.882-6.437-6.437s2.882-6.437 6.437-6.437c1.558 0 2.978.558 4.093 1.487l3.078-3.078C19.324 1.39 15.962 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.398 0 11.666-4.593 11.666-11.666 0-.825-.09-1.616-.25-2.529h-11.416z"
            />
          </svg>
          {loading ? 'Connecting...' : 'Sign in with Google'}
        </button>

        <div className="mt-8 text-center text-xs text-slate-500 border-t border-slate-800/80 pt-6">
          Authorized engineering sandbox environment. Verified connection secures GPIO & firmware pipelines.
        </div>
      </div>
    </div>
  );
};
export default LoginView;
