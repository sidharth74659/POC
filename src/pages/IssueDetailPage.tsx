import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Save, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ResponsiveContainer } from '@/components/layout/responsive-container';
import { ScrollAnimation, animationVariants } from '@/components/ui/animations';
import { EnhancedButton } from '@/components/ui/interactive-elements';
import { useToast } from '../contexts/ToastContext';
import type { SubTask } from '../types';
import { mockData } from '../mockData';

function IssueDetailPage() {
  const { projectId, tileId, issueId } = useParams<{ 
    projectId: string; 
    tileId: string; 
    issueId: string; 
  }>();
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [newSubtaskDescription, setNewSubtaskDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const issue = state.issues.find((i) => i.id === issueId);
  const tile = issue ? state.tiles.find((t) => t.id === issue.tileId) : null;
  const project = state.projects.find((p) => p.id === projectId);
  const subtasks = state.subtasks.filter((s) => s.issueId === issueId);

  if (!issue || !tile || !project) {
    return (
      <ResponsiveContainer variant="mobile-padded">
        <ScrollAnimation>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Issue not found</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </div>
        </ScrollAnimation>
      </ResponsiveContainer>
    );
  }

  const handleStatusChange = (newStatus: typeof issue.status) => {
    dispatch({
      type: 'UPDATE_ISSUE',
      payload: { ...issue, status: newStatus },
    });
    success('Status Updated', `Issue status changed to ${newStatus}`);
  };

  const handleSubtaskToggle = (subtaskId: string) => {
    const subtask = subtasks.find((s) => s.id === subtaskId);
    if (subtask) {
      dispatch({
        type: 'UPDATE_SUBTASK',
        payload: {
          ...subtask,
          status: subtask.status === 'Open' ? 'Closed' : 'Open',
        },
      });
      success('Subtask Updated', 'Subtask status changed successfully');
    }
  };

  const handleAddSubtask = () => {
    if (!newSubtaskDescription.trim()) return;

    const newSubtask: SubTask = {
      id: mockData.generateId(),
      issueId: issue.id,
      description: newSubtaskDescription,
      status: 'Open',
    };

    dispatch({ type: 'ADD_SUBTASK', payload: newSubtask });
    setNewSubtaskDescription('');
    success('Subtask Added', 'New subtask created successfully');
  };

  const handleMergeToMain = () => {
    if (issue.status === 'Closed') {
      const cleanedContent = issue.forkedDocumentContent.replace(
        /(\+\+|--|~~)(.*?)(\+\+|--|~~)/g,
        '$2'
      );
      
      dispatch({
        type: 'UPDATE_TILE',
        payload: {
          ...tile,
          mainDocumentContent: cleanedContent,
        },
      });
      success('Merged to Main', 'Changes have been merged to the canonical document');
    }
  };

  const handleBackNavigation = () => {
    navigate(`/projects/${projectId}`);
  };

  // Enhanced diff highlighting component
  const DiffHighlighter = ({ content }: { content: string }) => (
    <ReactMarkdown
      className="prose prose-sm max-w-none dark:prose-invert"
      components={{
        p: ({ children }) => {
          const text = children?.toString() || '';
          return (
            <p>
              {text.split(/(\+\+.*?\+\+|--.*?--|~~.*?~~)/g).map((part, index) => {
                if (part.startsWith('++') && part.endsWith('++')) {
                  return (
                    <span
                      key={index}
                      className="bg-green-100 dark:bg-green-900/30 px-1 rounded text-green-800 dark:text-green-200"
                      title="Added content"
                    >
                      {part.slice(2, -2)}
                    </span>
                  );
                }
                if (part.startsWith('--') && part.endsWith('--')) {
                  return (
                    <span
                      key={index}
                      className="bg-red-100 line-through dark:bg-red-900/30 px-1 rounded text-red-800 dark:text-red-200"
                      title="Removed content"
                    >
                      {part.slice(2, -2)}
                    </span>
                  );
                }
                if (part.startsWith('~~') && part.endsWith('~~')) {
                  return (
                    <span
                      key={index}
                      className="bg-orange-100 dark:bg-orange-900/30 px-1 rounded text-orange-800 dark:text-orange-200"
                      title="Modified content"
                    >
                      {part.slice(2, -2)}
                    </span>
                  );
                }
                return part;
              })}
            </p>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );

  return (
    <ResponsiveContainer variant="mobile-padded">
      <motion.div 
        className="space-y-6"
        variants={animationVariants.pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Breadcrumb Navigation */}
        <ScrollAnimation>
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <button 
              onClick={() => navigate('/')}
              className="hover:text-foreground transition-colors"
            >
              Projects
            </button>
            <span>/</span>
            <button 
              onClick={() => navigate(`/projects/${projectId}`)}
              className="hover:text-foreground transition-colors"
            >
              {project.name}
            </button>
            <span>/</span>
            <span className="text-foreground">{issue.issueNumber}</span>
          </nav>
        </ScrollAnimation>

        {/* Back Button for Mobile */}
        <div className="lg:hidden">
          <EnhancedButton
            variant="outline"
            size="sm"
            onClick={handleBackNavigation}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Project
          </EnhancedButton>
        </div>

        {/* Issue Header */}
        <ScrollAnimation>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4" data-testid="issue-header">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-4 flex-wrap">
                <h1 className="text-2xl lg:text-3xl font-bold" data-testid="issue-number">
                  {issue.issueNumber}
                </h1>
                <Badge 
                  variant={issue.status === 'Closed' ? 'default' : 'secondary'}
                  data-testid="status-badge"
                  className="text-xs"
                >
                  {issue.status}
                </Badge>
              </div>
              <h2 className="text-lg lg:text-xl mt-2 break-words">{issue.title}</h2>
            </div>
            <div className="flex flex-col space-y-2 lg:w-48">
              <Select value={issue.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full" data-testid="status-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Development In Progress">Development In Progress</SelectItem>
                  <SelectItem value="Testing In Progress">Testing In Progress</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              {issue.status === 'Closed' && (
                <EnhancedButton
                  className="w-full"
                  onClick={handleMergeToMain}
                  data-testid="merge-button"
                >
                  Merge to Main
                </EnhancedButton>
              )}
            </div>
          </div>
        </ScrollAnimation>

        {/* Issue Metadata */}
        <ScrollAnimation>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Issue Details
                <EnhancedButton
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </EnhancedButton>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Assignee</Label>
                  <div className="text-sm">{issue.assignee}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Priority</Label>
                  <Badge variant={
                    issue.priority === 'High' ? 'destructive' : 
                    issue.priority === 'Medium' ? 'default' : 
                    'secondary'
                  }>
                    {issue.priority}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Reporter</Label>
                  <div className="text-sm">{issue.reporter || 'Unknown'}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Created</Label>
                  <div className="text-sm">
                    {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
                {issue.estimation && (
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Estimation</Label>
                    <div className="text-sm">{issue.estimation}</div>
                  </div>
                )}
                {issue.tags && issue.tags.length > 0 && (
                  <div className="space-y-1 lg:col-span-2">
                    <Label className="text-sm font-medium">Tags</Label>
                    <div className="flex gap-2 flex-wrap">
                      {issue.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </ScrollAnimation>

        {/* Forked Document */}
        <ScrollAnimation>
          <Card data-testid="forked-content">
            <CardHeader>
              <CardTitle>Forked Document</CardTitle>
              <p className="text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-100 dark:bg-green-900/30 rounded"></span>
                  Added
                </span>
                <span className="inline-flex items-center gap-2 ml-4">
                  <span className="w-3 h-3 bg-red-100 dark:bg-red-900/30 rounded"></span>
                  Removed
                </span>
                <span className="inline-flex items-center gap-2 ml-4">
                  <span className="w-3 h-3 bg-orange-100 dark:bg-orange-900/30 rounded"></span>
                  Modified
                </span>
              </p>
            </CardHeader>
            <CardContent>
              <DiffHighlighter content={issue.forkedDocumentContent} />
            </CardContent>
          </Card>
        </ScrollAnimation>

        {/* Subtasks */}
        <ScrollAnimation>
          <Card>
            <CardHeader>
              <CardTitle>
                Subtasks ({subtasks.filter(s => s.status === 'Closed').length}/{subtasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Existing Subtasks */}
                <div className="space-y-2">
                  {subtasks.map((subtask, index) => (
                    <motion.div
                      key={subtask.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        checked={subtask.status === 'Closed'}
                        onCheckedChange={() => handleSubtaskToggle(subtask.id)}
                        data-testid="subtask-checkbox"
                      />
                      <span
                        className={`flex-1 ${
                          subtask.status === 'Closed' ? 'line-through opacity-50' : ''
                        }`}
                      >
                        {subtask.description}
                      </span>
                    </motion.div>
                  ))}
                  {subtasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No subtasks yet. Add one below to break down this issue.</p>
                    </div>
                  )}
                </div>

                {/* Add New Subtask */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Input
                    value={newSubtaskDescription}
                    onChange={(e) => setNewSubtaskDescription(e.target.value)}
                    placeholder="Add a new subtask..."
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddSubtask();
                      }
                    }}
                  />
                  <EnhancedButton 
                    onClick={handleAddSubtask} 
                    disabled={!newSubtaskDescription.trim()}
                    className="sm:w-auto w-full"
                  >
                    Add Subtask
                  </EnhancedButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollAnimation>
      </motion.div>
    </ResponsiveContainer>
  );
}

export default IssueDetailPage; 