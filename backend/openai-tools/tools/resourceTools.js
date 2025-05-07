// Import the controller functions
// Using dynamic import to handle both ESM and CommonJS environments
let resourceController;

try {
  // For ESM environment
  import('../../controllers/resourceController.js')
    .then(module => {
      resourceController = module;
    })
    .catch(() => {
      // For CommonJS environment
      resourceController = require('../../controllers/resourceController');
    });
} catch (error) {
  // Fallback to CommonJS
  resourceController = require('../../controllers/resourceController');
}

/**
 * Get resources based on filters and optional field selection
 * @param {Object} args - Arguments for filtering and selecting resources
 * @returns {Promise<string>} - JSON string of the filtered resources
 */
export async function getResourcesData(args) {
  try {
    // Ensure controller is loaded
    if (!resourceController) {
      resourceController = require('../../controllers/resourceController');
    }
    
    // Prepare the request object with query parameters
    const req = {
      query: {}
    };
    
    // Add filters if provided
    if (args.filters) {
      if (args.filters.skillSet) req.query.skillSet = args.filters.skillSet;
      if (args.filters.role) req.query.role = args.filters.role;
      if (args.filters.name) req.query.name = args.filters.name;
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
    await resourceController.getResources(req, res);
    
    // Return the result as a formatted string
    if (res.statusCode === 200) {
      return JSON.stringify(res.data, null, 2);
    } else {
      return `Error: ${res.data.ErrorMessage || 'Failed to get resources'}`;
    }
  } catch (error) {
    console.error('Error in getResourcesData tool:', error);
    return `Error: ${error.message}`;
  }
}

/**
 * Get a resource by ID with optional field selection
 * @param {Object} args - Arguments including resourceId and select fields
 * @returns {Promise<string>} - JSON string of the resource data
 */
export async function getResourceById(args) {
  try {
    // Ensure controller is loaded
    if (!resourceController) {
      resourceController = require('../../controllers/resourceController');
    }
    
    // Validate required resourceId
    if (!args.resourceId) {
      return 'Error: resourceId is required';
    }
    
    // Prepare the request object
    const req = {
      params: {
        id: args.resourceId
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
    await resourceController.getResourceById(req, res);
    
    // Return the result as a formatted string
    if (res.statusCode === 200) {
      return JSON.stringify(res.data, null, 2);
    } else {
      return `Error: Resource with ID ${args.resourceId} not found`;
    }
  } catch (error) {
    console.error('Error in getResourceById tool:', error);
    return `Error: ${error.message}`;
  }
}

// Tool configurations for OpenAI
export const getResourcesDataToolConfig = {
  type: "function",
  function: {
    name: "getResourcesData",
    description: "Get resources based on filters and optional field selection",
    parameters: {
      type: "object",
      properties: {
        filters: {
          type: "object",
          description: "Filters to apply to resources",
          properties: {
            skillSet: {
              type: "string",
              description: "Filter by skill set (e.g., 'Welding', 'Electrical')"
            },
            role: {
              type: "string",
              description: "Filter by role (e.g., 'Engineer', 'Technician')"
            },
            name: {
              type: "string",
              description: "Filter by resource name"
            }
          }
        },
        select: {
          type: "array",
          description: "Fields to include in the response",
          items: {
            type: "string",
            description: "Field name (e.g., 'resourceId', 'resourceName', 'skillSet', 'availability')"
          }
        }
      }
    }
  }
};

export const getResourceByIdToolConfig = {
  type: "function",
  function: {
    name: "getResourceById",
    description: "Get a resource by ID with optional field selection",
    parameters: {
      type: "object",
      properties: {
        resourceId: {
          type: "string",
          description: "The ID of the resource to retrieve (e.g., 'res-001')"
        },
        select: {
          type: "array",
          description: "Fields to include in the response",
          items: {
            type: "string",
            description: "Field name (e.g., 'resourceId', 'resourceName', 'skillSet', 'availability')"
          }
        }
      },
      required: ["resourceId"]
    }
  }
}; 