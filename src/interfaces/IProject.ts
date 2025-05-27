export interface IProject {
  id: string;
  name: string;
  purpose: string;
  tileCount: number;
  createdAt?: Date;
  updatedAt?: Date;
  status?: 'active' | 'archived' | 'draft';
  owner?: string;
  tags?: string[];
} 