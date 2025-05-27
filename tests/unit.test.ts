import { mockData } from '../src/mockData';

describe('Unit Tests', () => {
  test('mockData generates valid IDs', () => {
    const id1 = mockData.generateId();
    const id2 = mockData.generateId();
    
    expect(id1).toBeDefined();
    expect(id2).toBeDefined();
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
    expect(typeof id2).toBe('string');
  });

  test('mockData has projects', () => {
    expect(mockData.projects).toBeDefined();
    expect(Array.isArray(mockData.projects)).toBe(true);
    expect(mockData.projects.length).toBeGreaterThan(0);
  });

  test('mockData has tiles', () => {
    expect(mockData.tiles).toBeDefined();
    expect(Array.isArray(mockData.tiles)).toBe(true);
    expect(mockData.tiles.length).toBeGreaterThan(0);
  });

  test('mockData has issues', () => {
    expect(mockData.issues).toBeDefined();
    expect(Array.isArray(mockData.issues)).toBe(true);
    expect(mockData.issues.length).toBeGreaterThan(0);
  });

  test('projects have required properties', () => {
    const project = mockData.projects[0];
    expect(project).toHaveProperty('id');
    expect(project).toHaveProperty('name');
    expect(project).toHaveProperty('purpose');
    expect(project).toHaveProperty('tileCount');
  });

  test('tiles have required properties', () => {
    const tile = mockData.tiles[0];
    expect(tile).toHaveProperty('id');
    expect(tile).toHaveProperty('projectId');
    expect(tile).toHaveProperty('name');
    expect(tile).toHaveProperty('mainDocumentContent');
  });

  test('issues have required properties', () => {
    const issue = mockData.issues[0];
    expect(issue).toHaveProperty('id');
    expect(issue).toHaveProperty('tileId');
    expect(issue).toHaveProperty('issueNumber');
    expect(issue).toHaveProperty('title');
    expect(issue).toHaveProperty('status');
    expect(issue).toHaveProperty('priority');
    expect(issue).toHaveProperty('assignee');
  });
}); 