import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ProjectsListPage from './pages/ProjectsListPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import IssueDetailPage from './pages/IssueDetailPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <a href="/" className="flex items-center space-x-2">
                <span className="font-bold">DocuTrack</span>
              </a>
            </div>
          </header>
          <main className="container py-6">
            <Routes>
              <Route path="/" element={<ProjectsListPage />} />
              <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
              <Route
                path="/projects/:projectId/tiles/:tileId/issues/:issueId"
                element={<IssueDetailPage />}
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
