const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, '../data/resources.json');

/**
 * Gets all resources with optional filtering and field selection
 * @param {Object} options - Filter and select options
 * @param {Object} options.filter - Filter conditions (key-value pairs)
 * @param {Array<string>} options.select - Fields to include in the response
 * @returns {Promise<Object>} - Response object with items, success status, and error message
 */
async function getResources(options = {}) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    let resources = JSON.parse(data);
    
    // Apply filters if provided
    if (options.filter && Object.keys(options.filter).length > 0) {
      resources = resources.filter(resource => {
        return Object.entries(options.filter).every(([key, value]) => {
          // Handle skillSet as a special case (comma-separated string)
          if (key === 'skillSet' && resource.skillSet) {
            const skills = resource.skillSet.split(',');
            return skills.includes(value);
          }
          
          // Case-insensitive string includes for text fields
          if (typeof resource[key] === 'string' && typeof value === 'string') {
            return resource[key].toLowerCase().includes(value.toLowerCase());
          }
          
          return resource[key] === value;
        });
      });
    }
    
    // Apply field selection if provided
    if (options.select && options.select.length > 0) {
      resources = resources.map(resource => {
        const selectedResource = {};
        options.select.forEach(field => {
          if (resource[field] !== undefined) {
            selectedResource[field] = resource[field];
          }
        });
        return selectedResource;
      });
    }
    
    return {
      Response: {
        items: resources,
        totalCount: resources.length
      },
      Success: true,
      ErrorMessage: null
    };
  } catch (error) {
    console.error('Error getting resources:', error);
    return {
      Response: null,
      Success: false,
      ErrorMessage: 'Failed to fetch resources. Please try again later.'
    };
  }
}

/**
 * Gets a single resource by ID
 * @param {string} resourceId - The ID of the resource to retrieve
 * @param {Array<string>} select - Fields to include in the response
 * @returns {Promise<Object>} - Response object with the resource, success status, and error message
 */
async function getResourceById(resourceId, select = []) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const resources = JSON.parse(data);
    
    const resource = resources.find(r => r.resourceId === resourceId);
    
    if (!resource) {
      return {
        Response: null,
        Success: false,
        ErrorMessage: `Resource with ID ${resourceId} not found.`
      };
    }
    
    // Apply field selection if provided
    if (select.length > 0) {
      const selectedResource = {};
      select.forEach(field => {
        if (resource[field] !== undefined) {
          selectedResource[field] = resource[field];
        }
      });
      
      return {
        Response: selectedResource,
        Success: true,
        ErrorMessage: null
      };
    }
    
    return {
      Response: resource,
      Success: true,
      ErrorMessage: null
    };
  } catch (error) {
    console.error(`Error getting resource ${resourceId}:`, error);
    return {
      Response: null,
      Success: false,
      ErrorMessage: 'Failed to fetch resource. Please try again later.'
    };
  }
}

/**
 * Creates a new resource
 * @param {Object} resourceData - The data for the new resource
 * @returns {Promise<Object>} - Response object with the created resource, success status, and error message
 */
async function createResource(resourceData) {
  try {
    // Validate required fields
    if (!resourceData.resourceId || !resourceData.resourceName) {
      return {
        Response: null,
        Success: false,
        ErrorMessage: 'resourceId and resourceName are required fields.'
      };
    }
    
    const data = await fs.readFile(filePath, 'utf8');
    const resources = JSON.parse(data);
    
    // Check if resource with the same ID already exists
    if (resources.some(r => r.resourceId === resourceData.resourceId)) {
      return {
        Response: null,
        Success: false,
        ErrorMessage: `Resource with ID ${resourceData.resourceId} already exists.`
      };
    }
    
    // Add the new resource
    resources.push(resourceData);
    
    // Write the updated data back to the file
    await fs.writeFile(filePath, JSON.stringify(resources, null, 2), 'utf8');
    
    return {
      Response: resourceData,
      Success: true,
      ErrorMessage: null
    };
  } catch (error) {
    console.error('Error creating resource:', error);
    return {
      Response: null,
      Success: false,
      ErrorMessage: 'Failed to create resource. Please try again later.'
    };
  }
}

/**
 * Updates an existing resource
 * @param {string} resourceId - The ID of the resource to update
 * @param {Object} resourceData - The updated data for the resource
 * @returns {Promise<Object>} - Response object with the updated resource, success status, and error message
 */
async function updateResource(resourceId, resourceData) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const resources = JSON.parse(data);
    
    const index = resources.findIndex(r => r.resourceId === resourceId);
    
    if (index === -1) {
      return {
        Response: null,
        Success: false,
        ErrorMessage: `Resource with ID ${resourceId} not found.`
      };
    }
    
    // Ensure resourceId remains unchanged
    const updatedResource = { ...resources[index], ...resourceData, resourceId };
    
    resources[index] = updatedResource;
    
    // Write the updated data back to the file
    await fs.writeFile(filePath, JSON.stringify(resources, null, 2), 'utf8');
    
    return {
      Response: updatedResource,
      Success: true,
      ErrorMessage: null
    };
  } catch (error) {
    console.error(`Error updating resource ${resourceId}:`, error);
    return {
      Response: null,
      Success: false,
      ErrorMessage: 'Failed to update resource. Please try again later.'
    };
  }
}

/**
 * Deletes a resource
 * @param {string} resourceId - The ID of the resource to delete
 * @returns {Promise<Object>} - Response object with success status and error message
 */
async function deleteResource(resourceId) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const resources = JSON.parse(data);
    
    const index = resources.findIndex(r => r.resourceId === resourceId);
    
    if (index === -1) {
      return {
        Response: null,
        Success: false,
        ErrorMessage: `Resource with ID ${resourceId} not found.`
      };
    }
    
    // Remove the resource
    const deletedResource = resources.splice(index, 1)[0];
    
    // Write the updated data back to the file
    await fs.writeFile(filePath, JSON.stringify(resources, null, 2), 'utf8');
    
    return {
      Response: deletedResource,
      Success: true,
      ErrorMessage: null
    };
  } catch (error) {
    console.error(`Error deleting resource ${resourceId}:`, error);
    return {
      Response: null,
      Success: false,
      ErrorMessage: 'Failed to delete resource. Please try again later.'
    };
  }
}

module.exports = {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource
}; 