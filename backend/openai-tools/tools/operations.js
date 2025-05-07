// Tool for fetching operations with filters and select parameters
const fetch = require('node-fetch');

/**
 * Fetch operations with optional filters and select fields
 * @param {Object} params - { resourceId, equipment, startDate, endDate, select }
 * @returns {Promise<string>} - JSON string of relevant operations
 */
async function getOperations(params) {
  // Build query string from params
  const query = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  const url = `http://localhost:3000/operations${query ? '?' + query : ''}`;
  const resp = await fetch(url);
  const data = await resp.json();
  // Return only the items array for brevity
  return JSON.stringify(data.Response?.items || []);
}

/**
 * Fetch a single operation by ID, with optional select fields
 * @param {Object} params - { operationId, select }
 * @returns {Promise<string>} - JSON string of the operation
 */
async function getOperationById(params) {
  const { operationId, select } = params;
  if (!operationId) return 'Missing operationId';
  const query = select ? `?select=${encodeURIComponent(select)}` : '';
  const url = `http://localhost:3000/operations/${encodeURIComponent(operationId)}${query}`;
  const resp = await fetch(url);
  const data = await resp.json();
  return JSON.stringify(data.Response || {});
}

// Tool configs for OpenAI function calling
const getOperationsToolConfig = {
  type: 'function',
  function: {
    name: 'getOperations',
    description: 'Fetch a list of operations with optional filters (resourceId, equipment, startDate, endDate) and select fields.',
    parameters: {
      type: 'object',
      properties: {
        resourceId: { type: 'string', description: 'Filter by resource ID' },
        equipment: { type: 'string', description: 'Filter by equipment' },
        startDate: { type: 'string', description: 'Filter by start date (ISO 8601)' },
        endDate: { type: 'string', description: 'Filter by end date (ISO 8601)' },
        select: { type: 'string', description: 'Comma-separated list of fields to include' },
      },
    },
  },
};

const getOperationByIdToolConfig = {
  type: 'function',
  function: {
    name: 'getOperationById',
    description: 'Fetch a single operation by operationId, with optional select fields.',
    parameters: {
      type: 'object',
      properties: {
        operationId: { type: 'string', description: 'The operation ID' },
        select: { type: 'string', description: 'Comma-separated list of fields to include' },
      },
      required: ['operationId'],
    },
  },
}; 

module.exports = {
  getOperations,
  getOperationById,
  getOperationsToolConfig,
  getOperationByIdToolConfig,
};

