import express, { Request, Response } from 'express';
import Order from '../models/Order';
import Customer from '../models/Customer';

const router = express.Router();

interface OrderRequest extends Request {
  user?: {
    id: string;
    tenantId: string;
    roles: string[];
  };
  tenantId?: string;
}

// Get all orders with pagination and filters
router.get('/', async (req: OrderRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      customerId,
      status,
      startDate,
      endDate,
    } = req.query;
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID required' });
    }

    const filter: any = { tenantId };
    if (customerId) {
      filter.customerId = customerId;
    }
    if (status) {
      filter.status = status;
    }
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate as string);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate as string);
      }
    }

    const skip = (Number(page) - 1) * Number(limit);
    const orders = await Order.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get order by ID
router.get('/:id', async (req: OrderRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID required' });
    }

    const order = await Order.findOne({ orderId: id, tenantId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new order
router.post('/', async (req: OrderRequest, res: Response) => {
  try {
    const tenantId = req.tenantId;
    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID required' });
    }

    // Verify customer exists
    const customer = await Customer.findOne({
      customerId: req.body.customerId,
      tenantId,
    });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const order = await Order.create({
      ...req.body,
      tenantId,
      orderId,
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update order
router.put('/:id', async (req: OrderRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID required' });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: id, tenantId },
      req.body,
      { new: true },
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete order
router.delete('/:id', async (req: OrderRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID required' });
    }

    const order = await Order.findOneAndDelete({ orderId: id, tenantId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
