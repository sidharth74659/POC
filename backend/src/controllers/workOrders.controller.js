const workOrderService = require('../services/workOrder.service');
const logger = require('../util/logger');

class WorkOrdersController {
  async createWorkOrder(req, res) {
    try {
      const { tenantId, userId } = req;
      const workOrder = await workOrderService.createWorkOrder(req.body, tenantId, userId);
      res.status(201).json({
        success: true,
        data: workOrder
      });
    } catch (error) {
      logger.error('Create work order error', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getWorkOrders(req, res) {
    try {
      const { tenantId } = req;
      const { status, assignedTo } = req.query;
      const filters = {};
      if (status) filters.status = status;
      if (assignedTo) filters.assignedTo = assignedTo;

      const workOrders = await workOrderService.getWorkOrdersByTenant(tenantId, filters);
      res.json({
        success: true,
        data: workOrders
      });
    } catch (error) {
      logger.error('Get work orders error', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getWorkOrder(req, res) {
    try {
      const { workOrderId } = req.params;
      const { tenantId } = req;
      const workOrder = await workOrderService.getWorkOrderById(workOrderId, tenantId);

      if (!workOrder) {
        return res.status(404).json({
          success: false,
          error: 'Work order not found'
        });
      }

      res.json({
        success: true,
        data: workOrder
      });
    } catch (error) {
      logger.error('Get work order error', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateWorkOrder(req, res) {
    try {
      const { workOrderId } = req.params;
      const { tenantId } = req;
      const workOrder = await workOrderService.updateWorkOrder(workOrderId, tenantId, req.body);

      if (!workOrder) {
        return res.status(404).json({
          success: false,
          error: 'Work order not found'
        });
      }

      res.json({
        success: true,
        data: workOrder
      });
    } catch (error) {
      logger.error('Update work order error', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteWorkOrder(req, res) {
    try {
      const { workOrderId } = req.params;
      const { tenantId } = req;
      const workOrder = await workOrderService.deleteWorkOrder(workOrderId, tenantId);

      if (!workOrder) {
        return res.status(404).json({
          success: false,
          error: 'Work order not found'
        });
      }

      res.json({
        success: true,
        message: 'Work order deleted successfully'
      });
    } catch (error) {
      logger.error('Delete work order error', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new WorkOrdersController();

