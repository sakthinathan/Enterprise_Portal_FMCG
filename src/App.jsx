import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { TenantProvider } from './context/TenantContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import HeaderNav from './components/HeaderNav';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import HubDashboard from './pages/HubDashboard';
import FleetManagement from './pages/FleetManagement';
import StockView from './pages/StockView';
import PayrollView from './pages/PayrollView';
import DispatchView from './pages/DispatchView';
import GodownStockAudit from './pages/GodownStockAudit';

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

function AdminOnlyRoute({ children }) {
  const { isAuditor } = useAuth();
  if (isAuditor) {
    return <Navigate to="/stock-audit" replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, isAuditor } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={isAuditor ? "/stock-audit" : "/"} replace />;
  }
  return children;
}

function RootRoute() {
  const { isAuthenticated, isAuditor } = useAuth();
  if (!isAuthenticated) {
    return <LandingPage />;
  }
  if (isAuditor) {
    return <Navigate to="/stock-audit" replace />;
  }
  return (
    <ProtectedLayout>
      <AdminOnlyRoute>
        <HubDashboard />
      </AdminOnlyRoute>
    </ProtectedLayout>
  );
}

export default function App() {
  return (
    <HashRouter>
      <TenantProvider>
        <AuthProvider>
          <Routes>
            <Route path="/landing" element={<LandingPage />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route path="/" element={<RootRoute />} />
            <Route
              path="/fleet"
              element={
                <ProtectedLayout>
                  <AdminOnlyRoute>
                    <FleetManagement />
                  </AdminOnlyRoute>
                </ProtectedLayout>
              }
            />
            <Route
              path="/stock"
              element={
                <ProtectedLayout>
                  <AdminOnlyRoute>
                    <StockView />
                  </AdminOnlyRoute>
                </ProtectedLayout>
              }
            />
            <Route
              path="/stock-audit"
              element={
                <ProtectedLayout>
                  <GodownStockAudit />
                </ProtectedLayout>
              }
            />
            <Route
              path="/payroll"
              element={
                <ProtectedLayout>
                  <AdminOnlyRoute>
                    <PayrollView />
                  </AdminOnlyRoute>
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
