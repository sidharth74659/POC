const WorkOrder = require('../models/workOrder.model');
const logger = require('../util/logger');

class WorkOrderService {
  async createWorkOrder(workOrderData, tenantId, createdBy) {
    try {
      const { workOrderId, title, description, priority, status, assignedTo, location, scheduledDate } = workOrderData;

      const workOrder = new WorkOrder({
        workOrderId,
        tenantId,
        title,
        description,
        priority: priority || 'medium',
        status: status || 'open',
        assignedTo,
        createdBy,
        location,
        scheduledDate
      });

      await workOrder.save();

      logger.info('Work order created', {
        workOrderId: workOrder.workOrderId,
        tenantId: workOrder.tenantId,
        createdBy
      });

      return workOrder;
    } catch (error) {
      logger.error('Failed to create work order', error);
      throw error;
    }
  }

  async getWorkOrdersByTenant(tenantId, filters = {}) {
    try {
      const query = { tenantId, ...filters };
      const workOrders = await WorkOrder.find(query).sort({ createdAt: -1 });
      return workOrders;
    } catch (error) {
      logger.error('Failed to get work orders by tenant', error, { tenantId });
      throw error;
    }
  }

  async getWorkOrderById(workOrderId, tenantId) {
    try {
      const workOrder = await WorkOrder.findOne({ workOrderId, tenantId });
      return workOrder;
    } catch (error) {
      logger.error('Failed to get work order', error, { workOrderId, tenantId });
      throw error;
    }
  }

  async updateWorkOrder(workOrderId, tenantId, updateData) {
    try {
      if (updateData.status === 'completed' && !updateData.completedDate) {
        updateData.completedDate = new Date();
      }

      const workOrder = await WorkOrder.findOneAndUpdate(
        { workOrderId, tenantId },
        { $set: updateData },
        { new: true, runValidators: true }
      );
      return workOrder;
    } catch (error) {
      logger.error('Failed to update work order', error, { workOrderId, tenantId });
      throw error;
    }
  }

  async deleteWorkOrder(workOrderId, tenantId) {
    try {
      const workOrder = await WorkOrder.findOneAndDelete({ workOrderId, tenantId });
      return workOrder;
    } catch (error) {
      logger.error('Failed to delete work order', error, { workOrderId, tenantId });
      throw error;
    }
  }
}

module.exports = new WorkOrderService();

