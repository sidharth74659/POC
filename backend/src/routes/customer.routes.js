const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const {
  validateBody,
  validateParams,
  validateResponse,
} = require('../middlewares/validation');
const auth = require('../middlewares/auth');
const { extractTenantId } = require('../middlewares/tenantExtractor');
const {
  CustomerCreateRequestSchema,
  CustomerUpdateRequestSchema,
  CustomerIdParamSchema,
  CustomerResponseSchema,
  CustomersResponseSchema,
  CustomerDeleteResponseSchema,
  CustomerApiResponseSchema,
  CustomersApiResponseSchema,
  CustomerDeleteApiResponseSchema,
} = require('../schemas');

// Get all customers for the current tenant
router.get(
  '/',
  auth,
  extractTenantId,
  async (req, res, next) => {
    try {
      const customers = await Customer.find({
        tenantId: req.tenantId,
        isActive: true,
      }).sort({ createdAt: -1 });

      const response = {
        success: true,
        data: customers,
      };
      res.json(response);
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch customers',
      });
    }
  },
  validateResponse(CustomersResponseSchema),
);

// Get a single customer by ID
router.get(
  '/:customerId',
  auth,
  extractTenantId,
  validateParams(CustomerIdParamSchema),
  async (req, res, next) => {
    try {
      const { customerId } = req.params;
      const customer = await Customer.findOne({
        tenantId: req.tenantId,
        customerId: customerId,
        isActive: true,
      });
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found',
        });
      }
      const response = {
        success: true,
        data: customer,
      };
      res.json(response);
    } catch (error) {
      console.error('Error fetching customer:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch customer',
      });
    }
  },
  validateResponse(CustomerResponseSchema),
);

// Create a new customer
router.post(
  '/',
  auth,
  extractTenantId,
  validateBody(CustomerCreateRequestSchema),
  async (req, res, next) => {
    try {
      const { customerId, name, contact } = req.body;
      // Check if customer already exists for this tenant
      const existingCustomer = await Customer.findOne({
        tenantId: req.tenantId,
        customerId: customerId,
      });
      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          error: 'Customer with this ID already exists',
        });
      }
      const customer = new Customer({
        tenantId: req.tenantId,
        customerId,
        name,
        contact,
      });
      await customer.save();
      const response = {
        success: true,
        data: customer,
      };
      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create customer',
      });
    }
  },
  validateResponse(CustomerResponseSchema),
);

// Update a customer
router.put(
  '/:customerId',
  auth,
  extractTenantId,
  validateParams(CustomerIdParamSchema),
  validateBody(CustomerUpdateRequestSchema),
  async (req, res, next) => {
    try {
      const { customerId } = req.params;
      const update = req.body;
      const customer = await Customer.findOneAndUpdate(
        { tenantId: req.tenantId, customerId: customerId },
        { ...update, updatedAt: new Date() },
        { new: true },
      );
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found',
        });
      }
      const response = {
        success: true,
        data: customer,
      };
      res.json(response);
    } catch (error) {
      console.error('Error updating customer:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update customer',
      });
    }
  },
  validateResponse(CustomerResponseSchema),
);

// Delete a customer (soft delete)
router.delete(
  '/:customerId',
  auth,
  extractTenantId,
  validateParams(CustomerIdParamSchema),
  async (req, res, next) => {
    try {
      const { customerId } = req.params;
      const customer = await Customer.findOneAndUpdate(
        { tenantId: req.tenantId, customerId: customerId },
        { isActive: false, updatedAt: new Date() },
        { new: true },
      );
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Customer not found',
        });
      }
      const response = {
        success: true,
        message: 'Customer deleted successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete customer',
      });
    }
  },
  validateResponse(CustomerDeleteResponseSchema),
);

module.exports = router;
