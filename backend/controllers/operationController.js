const operationModel = require('../models/operationModel');

/**
 * Get all operations with optional filtering and field selection
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getOperations(req, res) {
  try {
    // Extract filter parameters from query string
    const filter = {};
    if (req.query.resourceId) filter.resourceId = req.query.resourceId;
    if (req.query.equipment) filter.equipment = req.query.equipment;
    if (req.query.startDate) filter.startDate = req.query.startDate;
    if (req.query.endDate) filter.endDate = req.query.endDate;
    
    // Extract field selection if provided
    let select = [];
    if (req.query.select) {
      select = req.query.select.split(',');
    }
    
    const result = await operationModel.getOperations({ filter, select });
    
    if (result.Success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in getOperations controller:', error);
    res.status(500).json({
      Response: null,
      Success: false,
      ErrorMessage: 'Internal server error'
    });
  }
}

/**
 * Get a single operation by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getOperationById(req, res) {
  try {
    const { id } = req.params;
    
    // Extract field selection if provided
    let select = [];
    if (req.query.select) {
      select = req.query.select.split(',');
    }
    
    const result = await operationModel.getOperationById(id, select);
    
    if (result.Success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Error in getOperationById controller:', error);
    res.status(500).json({
      Response: null,
      Success: false,
      ErrorMessage: 'Internal server error'
    });
  }
}

/**
 * Create a new operation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function createOperation(req, res) {
  try {
    const operationData = req.body;
    
    const result = await operationModel.createOperation(operationData);
    
    if (result.Success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in createOperation controller:', error);
    res.status(500).json({
      Response: null,
      Success: false,
      ErrorMessage: 'Internal server error'
    });
  }
}

/**
 * Update an existing operation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function updateOperation(req, res) {
  try {
    const { id } = req.params;
    const operationData = req.body;
    
    const result = await operationModel.updateOperation(id, operationData);
    
    if (result.Success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Error in updateOperation controller:', error);
    res.status(500).json({
      Response: null,
      Success: false,
      ErrorMessage: 'Internal server error'
    });
  }
}

/**
 * Delete an operation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deleteOperation(req, res) {
  try {
    const { id } = req.params;
    
    const result = await operationModel.deleteOperation(id);
    
    if (result.Success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Error in deleteOperation controller:', error);
    res.status(500).json({
      Response: null,
      Success: false,
      ErrorMessage: 'Internal server error'
    });
  }
}

module.exports = {
  getOperations,
  getOperationById,
  createOperation,
  updateOperation,
  deleteOperation
}; 