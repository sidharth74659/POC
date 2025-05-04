const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, '../data/operations.json');

/**
 * Gets all operations with optional filtering and field selection
 * @param {Object} options - Filter and select options
 * @param {Object} options.filter - Filter conditions (key-value pairs)
 * @param {Array<string>} options.select - Fields to include in the response
 * @returns {Promise<Object>} - Response object with items, success status, and error message
 */
async function getOperations(options = {}) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    let operations = JSON.parse(data);
    
    // Apply filters if provided
    if (options.filter && Object.keys(options.filter).length > 0) {
      operations = operations.filter(operation => {
        return Object.entries(options.filter).every(([key, value]) => {
          // Handle date ranges
          if (key === 'startDate' && operation.startDate) {
            const opDate = new Date(operation.startDate);
            const filterDate = new Date(value);
            return opDate >= filterDate;
          }
          
          if (key === 'endDate' && operation.endDate) {
            const opDate = new Date(operation.endDate);
            const filterDate = new Date(value);
            return opDate <= filterDate;
          }
          
          // Case-insensitive string includes for text fields
          if (typeof operation[key] === 'string' && typeof value === 'string') {
            return operation[key].toLowerCase().includes(value.toLowerCase());
          }
          
          return operation[key] === value;
        });
      });
    }
    
    // Apply field selection if provided
    if (options.select && options.select.length > 0) {
      operations = operations.map(operation => {
        const selectedOperation = {};
        options.select.forEach(field => {
          if (operation[field] !== undefined) {
            selectedOperation[field] = operation[field];
          }
        });
        return selectedOperation;
      });
    }
    
    return {
      Response: {
        items: operations,
        totalCount: operations.length
      },
      Success: true,
      ErrorMessage: null
    };
  } catch (error) {
    console.error('Error getting operations:', error);
    return {
      Response: null,
      Success: false,
      ErrorMessage: 'Failed to fetch operations. Please try again later.'
    };
  }
}

/**
 * Gets a single operation by ID
 * @param {string} operationId - The ID of the operation to retrieve
 * @param {Array<string>} select - Fields to include in the response
 * @returns {Promise<Object>} - Response object with the operation, success status, and error message
 */
async function getOperationById(operationId, select = []) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const operations = JSON.parse(data);
    
    const operation = operations.find(op => op.operationId === operationId);
    
    if (!operation) {
      return {
        Response: null,
        Success: false,
        ErrorMessage: `Operation with ID ${operationId} not found.`
      };
    }
    
    // Apply field selection if provided
    if (select.length > 0) {
      const selectedOperation = {};
      select.forEach(field => {
        if (operation[field] !== undefined) {
          selectedOperation[field] = operation[field];
        }
      });
      
      return {
        Response: selectedOperation,
        Success: true,
        ErrorMessage: null
      };
    }
    
    return {
      Response: operation,
      Success: true,
      ErrorMessage: null
    };
  } catch (error) {
    console.error(`Error getting operation ${operationId}:`, error);
    return {
      Response: null,
      Success: false,
      ErrorMessage: 'Failed to fetch operation. Please try again later.'
    };
  }
}

/**
 * Creates a new operation
 * @param {Object} operationData - The data for the new operation
 * @returns {Promise<Object>} - Response object with the created operation, success status, and error message
 */
async function createOperation(operationData) {
  try {
    // Validate required fields
    if (!operationData.operationId || !operationData.operationName || !operationData.resourceId) {
      return {
        Response: null,
        Success: false,
        ErrorMessage: 'operationId, operationName, and resourceId are required fields.'
      };
    }
    
    const data = await fs.readFile(filePath, 'utf8');
    const operations = JSON.parse(data);
    
    // Check if operation with the same ID already exists
    if (operations.some(op => op.operationId === operationData.operationId)) {
      return {
        Response: null,
        Success: false,
        ErrorMessage: `Operation with ID ${operationData.operationId} already exists.`
      };
    }
    
    // Add the new operation
    operations.push(operationData);
    
    // Write the updated data back to the file
    await fs.writeFile(filePath, JSON.stringify(operations, null, 2), 'utf8');
    
    return {
      Response: operationData,
      Success: true,
      ErrorMessage: null
    };
  } catch (error) {
    console.error('Error creating operation:', error);
    return {
      Response: null,
      Success: false,
      ErrorMessage: 'Failed to create operation. Please try again later.'
    };
  }
}

/**
 * Updates an existing operation
 * @param {string} operationId - The ID of the operation to update
 * @param {Object} operationData - The updated data for the operation
 * @returns {Promise<Object>} - Response object with the updated operation, success status, and error message
 */
async function updateOperation(operationId, operationData) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const operations = JSON.parse(data);
    
    const index = operations.findIndex(op => op.operationId === operationId);
    
    if (index === -1) {
      return {
        Response: null,
        Success: false,
        ErrorMessage: `Operation with ID ${operationId} not found.`
      };
    }
    
    // Ensure operationId remains unchanged
    const updatedOperation = { ...operations[index], ...operationData, operationId };
    
    operations[index] = updatedOperation;
    
    // Write the updated data back to the file
    await fs.writeFile(filePath, JSON.stringify(operations, null, 2), 'utf8');
    
    return {
      Response: updatedOperation,
      Success: true,
      ErrorMessage: null
    };
  } catch (error) {
    console.error(`Error updating operation ${operationId}:`, error);
    return {
      Response: null,
      Success: false,
      ErrorMessage: 'Failed to update operation. Please try again later.'
    };
  }
}

/**
 * Deletes an operation
 * @param {string} operationId - The ID of the operation to delete
 * @returns {Promise<Object>} - Response object with success status and error message
 */
async function deleteOperation(operationId) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const operations = JSON.parse(data);
    
    const index = operations.findIndex(op => op.operationId === operationId);
    
    if (index === -1) {
      return {
        Response: null,
        Success: false,
        ErrorMessage: `Operation with ID ${operationId} not found.`
      };
    }
    
    // Remove the operation
    const deletedOperation = operations.splice(index, 1)[0];
    
    // Write the updated data back to the file
    await fs.writeFile(filePath, JSON.stringify(operations, null, 2), 'utf8');
    
    return {
      Response: deletedOperation,
      Success: true,
      ErrorMessage: null
    };
  } catch (error) {
    console.error(`Error deleting operation ${operationId}:`, error);
    return {
      Response: null,
      Success: false,
      ErrorMessage: 'Failed to delete operation. Please try again later.'
    };
  }
}

module.exports = {
  getOperations,
  getOperationById,
  createOperation,
  updateOperation,
  deleteOperation
}; 