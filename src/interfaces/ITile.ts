export interface IApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description?: string;
  payloadExample?: string;
  responseExample?: string;
}

export interface ITestCase {
  id: string;
  text: string;
  checked: boolean;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
}

export interface ITemplateData {
  intent: string;
  scenario: string;
  flow: string;
  apis: IApiEndpoint[];
  sharedComponents: string;
  testCases: ITestCase[];
  dependencies?: string[];
  assumptions?: string[];
  constraints?: string[];
}

export interface ITile {
  id: string;
  projectId: string;
  name: string;
  mainDocumentContent: string;
  templateData: ITemplateData;
  version?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: 'draft' | 'review' | 'approved' | 'deprecated';
  owner?: string;
  tags?: string[];
} 