import { apiService } from './ApiService';
import type { IIssue, ISubTask, IApiResponse } from '../interfaces';

/**
 * Service for managing issues
 * Handles CRUD operations for issues and subtasks
 */
export class IssueService {
  private readonly endpoint = '/issues';

  /**
   * Get all issues for a tile
   */
  async getIssuesByTile(tileId: string): Promise<IApiResponse<IIssue[]>> {
    return apiService.get(`/tiles/${tileId}/issues`);
  }

  /**
   * Get all issues for a project
   */
  async getIssuesByProject(projectId: string): Promise<IApiResponse<IIssue[]>> {
    return apiService.get(`/projects/${projectId}/issues`);
  }

  /**
   * Get a specific issue by ID
   */
  async getIssueById(id: string): Promise<IApiResponse<IIssue>> {
    return apiService.get(`${this.endpoint}/${id}`);
  }

  /**
   * Create a new issue
   */
  async createIssue(issue: Omit<IIssue, 'id' | 'createdAt' | 'updatedAt'>): Promise<IApiResponse<IIssue>> {
    return apiService.post(this.endpoint, issue);
  }

  /**
   * Update an existing issue
   */
  async updateIssue(id: string, updates: Partial<IIssue>): Promise<IApiResponse<IIssue>> {
    return apiService.put(`${this.endpoint}/${id}`, updates);
  }

  /**
   * Delete an issue
   */
  async deleteIssue(id: string): Promise<IApiResponse<void>> {
    return apiService.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Update issue status
   */
  async updateIssueStatus(id: string, status: IIssue['status']): Promise<IApiResponse<IIssue>> {
    return apiService.patch(`${this.endpoint}/${id}/status`, { status });
  }

  /**
   * Assign issue to user
   */
  async assignIssue(id: string, assignee: string): Promise<IApiResponse<IIssue>> {
    return apiService.patch(`${this.endpoint}/${id}/assign`, { assignee });
  }

  /**
   * Add comment to issue
   */
  async addComment(id: string, comment: string): Promise<IApiResponse<IIssue>> {
    return apiService.post(`${this.endpoint}/${id}/comments`, { comment });
  }

  /**
   * Get subtasks for an issue
   */
  async getSubtasks(issueId: string): Promise<IApiResponse<ISubTask[]>> {
    return apiService.get(`${this.endpoint}/${issueId}/subtasks`);
  }

  /**
   * Create a new subtask
   */
  async createSubtask(subtask: Omit<ISubTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<IApiResponse<ISubTask>> {
    return apiService.post(`${this.endpoint}/${subtask.issueId}/subtasks`, subtask);
  }

  /**
   * Update subtask
   */
  async updateSubtask(id: string, updates: Partial<ISubTask>): Promise<IApiResponse<ISubTask>> {
    return apiService.put(`/subtasks/${id}`, updates);
  }

  /**
   * Delete subtask
   */
  async deleteSubtask(id: string): Promise<IApiResponse<void>> {
    return apiService.delete(`/subtasks/${id}`);
  }

  /**
   * Search issues
   */
  async searchIssues(query: string, filters?: {
    status?: IIssue['status'];
    priority?: IIssue['priority'];
    assignee?: string;
    projectId?: string;
    tileId?: string;
  }): Promise<IApiResponse<IIssue[]>> {
    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return apiService.get(`${this.endpoint}/search?${params.toString()}`);
  }

  /**
   * Get issue statistics
   */
  async getIssueStats(filters?: {
    projectId?: string;
    tileId?: string;
    assignee?: string;
  }): Promise<IApiResponse<{
    total: number;
    open: number;
    inProgress: number;
    closed: number;
    byPriority: Record<string, number>;
    byStatus: Record<string, number>;
  }>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return apiService.get(`${this.endpoint}/stats?${params.toString()}`);
  }

  /**
   * Bulk update issues
   */
  async bulkUpdateIssues(issueIds: string[], updates: Partial<IIssue>): Promise<IApiResponse<IIssue[]>> {
    return apiService.patch(`${this.endpoint}/bulk`, { issueIds, updates });
  }
}

export const issueService = new IssueService(); 