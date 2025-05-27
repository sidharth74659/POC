import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './themes/ThemeProvider';
import { ThemeToggle } from './components/ui/theme-toggle';
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
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center justify-between">
                <a href="/" className="flex items-center space-x-2">
                  <span className="font-bold">DocuTrack</span>
                </a>
                <ThemeToggle />
              </div>
            </header>
            <main className="container py-6">
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
