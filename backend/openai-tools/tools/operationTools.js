// Import the controller functions
// Using dynamic import to handle both ESM and CommonJS environments
let operationController;

try {
  // For ESM environment
  import('../../controllers/operationController.js')
    .then(module => {
      operationController = module;
    })
    .catch(() => {
      // For CommonJS environment
      operationController = require('../../controllers/operationController');
    });
} catch (error) {
  // Fallback to CommonJS
  operationController = require('../../controllers/operationController');
}

/**
 * Get operations based on filters and optional field selection
 * @param {Object} args - Arguments for filtering and selecting operations
 * @returns {Promise<string>} - JSON string of the filtered operations
 */
export async function getOperationsData(args) {
  try {
    // Ensure controller is loaded
    if (!operationController) {
      operationController = require('../../controllers/operationController');
    }
    
    // Prepare the request object with query parameters
    const req = {
      query: {}
    };
    
    // Add filters if provided
    if (args.filters) {
      if (args.filters.resourceId) req.query.resourceId = args.filters.resourceId;
      if (args.filters.equipment) req.query.equipment = args.filters.equipment;
      if (args.filters.startDate) req.query.startDate = args.filters.startDate;
      if (args.filters.endDate) req.query.endDate = args.filters.endDate;
    }
    
    // Add select fields if provided
    if (args.select && args.select.length > 0) {
      req.query.select = args.select.join(',');
    }
    
    // Create a mock response object to capture the result
    const res = {
      status: function(statusCode) {
        this.statusCode = statusCode;
        return this;
      },
      json: function(data) {
        this.data = data;
        return this;
      }
    };
    
    // Call the controller function
    await operationController.getOperations(req, res);
    
    // Return the result as a formatted string
    if (res.statusCode === 200) {
      return JSON.stringify(res.data, null, 2);
    } else {
      return `Error: ${res.data.ErrorMessage || 'Failed to get operations'}`;
    }
  } catch (error) {
    console.error('Error in getOperationsData tool:', error);
    return `Error: ${error.message}`;
  }
}

/**
 * Get an operation by ID with optional field selection
 * @param {Object} args - Arguments including operationId and select fields
 * @returns {Promise<string>} - JSON string of the operation data
 */
export async function getOperationById(args) {
  try {
    // Ensure controller is loaded
    if (!operationController) {
      operationController = require('../../controllers/operationController');
    }
    
    // Validate required operationId
    if (!args.operationId) {
      return 'Error: operationId is required';
    }
    
    // Prepare the request object
    const req = {
      params: {
        id: args.operationId
      },
      query: {}
    };
    
    // Add select fields if provided
    if (args.select && args.select.length > 0) {
      req.query.select = args.select.join(',');
    }
    
    // Create a mock response object to capture the result
    const res = {
      status: function(statusCode) {
        this.statusCode = statusCode;
        return this;
      },
      json: function(data) {
        this.data = data;
        return this;
      }
    };
    
    // Call the controller function
    await operationController.getOperationById(req, res);
    
    // Return the result as a formatted string
    if (res.statusCode === 200) {
      return JSON.stringify(res.data, null, 2);
    } else {
      return `Error: Operation with ID ${args.operationId} not found`;
    }
  } catch (error) {
    console.error('Error in getOperationById tool:', error);
    return `Error: ${error.message}`;
  }
}

// Tool configurations for OpenAI
export const getOperationsDataToolConfig = {
  type: "function",
  function: {
    name: "getOperationsData",
    description: "Get operations based on filters and optional field selection",
    parameters: {
      type: "object",
      properties: {
        filters: {
          type: "object",
          description: "Filters to apply to operations",
          properties: {
            resourceId: {
              type: "string",
              description: "Filter by resource ID (e.g., 'res-001')"
            },
            equipment: {
              type: "string",
              description: "Filter by equipment (e.g., 'Drill', 'Forklift')"
            },
            startDate: {
              type: "string",
              description: "Filter operations starting on or after this date (ISO format: 'YYYY-MM-DD')"
            },
            endDate: {
              type: "string",
              description: "Filter operations ending on or before this date (ISO format: 'YYYY-MM-DD')"
            }
          }
        },
        select: {
          type: "array",
          description: "Fields to include in the response",
          items: {
            type: "string",
            description: "Field name (e.g., 'operationId', 'operationName', 'resourceId', 'equipment')"
          }
        }
      }
    }
  }
};

export const getOperationByIdToolConfig = {
  type: "function",
  function: {
    name: "getOperationById",
    description: "Get an operation by ID with optional field selection",
    parameters: {
      type: "object",
      properties: {
        operationId: {
          type: "string",
          description: "The ID of the operation to retrieve (e.g., 'op-001')"
        },
        select: {
          type: "array",
          description: "Fields to include in the response",
          items: {
            type: "string",
            description: "Field name (e.g., 'operationId', 'operationName', 'resourceId', 'equipment')"
          }
        }
      },
      required: ["operationId"]
    }
  }
};