import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { mockData } from '../mockData';
import type { Issue } from '../types';

function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false);
  const [newIssue, setNewIssue] = useState({
    title: '',
    assignee: 'Unassigned' as const,
    priority: 'Medium' as const,
    content: '',
  });

  const project = state.projects.find((p) => p.id === projectId);
  const projectTiles = state.tiles.filter((t) => t.projectId === projectId);
  const selectedTile = projectTiles.find((t) => t.id === selectedTileId);
  const tileIssues = selectedTile
    ? state.issues.filter((i) => i.tileId === selectedTile.id)
    : [];

  if (!project) {
    return <div>Project not found</div>;
  }

  const handleCreateIssue = () => {
    if (!selectedTile || !newIssue.title.trim()) return;

    const issue: Issue = {
      id: mockData.generateId(),
      tileId: selectedTile.id,
      issueNumber: `ISSUE-${Math.floor(Math.random() * 1000) + 100}`,
      title: newIssue.title,
      assignee: newIssue.assignee,
      priority: newIssue.priority,
      status: 'Open',
      forkedDocumentContent: newIssue.content || selectedTile.mainDocumentContent,
      tags: [],
      createdAt: new Date(),
    };

    dispatch({ type: 'ADD_ISSUE', payload: issue });
    setIsCreateIssueOpen(false);
    setNewIssue({
      title: '',
      assignee: 'Unassigned',
      priority: 'Medium',
      content: '',
    });
  };

  const openCreateIssueModal = () => {
    if (selectedTile) {
      setNewIssue(prev => ({
        ...prev,
        content: selectedTile.mainDocumentContent
      }));
    }
    setIsCreateIssueOpen(true);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Sidebar - Tile List */}
      <div className="col-span-3 space-y-4">
        <h2 className="text-xl font-semibold">{project.name}</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tiles</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]" data-testid="tile-list">
              <div className="divide-y">
                {projectTiles.map((tile) => (
                  <div
                    key={tile.id}
                    data-testid="tile-item"
                    className={`px-4 py-3 cursor-pointer hover:bg-accent transition-colors ${
                      selectedTileId === tile.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => setSelectedTileId(tile.id)}
                  >
                    <div className="font-medium text-sm">{tile.name}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Right Content - Tile Details */}
      <div className="col-span-9">
        {selectedTile ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedTile.name}</h2>
              <Dialog open={isCreateIssueOpen} onOpenChange={setIsCreateIssueOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="create-issue-btn" onClick={openCreateIssueModal}>
                    Create New Issue
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" data-testid="create-issue-modal">
                  <DialogHeader>
                    <DialogTitle>Create New Issue</DialogTitle>
                    <DialogDescription>
                      Create a new issue by forking the tile document. You can modify the content to reflect your changes.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="issue-title">Title</Label>
                      <Input
                        id="issue-title"
                        data-testid="issue-title"
                        value={newIssue.title}
                        onChange={(e) => setNewIssue(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter issue title"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="issue-assignee">Assignee</Label>
                        <Select value={newIssue.assignee} onValueChange={(value: any) => setNewIssue(prev => ({ ...prev, assignee: value }))}>
                          <SelectTrigger data-testid="issue-assignee">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Unassigned">Unassigned</SelectItem>
                            <SelectItem value="Developer">Developer</SelectItem>
                            <SelectItem value="Tester">Tester</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="issue-priority">Priority</Label>
                        <Select value={newIssue.priority} onValueChange={(value: any) => setNewIssue(prev => ({ ...prev, priority: value }))}>
                          <SelectTrigger data-testid="issue-priority">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issue-content">Document Content</Label>
                      <Textarea
                        id="issue-content"
                        data-testid="issue-content"
                        value={newIssue.content}
                        onChange={(e) => setNewIssue(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Modify the document content (use ++text++ for additions, --text-- for removals)"
                        className="min-h-[200px] font-mono text-sm"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateIssueOpen(false)}>
                      Cancel
                    </Button>
                    <Button data-testid="submit-issue" onClick={handleCreateIssue}>
                      Create Issue
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Document Content */}
            <Card data-testid="tile-content">
              <CardHeader>
                <CardTitle>Canonical Document</CardTitle>
              </CardHeader>
              <CardContent>
                <ReactMarkdown className="prose prose-sm max-w-none">
                  {selectedTile.mainDocumentContent}
                </ReactMarkdown>
              </CardContent>
            </Card>

            {/* Template Data */}
            <Card data-testid="template-data">
              <CardHeader>
                <CardTitle>Template Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-medium">Intent</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedTile.templateData.intent}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Scenario</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedTile.templateData.scenario}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Flow</h4>
                    <ReactMarkdown className="text-sm text-muted-foreground prose prose-sm">
                      {selectedTile.templateData.flow}
                    </ReactMarkdown>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">APIs</h4>
                    <div className="space-y-2">
                      {selectedTile.templateData.apis.map((api, index) => (
                        <Card key={index} className="p-3">
                          <div className="flex items-center gap-2">
                            <Badge variant={api.method === 'GET' ? 'secondary' : 'default'}>
                              {api.method}
                            </Badge>
                            <code className="text-sm">{api.path}</code>
                          </div>
                          {api.payloadExample && (
                            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-x-auto">
                              {api.payloadExample}
                            </pre>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Shared Components</h4>
                    <ReactMarkdown className="text-sm text-muted-foreground prose prose-sm">
                      {selectedTile.templateData.sharedComponents}
                    </ReactMarkdown>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Test Cases</h4>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="test-cases">
                        <AccordionTrigger>View Test Cases ({selectedTile.templateData.testCases.length})</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            {selectedTile.templateData.testCases.map((testCase) => (
                              <div key={testCase.id} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={testCase.id}
                                  checked={testCase.checked}
                                  disabled
                                />
                                <label htmlFor={testCase.id} className="text-sm">
                                  {testCase.text}
                                </label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Associated Issues */}
            <Card>
              <CardHeader>
                <CardTitle>Associated Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <Table data-testid="issues-table">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Issue Number</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Priority</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tileIssues.map((issue) => (
                      <TableRow
                        key={issue.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() =>
                          navigate(
                            `/projects/${projectId}/tiles/${selectedTile.id}/issues/${issue.id}`
                          )
                        }
                      >
                        <TableCell className="font-mono">{issue.issueNumber}</TableCell>
                        <TableCell>{issue.title}</TableCell>
                        <TableCell>
                          <Badge variant={issue.status === 'Closed' ? 'default' : 'secondary'}>
                            {issue.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{issue.assignee}</TableCell>
                        <TableCell>
                          <Badge variant={issue.priority === 'High' ? 'destructive' : issue.priority === 'Medium' ? 'default' : 'secondary'}>
                            {issue.priority}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {tileIssues.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No issues found for this tile
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Card className="p-8">
              <CardContent className="text-center">
                <p>Select a tile to view details</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetailPage; 