import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './themes/ThemeProvider';
import { MobileNav } from './components/ui/mobile-nav';
import { LoadingSpinner } from './components/ui/loading-spinner';

// Lazy load route components
const ProjectsListPage = lazy(() => import('./pages/ProjectsListPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const IssueDetailPage = lazy(() => import('./pages/IssueDetailPage'));

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="doctrack-theme">
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <MobileNav />
            <main className="lg:container lg:py-6">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<ProjectsListPage />} />
                  <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
                  <Route
                    path="/projects/:projectId/tiles/:tileId/issues/:issueId"
                    element={<IssueDetailPage />}
                  />
                </Routes>
              </Suspense>
            </main>
          </div>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
