import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { SubTask } from '../types';
import { mockData } from '../mockData';

function IssueDetailPage() {
  const { issueId } = useParams<{ issueId: string }>();
  const { state, dispatch } = useAppContext();
  const [newSubtaskDescription, setNewSubtaskDescription] = useState('');

  const issue = state.issues.find((i) => i.id === issueId);
  const tile = issue ? state.tiles.find((t) => t.id === issue.tileId) : null;
  const subtasks = state.subtasks.filter((s) => s.issueId === issueId);

  if (!issue || !tile) {
    return <div>Issue not found</div>;
  }

  const handleStatusChange = (newStatus: typeof issue.status) => {
    dispatch({
      type: 'UPDATE_ISSUE',
      payload: { ...issue, status: newStatus },
    });
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
  };

  const handleMergeToMain = () => {
    if (issue.status === 'Closed') {
      dispatch({
        type: 'UPDATE_TILE',
        payload: {
          ...tile,
          mainDocumentContent: issue.forkedDocumentContent.replace(
            /(\+\+|--)(.*?)(\+\+|--)/g,
            '$2'
          ),
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Issue Header */}
      <div className="flex justify-between items-start" data-testid="issue-header">
        <div>
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold" data-testid="issue-number">{issue.issueNumber}</h1>
            <Badge 
              variant={issue.status === 'Closed' ? 'default' : 'secondary'}
              data-testid="status-badge"
            >
              {issue.status}
            </Badge>
          </div>
          <h2 className="text-xl mt-2">{issue.title}</h2>
        </div>
        <div className="space-y-2">
          <Select value={issue.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[200px]" data-testid="status-select">
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
            <Button
              className="w-full"
              onClick={handleMergeToMain}
              data-testid="merge-button"
            >
              Merge to Main
            </Button>
          )}
        </div>
      </div>

      {/* Issue Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Assignee</Label>
              <div className="text-sm">{issue.assignee}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-medium">Priority</Label>
              <Badge variant={issue.priority === 'High' ? 'destructive' : issue.priority === 'Medium' ? 'default' : 'secondary'}>
                {issue.priority}
              </Badge>
            </div>
            {issue.estimation && (
              <div className="space-y-1">
                <Label className="text-sm font-medium">Estimation</Label>
                <div className="text-sm">{issue.estimation}</div>
              </div>
            )}
            {issue.tags && issue.tags.length > 0 && (
              <div className="space-y-1">
                <Label className="text-sm font-medium">Tags</Label>
                <div className="flex gap-2">
                  {issue.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Forked Document */}
      <Card data-testid="forked-content">
        <CardHeader>
          <CardTitle>Forked Document</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactMarkdown
            className="prose prose-sm max-w-none"
            components={{
              p: ({ children }) => {
                const text = children?.toString() || '';
                return (
                  <p>
                    {text.split(/(\+\+.*?\+\+|--.*?--)/g).map((part, index) => {
                      if (part.startsWith('++') && part.endsWith('++')) {
                        return (
                          <span
                            key={index}
                            className="bg-green-100 dark:bg-green-900/30 px-1 rounded"
                          >
                            {part.slice(2, -2)}
                          </span>
                        );
                      }
                      if (part.startsWith('--') && part.endsWith('--')) {
                        return (
                          <span
                            key={index}
                            className="bg-red-100 line-through dark:bg-red-900/30 px-1 rounded"
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
            {issue.forkedDocumentContent}
          </ReactMarkdown>
        </CardContent>
      </Card>

      {/* Subtasks */}
      <Card>
        <CardHeader>
          <CardTitle>Subtasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Existing Subtasks */}
            <div className="space-y-2">
              {subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center space-x-2 rounded-lg border p-4"
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
                </div>
              ))}
            </div>

            {/* Add New Subtask */}
            <div className="flex space-x-2">
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
              <Button onClick={handleAddSubtask} disabled={!newSubtaskDescription.trim()}>
                Add Subtask
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default IssueDetailPage; 