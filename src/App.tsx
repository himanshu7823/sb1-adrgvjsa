import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Register } from './components/Register';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Wallet } from './components/Wallet';
import { Referrals } from './components/Referrals';
import { Profile } from './components/Profile';
import { Admin } from './components/Admin';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuth } from './hooks/useAuth';

function App() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { currentUser, loading } = useAuth();

  // Auto-refresh user data periodically
  useEffect(() => {
    if (currentUser) {
      const interval = setInterval(() => {
        // This will trigger a re-render to show updated data
        window.dispatchEvent(new Event('userDataUpdate'));
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <ErrorBoundary>
        {authMode === 'login' ? (
          <Login onSwitchToRegister={() => setAuthMode('register')} />
        ) : (
          <Register onSwitchToLogin={() => setAuthMode('login')} />
        )}
      </ErrorBoundary>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'wallet':
        return <Wallet />;
      case 'referrals':
        return <Referrals />;
      case 'profile':
        return <Profile />;
      case 'admin':
        return currentUser.phone === 'admin' ? <Admin /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ErrorBoundary>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </Layout>
    </ErrorBoundary>
  );
}

export default App;