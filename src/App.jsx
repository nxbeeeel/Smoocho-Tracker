/**
 * Main App Component
 */
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SalesPage from './pages/SalesPage';
import ExpensePage from './pages/ExpensePage';
import DashboardPage from './pages/DashboardPage';
import EntriesPage from './pages/EntriesPage';
import SetupPage from './pages/SetupPage';
import { isReady, initialize, preloadMonthData } from './services/appsScriptService';
import { getAppsScriptUrl } from './utils/storage';
import ErrorBoundary from './components/ErrorBoundary';
import StaffNameModal from './components/StaffNameModal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function App() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = () => {
    const url = getAppsScriptUrl();
    if (url) {
      initialize(url);
      setReady(true);
      // Preload current month data in background
      preloadMonthData().catch(() => {});
    }
    setLoading(false);
  };

  const handleSetupComplete = () => {
    setReady(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

      return (
        <ErrorBoundary>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <div className="min-h-screen bg-background">
          <StaffNameModal />
              <NavBar ready={ready} />
              <main className="page-shell py-4 sm:py-8">
                <Routes>
                  <Route path="/" element={<SalesPage />} />
                  <Route path="/expense" element={<ExpensePage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/entries" element={<EntriesPage />} />
                  <Route path="/setup" element={<SetupPage onComplete={handleSetupComplete} />} />
                </Routes>
              </main>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

const NavBar = ({ ready }) => {
  const location = useLocation();
  
  return (
    <nav className="border-b bg-card">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="text-lg sm:text-2xl font-bold truncate">
            🍓 Smoocho
          </Link>
              <div className="flex gap-1 sm:gap-2 flex-wrap">
                <NavLink to="/" current={location.pathname}>Sales</NavLink>
                <NavLink to="/expense" current={location.pathname}>Expenses</NavLink>
                <NavLink to="/entries" current={location.pathname}>Entries</NavLink>
                <NavLink to="/dashboard" current={location.pathname}>Dashboard</NavLink>
                {!ready && <NavLink to="/setup" current={location.pathname}>Setup</NavLink>}
              </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, current, children }) => (
  <Button
    asChild
    variant={current === to ? 'default' : 'ghost'}
  >
    <Link to={to}>{children}</Link>
  </Button>
);

export default App;
