export interface Resource {
  id: string;
  name: string;
  role: string;
  skillSet: string[];
  availability: 'available' | 'busy' | 'unavailable';
  location: string;
} 