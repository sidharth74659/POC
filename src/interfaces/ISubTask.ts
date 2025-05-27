export type SubTaskStatus = 'Open' | 'Closed' | 'In Progress' | 'Blocked';

export interface ISubTask {
  id: string;
  issueId: string;
  description: string;
  status: SubTaskStatus;
  assignee?: string;
  createdAt?: Date;
  updatedAt?: Date;
  dueDate?: Date;
  estimation?: string;
  order?: number;
} 