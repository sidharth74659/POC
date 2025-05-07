import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function ProjectsListPage() {
  const { state } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Projects</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {state.projects.map((project) => (
          <div
            key={project.id}
            className="rounded-lg border bg-card text-card-foreground shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-semibold">{project.name}</h3>
              <p className="text-sm text-muted-foreground">{project.purpose}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>{project.tileCount} Tiles</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectsListPage; 