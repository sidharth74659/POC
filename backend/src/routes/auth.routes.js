const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const logger = require('../util/logger');

// Mock login endpoint (simulates Keycloak)
// In production, this would call Keycloak's token endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password, tenantId } = req.body;
    
    // Use tenantId from subdomain middleware first, then from body
    const resolvedTenantId = req.subdomainTenantId || tenantId;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    if (!resolvedTenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required. Please access via tenant subdomain or provide tenantId.'
      });
    }

    // Find user by email and tenantId
    const user = await User.findOne({ email, tenantId: resolvedTenantId, status: 'active' });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // In production, verify password with Keycloak
    // For POC, we'll just issue a JWT
    const token = jwt.sign(
      {
        tenant_id: user.tenantId,
        user_id: user.userId,
        roles: user.roles,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    logger.info('User logged in', {
      userId: user.userId,
      tenantId: user.tenantId,
      email: user.email
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          userId: user.userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.roles
        }
      }
    });
  } catch (error) {
    logger.error('Login error', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

