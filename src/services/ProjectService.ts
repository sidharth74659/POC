import type { IProject, IApiResponse, IPaginatedResponse } from '../interfaces';
import { apiService } from './ApiService';

/**
 * ProjectService - Handles all project-related API operations
 */
export class ProjectService {
  private readonly endpoint = '/projects';

  /**
   * Get all projects with optional pagination and filtering
   */
  async getProjects(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<IApiResponse<IProject[]>> {
    return apiService.get<IProject[]>(this.endpoint, params);
  }

  /**
   * Get a single project by ID
   */
  async getProject(id: string): Promise<IApiResponse<IProject>> {
    return apiService.get<IProject>(`${this.endpoint}/${id}`);
  }

  /**
   * Create a new project
   */
  async createProject(project: Omit<IProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<IApiResponse<IProject>> {
    return apiService.post<IProject>(this.endpoint, project);
  }

  /**
   * Update an existing project
   */
  async updateProject(id: string, updates: Partial<IProject>): Promise<IApiResponse<IProject>> {
    return apiService.put<IProject>(`${this.endpoint}/${id}`, updates);
  }

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<IApiResponse<void>> {
    return apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Archive a project
   */
  async archiveProject(id: string): Promise<IApiResponse<IProject>> {
    return apiService.patch<IProject>(`${this.endpoint}/${id}/archive`);
  }

  /**
   * Restore an archived project
   */
  async restoreProject(id: string): Promise<IApiResponse<IProject>> {
    return apiService.patch<IProject>(`${this.endpoint}/${id}/restore`);
  }

  /**
   * Get project statistics
   */
  async getProjectStats(id: string): Promise<IApiResponse<{
    totalTiles: number;
    totalIssues: number;
    openIssues: number;
    closedIssues: number;
    recentActivity: any[];
  }>> {
    return apiService.get(`${this.endpoint}/${id}/stats`);
  }

  /**
   * Search projects
   */
  async searchProjects(query: string, filters?: {
    status?: string;
    owner?: string;
    tags?: string[];
  }): Promise<IApiResponse<IProject[]>> {
    return apiService.get<IProject[]>(`${this.endpoint}/search`, {
      q: query,
      ...filters,
    });
  }
}

// Export singleton instance
export const projectService = new ProjectService(); 