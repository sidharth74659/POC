import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './themes/ThemeProvider';
import { ToastProvider } from './contexts/ToastContext';
import { ErrorBoundary } from './components/ui/error-boundary';
import { MobileNav } from './components/layout/mobile-nav';
import { LoadingSpinner } from './components/ui/animations';

// Lazy load route components
const ProjectsListPage = lazy(() => import('./pages/ProjectsListPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const IssueDetailPage = lazy(() => import('./pages/IssueDetailPage'));

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="doctrack-theme">
        <ToastProvider>
          <AppProvider>
            <Router>
              <div className="min-h-screen bg-background">
                <MobileNav />
                <main className="lg:container lg:py-6">
                  <ErrorBoundary>
                    <Suspense fallback={
                      <div className="flex items-center justify-center min-h-[50vh]">
                        <LoadingSpinner text="Loading..." />
                      </div>
                    }>
                      <Routes>
                        <Route path="/" element={<ProjectsListPage />} />
                        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
                        <Route
                          path="/projects/:projectId/tiles/:tileId/issues/:issueId"
                          element={<IssueDetailPage />}
                        />
                      </Routes>
                    </Suspense>
                  </ErrorBoundary>
                </main>
              </div>
            </Router>
          </AppProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
