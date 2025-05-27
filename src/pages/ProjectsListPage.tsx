import React, { memo, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectCardSkeleton } from '@/components/ui/loading-spinner';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import type { IProject } from '../interfaces';

// Memoized project card component
const ProjectCard = memo(({ 
  project, 
  onClick 
}: { 
  project: IProject; 
  onClick: (id: string) => void; 
}) => {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const handleClick = useCallback(() => {
    onClick(project.id);
  }, [onClick, project.id]);

  if (!isIntersecting) {
    return (
      <div ref={ref} className="h-48">
        <ProjectCardSkeleton />
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        data-testid="project-card"
        className="cursor-pointer hover:shadow-lg transition-all duration-200 h-full"
        onClick={handleClick}
      >
        <CardHeader>
          <CardTitle className="text-xl line-clamp-2">{project.name}</CardTitle>
          <CardDescription className="line-clamp-3">{project.purpose}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Badge 
              variant="secondary"
              className="transition-colors duration-200"
            >
              {project.tileCount} Tiles
            </Badge>
            {project.status && (
              <Badge 
                variant={project.status === 'active' ? 'default' : 'outline'}
                className="capitalize"
              >
                {project.status}
              </Badge>
            )}
          </div>
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {project.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{project.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

function ProjectsListPage() {
  const { state } = useAppContext();
  const navigate = useNavigate();

  // Memoize navigation handler to prevent unnecessary re-renders
  const handleProjectClick = useCallback((projectId: string) => {
    navigate(`/projects/${projectId}`);
  }, [navigate]);

  // Memoize sorted projects to prevent unnecessary sorting
  const sortedProjects = useMemo(() => {
    return [...state.projects].sort((a, b) => {
      // Sort by status (active first), then by name
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      return a.name.localeCompare(b.name);
    });
  }, [state.projects]);

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Badge variant="outline" className="text-sm">
          {state.projects.length} Total
        </Badge>
      </div>
      
      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {sortedProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <ProjectCard 
              project={project} 
              onClick={handleProjectClick}
            />
          </motion.div>
        ))}
      </motion.div>

      {state.projects.length === 0 && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-muted-foreground">No projects found</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default memo(ProjectsListPage); 