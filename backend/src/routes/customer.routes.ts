import express, { Request, Response } from 'express';
import Customer from '../models/Customer';

const router = express.Router();

interface CustomerRequest extends Request {
  user?: {
    id: string;
    tenantId: string;
    roles: string[];
  };
  tenantId?: string;
}

// Get all customers with pagination and search
router.get('/', async (req: CustomerRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search, isActive } = req.query;
    const tenantId = req.tenantId;
    
    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID required' });
    }

    const filter: any = { tenantId };
    if (isActive !== undefined) {
      filter.isActive = isActive;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'contact.email': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const customers = await Customer.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Customer.countDocuments(filter);

    res.json({
      success: true,
      data: customers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get customer by ID
router.get('/:id', async (req: CustomerRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;
    
    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID required' });
    }

    const customer = await Customer.findOne({ customerId: id, tenantId });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new customer
router.post('/', async (req: CustomerRequest, res: Response) => {
  try {
    const tenantId = req.tenantId;
    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID required' });
    }

    const customerId = `CUST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const customer = await Customer.create({
      ...req.body,
      tenantId,
      customerId,
    });

    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update customer
router.put('/:id', async (req: CustomerRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;
    
    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID required' });
    }

    const customer = await Customer.findOneAndUpdate(
      { customerId: id, tenantId },
      req.body,
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ success: true, data: customer });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete customer
router.delete('/:id', async (req: CustomerRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tenantId = req.tenantId;
    
    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant ID required' });
    }

    const customer = await Customer.findOneAndDelete({ customerId: id, tenantId });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ success: true, message: 'Customer deleted' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 