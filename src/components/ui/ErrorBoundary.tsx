import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught runtime error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
          <div className="w-full max-w-lg glass-panel rounded-2xl p-8 text-center shadow-2xl border-slate-800">
            <div className="bg-red-500/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">Application Sandbox Mismatch</h2>
            <p className="text-slate-400 text-sm mt-3">
              A runtime logic exception crashed the layout. This could be due to missing database records or connection failures.
            </p>
            {this.state.error && (
              <pre className="mt-4 p-3 bg-slate-950/80 rounded-lg text-left text-xs text-red-300 overflow-x-auto border border-slate-850 font-mono">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReload}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700/80 rounded-xl text-sm font-medium text-slate-200 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Sandbox</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
