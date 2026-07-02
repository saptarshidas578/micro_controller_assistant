import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { LoginView } from './features/auth/LoginView';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { DashboardView } from './features/dashboard/DashboardView';
import { RegistryView } from './features/registry/RegistryView';
import { BuilderView } from './features/builder/BuilderView';
import { ProjectsView } from './features/projects/ProjectsView';
import { KnowledgeView } from './features/knowledge/KnowledgeView';
import { CommunityView } from './features/community/CommunityView';
import { SearchView } from './features/search/SearchView';
import { SettingsView } from './features/settings/SettingsView';
import { AdminView } from './features/admin/AdminView';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { Cpu } from 'lucide-react';

// --- Loading Screen Component ---
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
    <div className="relative flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      <Cpu className="w-5 h-5 text-blue-400 absolute animate-pulse" />
    </div>
    <span className="text-xs text-slate-500 font-mono tracking-wider">
      INITIALIZING SANDBOX ENVIRONMENT...
    </span>
  </div>
);

// --- Protected Route Helper ---
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// --- Admin Route Helper ---
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// --- Application Layout Container ---
const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<DashboardView />} />
              <Route path="/registry" element={<RegistryView />} />
              <Route path="/builder" element={<BuilderView />} />
              <Route path="/projects" element={<ProjectsView />} />
              <Route path="/knowledge" element={<KnowledgeView />} />
              <Route path="/community" element={<CommunityView />} />
              <Route path="/search" element={<SearchView />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="/admin" element={<AdminRoute><AdminView /></AdminRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

// --- Login Route Helper ---
const LoginRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <LoginView />;
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginRoute />} />
            <Route path="*" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};
export default App;
