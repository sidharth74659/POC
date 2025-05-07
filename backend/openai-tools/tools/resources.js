// Tool for fetching resources with filters and select parameters
const fetch = require('node-fetch');

/**
 * Fetch resources with optional filters and select fields
 * @param {Object} params - { skillSet, role, name, select }
 * @returns {Promise<string>} - JSON string of relevant resources
 */
async function getResources(params) {
  // Build query string from params
  const query = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  const url = `http://localhost:3000/resources${query ? '?' + query : ''}`;
  const resp = await fetch(url);
  const data = await resp.json();
  // Return only the items array for brevity
  return JSON.stringify(data.Response?.items || []);
}

/**
 * Fetch a single resource by ID, with optional select fields
 * @param {Object} params - { resourceId, select }
 * @returns {Promise<string>} - JSON string of the resource
 */
async function getResourceById(params) {
  const { resourceId, select } = params;
  if (!resourceId) return 'Missing resourceId';
  const query = select ? `?select=${encodeURIComponent(select)}` : '';
  const url = `http://localhost:3000/resources/${encodeURIComponent(resourceId)}${query}`;
  const resp = await fetch(url);
  const data = await resp.json();
  return JSON.stringify(data.Response || {});
}

// Tool configs for OpenAI function calling
const getResourcesToolConfig = {
  type: 'function',
  function: {
    name: 'getResources',
    description: 'Fetch a list of resources with optional filters (skillSet, role, name) and select fields.',
    parameters: {
      type: 'object',
      properties: {
        skillSet: { type: 'string', description: 'Filter by skill set' },
        role: { type: 'string', description: 'Filter by role' },
        name: { type: 'string', description: 'Filter by name' },
        select: { type: 'string', description: 'Comma-separated list of fields to include' },
      },
    },
  },
};

const getResourceByIdToolConfig = {
  type: 'function',
  function: {
    name: 'getResourceById',
    description: 'Fetch a single resource by resourceId, with optional select fields.',
    parameters: {
      type: 'object',
      properties: {
        resourceId: { type: 'string', description: 'The resource ID' },
        select: { type: 'string', description: 'Comma-separated list of fields to include' },
      },
      required: ['resourceId'],
    },
  },
};

module.exports = {
  getResources,
  getResourceById,
  getResourcesToolConfig,
  getResourceByIdToolConfig,
}; 