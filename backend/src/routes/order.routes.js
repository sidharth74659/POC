const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/', async (req, res) => {
  const tenantId = req.tenantId; // from subdomain
  const orders = await Order.find({ tenantId });
  res.json(orders);
});

module.exports = router;
