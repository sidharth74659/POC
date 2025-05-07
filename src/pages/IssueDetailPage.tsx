import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ReactMarkdown from 'react-markdown';

function IssueDetailPage() {
  const { issueId } = useParams<{ issueId: string }>();
  const { state, dispatch } = useAppContext();

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
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold">{issue.issueNumber}</h1>
            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
              {issue.status}
            </span>
          </div>
          <h2 className="text-xl mt-2">{issue.title}</h2>
        </div>
        <div className="space-y-2">
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={issue.status}
            onChange={(e) =>
              handleStatusChange(e.target.value as typeof issue.status)
            }
          >
            <option value="Open">Open</option>
            <option value="Development In Progress">Development In Progress</option>
            <option value="Testing In Progress">Testing In Progress</option>
            <option value="Closed">Closed</option>
          </select>
          {issue.status === 'Closed' && (
            <button
              className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              onClick={handleMergeToMain}
            >
              Merge to Main
            </button>
          )}
        </div>
      </div>

      {/* Issue Metadata */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Assignee</label>
          <div className="text-sm">{issue.assignee}</div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Priority</label>
          <div className="text-sm">{issue.priority}</div>
        </div>
        {issue.estimation && (
          <div className="space-y-1">
            <label className="text-sm font-medium">Estimation</label>
            <div className="text-sm">{issue.estimation}</div>
          </div>
        )}
        {issue.tags && issue.tags.length > 0 && (
          <div className="space-y-1">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex gap-2">
              {issue.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Forked Document */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Forked Document</h3>
        <div className="rounded-lg border bg-card p-6">
          <ReactMarkdown
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
                            className="bg-green-100 dark:bg-green-900/30"
                          >
                            {part.slice(2, -2)}
                          </span>
                        );
                      }
                      if (part.startsWith('--') && part.endsWith('--')) {
                        return (
                          <span
                            key={index}
                            className="bg-red-100 line-through dark:bg-red-900/30"
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
        </div>
      </div>

      {/* Subtasks */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Subtasks</h3>
        <div className="space-y-2">
          {subtasks.map((subtask) => (
            <div
              key={subtask.id}
              className="flex items-center space-x-2 rounded-lg border p-4"
            >
              <input
                type="checkbox"
                checked={subtask.status === 'Closed'}
                onChange={() => handleSubtaskToggle(subtask.id)}
                className="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
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
      </div>
    </div>
  );
}

export default IssueDetailPage; 