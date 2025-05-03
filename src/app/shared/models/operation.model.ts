export interface Operation {
  id: string;
  resourceId: string;
  title: string;
  description: string;
  location: string;
  equipment: string;
  startDate: string;
  endDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
} 