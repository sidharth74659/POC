export type UserRole = 'admin' | 'manager' | 'developer' | 'tester' | 'viewer';
export type UserStatus = 'active' | 'inactive' | 'pending';

export interface IUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  department?: string;
  title?: string;
  createdAt: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  preferences?: IUserPreferences;
}

export interface IUserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: INotificationSettings;
  dashboard?: IDashboardSettings;
}

export interface INotificationSettings {
  email: boolean;
  push: boolean;
  issueAssigned: boolean;
  issueUpdated: boolean;
  projectUpdated: boolean;
  mentions: boolean;
}

export interface IDashboardSettings {
  defaultView: 'projects' | 'issues' | 'dashboard';
  itemsPerPage: number;
  showCompletedTasks: boolean;
} 