export type Project = {
  id: string;
  name: string;
  purpose: string;
  tileCount: number;
};

export type ApiSpec = {
  method: 'GET' | 'POST';
  path: string;
  payloadExample?: string;
};

export type TestCase = {
  id: string;
  text: string;
  checked: boolean;
};

export type TileTemplateData = {
  intent: string;
  scenario: string;
  flow: string;
  apis: ApiSpec[];
  sharedComponents: string;
  testCases: TestCase[];
};

export type Tile = {
  id: string;
  projectId: string;
  name: string;
  mainDocumentContent: string;
  templateData: TileTemplateData;
};

export type Issue = {
  id: string;
  tileId: string;
  issueNumber: string;
  title: string;
  assignee: 'Developer' | 'Tester' | 'Unassigned';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Development In Progress' | 'Testing In Progress' | 'Closed';
  estimation?: string;
  forkedDocumentContent: string;
  tags?: string[];
  createdAt: Date;
};

export type SubTask = {
  id: string;
  issueId: string;
  description: string;
  status: 'Open' | 'Closed';
}; 