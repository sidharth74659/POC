import { apiService } from './ApiService';
import type { ITile, IApiResponse } from '../interfaces';

/**
 * Service for managing tiles
 * Handles CRUD operations for tiles within projects
 */
export class TileService {
  private readonly endpoint = '/tiles';

  /**
   * Get all tiles for a project
   */
  async getTilesByProject(projectId: string): Promise<IApiResponse<ITile[]>> {
    return apiService.get(`/projects/${projectId}/tiles`);
  }

  /**
   * Get a specific tile by ID
   */
  async getTileById(id: string): Promise<IApiResponse<ITile>> {
    return apiService.get(`${this.endpoint}/${id}`);
  }

  /**
   * Create a new tile
   */
  async createTile(tile: Omit<ITile, 'id' | 'createdAt' | 'updatedAt'>): Promise<IApiResponse<ITile>> {
    return apiService.post(this.endpoint, tile);
  }

  /**
   * Update an existing tile
   */
  async updateTile(id: string, updates: Partial<ITile>): Promise<IApiResponse<ITile>> {
    return apiService.put(`${this.endpoint}/${id}`, updates);
  }

  /**
   * Delete a tile
   */
  async deleteTile(id: string): Promise<IApiResponse<void>> {
    return apiService.delete(`${this.endpoint}/${id}`);
  }

  /**
   * Update tile content
   */
  async updateTileContent(id: string, content: string): Promise<IApiResponse<ITile>> {
    return apiService.patch(`${this.endpoint}/${id}/content`, { content });
  }

  /**
   * Get tile version history
   */
  async getTileVersions(id: string): Promise<IApiResponse<ITile[]>> {
    return apiService.get(`${this.endpoint}/${id}/versions`);
  }

  /**
   * Duplicate a tile
   */
  async duplicateTile(id: string, newName?: string): Promise<IApiResponse<ITile>> {
    return apiService.post(`${this.endpoint}/${id}/duplicate`, { name: newName });
  }

  /**
   * Search tiles by content
   */
  async searchTiles(query: string, projectId?: string): Promise<IApiResponse<ITile[]>> {
    const params = new URLSearchParams({ q: query });
    if (projectId) params.append('projectId', projectId);
    return apiService.get(`${this.endpoint}/search?${params.toString()}`);
  }

  /**
   * Get tile statistics
   */
  async getTileStats(id: string): Promise<IApiResponse<{
    totalIssues: number;
    openIssues: number;
    closedIssues: number;
    lastModified: Date;
    wordCount: number;
  }>> {
    return apiService.get(`${this.endpoint}/${id}/stats`);
  }
}

export const tileService = new TileService(); 