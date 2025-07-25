const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const auth = require('../middlewares/auth');
const { extractTenantId } = require('../middlewares/tenantExtractor');
const {
  validateBody,
  validateResponse,
  validateParams,
} = require('../middlewares/validation');
const {
  OrderCreateRequestSchema,
  OrderUpdateRequestSchema,
  OrderResponseSchema,
  OrdersResponseSchema,
  CustomerIdParamSchema,
} = require('../schemas');

// Get all orders for the current tenant
router.get(
  '/',
  auth,
  extractTenantId,
  async (req, res, next) => {
    try {
      const orders = await Order.find({
        tenantId: req.tenantId,
      }).sort({ createdAt: -1 });
      const response = {
        success: true,
        data: orders,
      };
      res.json(response);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch orders',
      });
    }
  },
  validateResponse(OrdersResponseSchema),
);

// Get orders for a specific customer (New route)
router.get(
  '/customer/:customerId',
  auth,
  extractTenantId,
  async (req, res, next) => {
    try {
      const { customerId } = req.params;
      // Verify customer exists and belongs to this tenant
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
      const orders = await Order.find({
        tenantId: req.tenantId,
        customerId: customerId,
      }).sort({ createdAt: -1 });
      const response = {
        success: true,
        data: orders,
      };
      res.json(response);
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch customer orders',
      });
    }
  },
  validateResponse(OrdersResponseSchema),
);

// Create a new order for a customer
router.post(
  '/',
  auth,
  extractTenantId,
  validateBody(OrderCreateRequestSchema),
  async (req, res, next) => {
    try {
      const { customerId, orderId, details } = req.body;
      // Verify customer exists and belongs to this tenant
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
      // Check if order already exists for this tenant
      const existingOrder = await Order.findOne({
        tenantId: req.tenantId,
        orderId: orderId,
      });
      if (existingOrder) {
        return res.status(400).json({
          success: false,
          error: 'Order with this ID already exists',
        });
      }
      const order = new Order({
        tenantId: req.tenantId,
        customerId,
        orderId,
        details,
      });
      await order.save();
      const response = {
        success: true,
        data: order,
      };
      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create order',
      });
    }
  },
  validateResponse(OrderResponseSchema),
);

module.exports = router;
