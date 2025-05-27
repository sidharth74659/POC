export type IssueStatus = 'Open' | 'Development In Progress' | 'Testing In Progress' | 'Closed' | 'Blocked';
export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type IssueType = 'Bug' | 'Feature' | 'Enhancement' | 'Documentation' | 'Task';

export interface IIssue {
  id: string;
  tileId: string;
  issueNumber: string;
  title: string;
  description?: string;
  assignee: string;
  priority: IssuePriority;
  status: IssueStatus;
  type?: IssueType;
  forkedDocumentContent: string;
  originalDocumentContent?: string;
  tags: string[];
  createdAt: Date;
  updatedAt?: Date;
  dueDate?: Date;
  estimation?: string;
  reporter?: string;
  watchers?: string[];
  comments?: IComment[];
  attachments?: IAttachment[];
}

export interface IComment {
  id: string;
  issueId: string;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface IAttachment {
  id: string;
  issueId: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: Date;
} 