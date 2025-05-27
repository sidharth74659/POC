import React, { memo, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Grid, List } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ProjectCardSkeleton } from '@/components/ui/loading-spinner';
import { ResponsiveContainer, ResponsiveGrid } from '@/components/layout/responsive-container';
import { VirtualList } from '@/components/ui/virtual-list';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useDebounce } from '../hooks/useDebounce';
import { 
  AnimatedCard, 
  ScrollAnimation, 
  animationVariants,
  AnimatedCounter
} from '@/components/ui/animations';
import { EnhancedButton, AnimatedToggle, FloatingActionMenu } from '@/components/ui/interactive-elements';
import { useToast } from '../contexts/ToastContext';
import type { IProject } from '../interfaces';

// Memoized project card component with enhanced animations
const ProjectCard = memo(({ 
  project, 
  onClick,
  viewMode 
}: { 
  project: IProject; 
  onClick: (id: string) => void;
  viewMode: 'grid' | 'list';
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
      <div ref={ref} className={viewMode === 'grid' ? 'h-48' : 'h-24'}>
        <ProjectCardSkeleton />
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <motion.div
        ref={ref}
        variants={animationVariants.staggerItem}
        whileHover={{ x: 4 }}
        className="w-full"
      >
        <AnimatedCard
          className="cursor-pointer hover:shadow-md transition-all duration-200 touch-manipulation"
          hoverScale={1.01}
        >
          <Card onClick={handleClick} data-testid="project-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{project.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                    {project.purpose}
                  </p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Badge variant="secondary" className="text-xs">
                    <AnimatedCounter value={project.tileCount} duration={0.5} />
                    <span className="ml-1">Tiles</span>
                  </Badge>
                  {project.status && (
                    <Badge 
                      variant={project.status === 'active' ? 'default' : 'outline'}
                      className="capitalize text-xs"
                    >
                      {project.status}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      variants={animationVariants.staggerItem}
      className="h-full"
    >
      <AnimatedCard
        className="cursor-pointer hover:shadow-lg transition-all duration-200 h-full touch-manipulation"
        hoverScale={1.02}
      >
        <Card
          data-testid="project-card"
          className="h-full"
          onClick={handleClick}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl line-clamp-2 leading-tight">
              {project.name}
            </CardTitle>
            <CardDescription className="line-clamp-3 text-sm">
              {project.purpose}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between mb-3">
              <Badge 
                variant="secondary"
                className="transition-colors duration-200 text-xs"
              >
                <AnimatedCounter value={project.tileCount} duration={0.5} />
                <span className="ml-1">Tiles</span>
              </Badge>
              {project.status && (
                <Badge 
                  variant={project.status === 'active' ? 'default' : 'outline'}
                  className="capitalize text-xs"
                >
                  {project.status}
                </Badge>
              )}
            </div>
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {project.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </AnimatedCard>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

// Virtual list item renderer for large datasets
const VirtualProjectItem = memo(({ 
  index, 
  style,
  data 
}: { 
  index: number; 
  style: React.CSSProperties;
  data: IProject;
}) => {
  const navigate = useNavigate();
  const handleClick = useCallback((projectId: string) => {
    navigate(`/projects/${projectId}`);
  }, [navigate]);

  return (
    <div style={style} className="p-2">
      <ProjectCard 
        project={data} 
        onClick={handleClick}
        viewMode="list"
      />
    </div>
  );
});

VirtualProjectItem.displayName = 'VirtualProjectItem';

function ProjectsListPage() {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const { success, info } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [useVirtualScrolling, setUseVirtualScrolling] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoize navigation handler to prevent unnecessary re-renders
  const handleProjectClick = useCallback((projectId: string) => {
    navigate(`/projects/${projectId}`);
  }, [navigate]);

  // Memoize filtered and sorted projects
  const filteredProjects = useMemo(() => {
    let filtered = [...state.projects];
    
    // Apply search filter
    if (debouncedSearchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        project.purpose.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        project.tags?.some(tag => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      );
    }
    
    // Sort by status (active first), then by name
    return filtered.sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      return a.name.localeCompare(b.name);
    });
  }, [state.projects, debouncedSearchTerm]);

  // Enable virtual scrolling for large datasets (>50 items)
  const shouldUseVirtualScrolling = useMemo(() => {
    return useVirtualScrolling || filteredProjects.length > 50;
  }, [filteredProjects.length, useVirtualScrolling]);

  const handleCreateProject = useCallback(() => {
    info('Create Project', 'Project creation feature coming soon!');
  }, [info]);

  const handleExportData = useCallback(() => {
    success('Export Started', 'Your data export has been initiated.');
  }, [success]);

  const handleImportData = useCallback(() => {
    info('Import Data', 'Data import feature coming soon!');
  }, [info]);

  const floatingActions = [
    {
      icon: Plus,
      label: 'Create Project',
      onClick: handleCreateProject
    },
    {
      icon: Search,
      label: 'Advanced Search',
      onClick: () => setShowFilters(!showFilters)
    }
  ];

  return (
    <ResponsiveContainer variant="mobile-padded">
      <motion.div 
        className="space-y-4 sm:space-y-6"
        variants={animationVariants.pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Header Section */}
        <ScrollAnimation>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Projects</h1>
              <p className="text-muted-foreground mt-1">
                Manage your documentation projects
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                <AnimatedCounter value={filteredProjects.length} duration={0.8} />
                <span className="ml-1">
                  {filteredProjects.length === 1 ? 'Project' : 'Projects'}
                </span>
              </Badge>
            </div>
          </div>
        </ScrollAnimation>

        {/* Search and Filters */}
        <ScrollAnimation>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <EnhancedButton
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2"
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                </EnhancedButton>
                <div className="flex items-center space-x-1 border rounded-md p-1">
                  <EnhancedButton
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="p-2"
                  >
                    <Grid className="h-4 w-4" />
                  </EnhancedButton>
                  <EnhancedButton
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="p-2"
                  >
                    <List className="h-4 w-4" />
                  </EnhancedButton>
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            <motion.div
              initial={false}
              animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Card className="p-4">
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Filter Options</h3>
                  <div className="flex flex-wrap gap-4">
                    <AnimatedToggle
                      checked={false}
                      onToggle={() => {}}
                      label="Active Projects Only"
                    />
                    <AnimatedToggle
                      checked={false}
                      onToggle={() => {}}
                      label="Recently Updated"
                    />
                    <AnimatedToggle
                      checked={useVirtualScrolling}
                      onToggle={setUseVirtualScrolling}
                      label="Virtual Scrolling"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </ScrollAnimation>
        
        {/* Projects Grid/List */}
        <ScrollAnimation>
          <motion.div 
            variants={animationVariants.staggerContainer}
            initial="initial"
            animate="animate"
          >
            {shouldUseVirtualScrolling ? (
              // Virtual scrolling for large datasets
              <div className="h-[600px] border rounded-lg">
                <VirtualList
                  items={filteredProjects}
                  height={600}
                  itemHeight={viewMode === 'grid' ? 200 : 100}
                  renderItem={VirtualProjectItem}
                  className="p-2"
                />
              </div>
            ) : viewMode === 'grid' ? (
              <ResponsiveGrid 
                cols={{ mobile: 1, tablet: 2, desktop: 3 }}
                className="gap-3 sm:gap-4"
              >
                {filteredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id}
                    project={project} 
                    onClick={handleProjectClick}
                    viewMode={viewMode}
                  />
                ))}
              </ResponsiveGrid>
            ) : (
              <div className="space-y-3">
                {filteredProjects.map((project) => (
                  <ProjectCard 
                    key={project.id}
                    project={project} 
                    onClick={handleProjectClick}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </ScrollAnimation>

        {/* Performance Info */}
        {shouldUseVirtualScrolling && (
          <ScrollAnimation>
            <Card className="p-3 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                🚀 Virtual scrolling enabled for optimal performance with {filteredProjects.length} projects
              </p>
            </Card>
          </ScrollAnimation>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <ScrollAnimation>
            <motion.div 
              className="text-center py-12"
              variants={animationVariants.scaleIn}
            >
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-medium">
                    {searchTerm ? 'No projects found' : 'No projects yet'}
                  </p>
                  <p className="text-muted-foreground">
                    {searchTerm 
                      ? `No projects match "${searchTerm}". Try adjusting your search.`
                      : 'Create your first project to get started.'
                    }
                  </p>
                </div>
                {!searchTerm && (
                  <EnhancedButton onClick={handleCreateProject}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </EnhancedButton>
                )}
              </div>
            </motion.div>
          </ScrollAnimation>
        )}

        {/* Floating Action Menu */}
        <FloatingActionMenu
          mainIcon={Plus}
          actions={floatingActions}
          position="bottom-right"
        />
      </motion.div>
    </ResponsiveContainer>
  );
}

export default memo(ProjectsListPage); 