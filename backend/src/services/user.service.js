const User = require('../models/user.model');
const logger = require('../util/logger');

class UserService {
  async createUser(userData) {
    try {
      const { userId, tenantId, keycloakUserId, email, firstName, lastName, roles } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ userId });

      if (existingUser) {
        throw new Error('User with this ID already exists');
      }

      const user = new User({
        userId,
        tenantId,
        keycloakUserId,
        email,
        firstName,
        lastName,
        roles: roles || [],
        status: 'active'
      });

      await user.save();

      logger.info('User created', {
        userId: user.userId,
        tenantId: user.tenantId,
        email: user.email
      });

      return user;
    } catch (error) {
      logger.error('Failed to create user', error);
      throw error;
    }
  }

  async getUsersByTenant(tenantId) {
    try {
      const users = await User.find({ tenantId, status: 'active' });
      return users;
    } catch (error) {
      logger.error('Failed to get users by tenant', error, { tenantId });
      throw error;
    }
  }

  async getUserById(userId, tenantId) {
    try {
      const user = await User.findOne({ userId, tenantId });
      return user;
    } catch (error) {
      logger.error('Failed to get user', error, { userId, tenantId });
      throw error;
    }
  }

  async assignRole(userId, tenantId, role) {
    try {
      const user = await User.findOne({ userId, tenantId });

      if (!user) {
        throw new Error('User not found');
      }

      if (!user.roles.includes(role)) {
        user.roles.push(role);
        await user.save();
      }

      logger.info('Role assigned to user', {
        userId,
        tenantId,
        role
      });

      return user;
    } catch (error) {
      logger.error('Failed to assign role', error, { userId, tenantId, role });
      throw error;
    }
  }

  async removeRole(userId, tenantId, role) {
    try {
      const user = await User.findOne({ userId, tenantId });

      if (!user) {
        throw new Error('User not found');
      }

      user.roles = user.roles.filter(r => r !== role);
      await user.save();

      logger.info('Role removed from user', {
        userId,
        tenantId,
        role
      });

      return user;
    } catch (error) {
      logger.error('Failed to remove role', error, { userId, tenantId, role });
      throw error;
    }
  }
}

module.exports = new UserService();

