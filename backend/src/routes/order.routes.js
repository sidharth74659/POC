const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middlewares/auth');

router.get('/', auth, async (req, res) => {
  const tenantId = req.tenantId;
  const orders = await Order.find({ tenantId });
  res.json(orders);
});

router.post('/', auth, async (req, res) => {
  const { product, quantity, price } = req.body;
  const tenantId = req.tenantId;
  const roles = req.user.roles || [];
  if (
    !roles.includes('admin') &&
    !roles.includes('agent') &&
    !roles.includes('customer')
  ) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const order = await Order.create({
    tenantId,
    product,
    quantity,
    price,
  });
  res.status(201).json(order);
});

module.exports = router;
