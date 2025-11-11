const userService = require('../../services/user.service');
const logger = require('../../util/logger');

class UsersController {
  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error('Create user error', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getUsers(req, res) {
    try {
      const { tenantId } = req;
      const users = await userService.getUsersByTenant(tenantId);
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      logger.error('Get users error', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getUser(req, res) {
    try {
      const { userId } = req.params;
      const { tenantId } = req;
      const user = await userService.getUserById(userId, tenantId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error('Get user error', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async assignRole(req, res) {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      const { tenantId } = req;

      if (!role) {
        return res.status(400).json({
          success: false,
          error: 'Role is required'
        });
      }

      const user = await userService.assignRole(userId, tenantId, role);
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      logger.error('Assign role error', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new UsersController();

