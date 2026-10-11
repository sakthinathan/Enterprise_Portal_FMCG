import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TenantProvider } from './context/TenantContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import HeaderNav from './components/HeaderNav';
import Login from './pages/Login';
import HubDashboard from './pages/HubDashboard';
import FleetManagement from './pages/FleetManagement';
import StockView from './pages/StockView';
import PayrollView from './pages/PayrollView';
import DispatchView from './pages/DispatchView';

function ProtectedLayout({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HeaderNav />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <footer style={{
        padding: '20px 32px',
        borderTop: '1px solid var(--border-subtle)',
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--text-dim)',
        marginTop: 'auto'
      }}>
        FMCG Enterprise Operations Business Suite · Multi-Tenant Portal Edition · Built for Distributors, Super-Stockists & C&F Agencies
      </footer>
    </div>
  );
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <HashRouter>
      <TenantProvider>
        <AuthProvider>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedLayout>
                  <HubDashboard />
                </ProtectedLayout>
              }
            />
            <Route
              path="/fleet"
              element={
                <ProtectedLayout>
                  <FleetManagement />
                </ProtectedLayout>
              }
            />
            <Route
              path="/stock"
              element={
                <ProtectedLayout>
                  <StockView />
                </ProtectedLayout>
              }
            />
            <Route
              path="/payroll"
              element={
                <ProtectedLayout>
                  <PayrollView />
                </ProtectedLayout>
              }
            />
            <Route
              path="/dispatch"
              element={
                <ProtectedLayout>
                  <DispatchView />
                </ProtectedLayout>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </TenantProvider>
    </HashRouter>
  );
}
