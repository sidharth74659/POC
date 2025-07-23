// routes/orders.js
router.get('/', async (req, res) => {
  const tenantId = req.tenantId; // from subdomain
  const orders = await Order.find({ tenantId });
  res.json(orders);
});
