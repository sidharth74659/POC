const resourceModel = require('../models/resourceModel');

/**
 * Get all resources with optional filtering and field selection
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getResources(req, res) {
  try {
    // Extract filter parameters from query string
    const filter = {};
    if (req.query.skillSet) filter.skillSet = req.query.skillSet;
    if (req.query.role) filter.role = req.query.role;
    if (req.query.name) filter.resourceName = req.query.name;
    
    // Extract field selection if provided
    let select = [];
    if (req.query.select) {
      select = req.query.select.split(',');
    }
    
    const result = await resourceModel.getResources({ filter, select });
    
    if (result.Success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in getResources controller:', error);
    res.status(500).json({
      Response: null,
      Success: false,
      ErrorMessage: 'Internal server error'
    });
  }
}

/**
 * Get a single resource by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getResourceById(req, res) {
  try {
    const { id } = req.params;
    
    // Extract field selection if provided
    let select = [];
    if (req.query.select) {
      select = req.query.select.split(',');
    }
    
    const result = await resourceModel.getResourceById(id, select);
    
    if (result.Success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Error in getResourceById controller:', error);
    res.status(500).json({
      Response: null,
      Success: false,
      ErrorMessage: 'Internal server error'
    });
  }
}

/**
 * Create a new resource
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function createResource(req, res) {
  try {
    const resourceData = req.body;
    
    const result = await resourceModel.createResource(resourceData);
    
    if (result.Success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in createResource controller:', error);
    res.status(500).json({
      Response: null,
      Success: false,
      ErrorMessage: 'Internal server error'
    });
  }
}

/**
 * Update an existing resource
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function updateResource(req, res) {
  try {
    const { id } = req.params;
    const resourceData = req.body;
    
    const result = await resourceModel.updateResource(id, resourceData);
    
    if (result.Success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Error in updateResource controller:', error);
    res.status(500).json({
      Response: null,
      Success: false,
      ErrorMessage: 'Internal server error'
    });
  }
}

/**
 * Delete a resource
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deleteResource(req, res) {
  try {
    const { id } = req.params;
    
    const result = await resourceModel.deleteResource(id);
    
    if (result.Success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Error in deleteResource controller:', error);
    res.status(500).json({
      Response: null,
      Success: false,
      ErrorMessage: 'Internal server error'
    });
  }
}

module.exports = {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource
}; 