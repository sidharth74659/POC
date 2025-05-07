import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ReactMarkdown from 'react-markdown';

function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);

  const project = state.projects.find((p) => p.id === projectId);
  const projectTiles = state.tiles.filter((t) => t.projectId === projectId);
  const selectedTile = projectTiles.find((t) => t.id === selectedTileId);
  const tileIssues = selectedTile
    ? state.issues.filter((i) => i.tileId === selectedTile.id)
    : [];

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Sidebar - Tile List */}
      <div className="col-span-3 space-y-4">
        <h2 className="text-xl font-semibold">{project.name}</h2>
        <div className="rounded-md border">
          <div className="py-2 px-4 bg-muted">
            <h3 className="font-medium">Tiles</h3>
          </div>
          <div className="divide-y">
            {projectTiles.map((tile) => (
              <div
                key={tile.id}
                className={`px-4 py-2 cursor-pointer hover:bg-accent ${
                  selectedTileId === tile.id ? 'bg-accent' : ''
                }`}
                onClick={() => setSelectedTileId(tile.id)}
              >
                {tile.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Content - Tile Details */}
      <div className="col-span-9">
        {selectedTile ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedTile.name}</h2>
              <button
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                onClick={() => {
                  // Open create issue modal
                }}
              >
                Create New Issue
              </button>
            </div>

            {/* Document Content */}
            <div className="rounded-lg border bg-card">
              <div className="p-6">
                <ReactMarkdown>{selectedTile.mainDocumentContent}</ReactMarkdown>
              </div>
            </div>

            {/* Template Data */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Template Data</h3>
              <div className="grid gap-4">
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
                <div className="space-y-2">
                  <h4 className="font-medium">Flow</h4>
                  <ReactMarkdown className="text-sm text-muted-foreground">
                    {selectedTile.templateData.flow}
                  </ReactMarkdown>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">APIs</h4>
                  <div className="space-y-2">
                    {selectedTile.templateData.apis.map((api, index) => (
                      <div
                        key={index}
                        className="text-sm text-muted-foreground border rounded p-2"
                      >
                        <div>
                          <span className="font-mono">{api.method}</span>{' '}
                          <span className="font-mono">{api.path}</span>
                        </div>
                        {api.payloadExample && (
                          <pre className="mt-1 text-xs bg-muted p-2 rounded">
                            {api.payloadExample}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Associated Issues */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Associated Issues</h3>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Issue Number
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Title
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Status
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium">
                          Assignee
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tileIssues.map((issue) => (
                        <tr
                          key={issue.id}
                          className="border-b cursor-pointer hover:bg-muted/50"
                          onClick={() =>
                            navigate(
                              `/projects/${projectId}/tiles/${selectedTile.id}/issues/${issue.id}`
                            )
                          }
                        >
                          <td className="p-4">{issue.issueNumber}</td>
                          <td className="p-4">{issue.title}</td>
                          <td className="p-4">
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                              {issue.status}
                            </span>
                          </td>
                          <td className="p-4">{issue.assignee}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a tile to view details
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetailPage; 