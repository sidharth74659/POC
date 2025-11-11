require('dotenv').config();
const mongoose = require('mongoose');
const Tenant = require('../src/models/tenant.model');
const User = require('../src/models/user.model');
const Form = require('../src/models/form.model');
const WorkOrder = require('../src/models/workOrder.model');
const Role = require('../src/models/role.model');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out to keep existing data)
    // await Tenant.deleteMany({});
    // await User.deleteMany({});
    // await Form.deleteMany({});
    // await WorkOrder.deleteMany({});
    // await Role.deleteMany({});

    // Tenant 1
    const tenant1 = await Tenant.findOneAndUpdate(
      { tenantId: 'tenant1' },
      {
        tenantId: 'tenant1',
        name: 'Acme Corporation',
        subdomain: 'tenant1',
        status: 'active',
        metadata: { industry: 'Technology', plan: 'enterprise' }
      },
      { upsert: true, new: true }
    );
    console.log('✓ Tenant 1 created:', tenant1.tenantId);

    // Tenant 2
    const tenant2 = await Tenant.findOneAndUpdate(
      { tenantId: 'tenant2' },
      {
        tenantId: 'tenant2',
        name: 'Global Industries',
        subdomain: 'tenant2',
        status: 'active',
        metadata: { industry: 'Manufacturing', plan: 'professional' }
      },
      { upsert: true, new: true }
    );
    console.log('✓ Tenant 2 created:', tenant2.tenantId);

    // Tenant 3
    const tenant3 = await Tenant.findOneAndUpdate(
      { tenantId: 'tenant3' },
      {
        tenantId: 'tenant3',
        name: 'Startup Inc',
        subdomain: 'tenant3',
        status: 'active',
        metadata: { industry: 'Finance', plan: 'starter' }
      },
      { upsert: true, new: true }
    );
    console.log('✓ Tenant 3 created:', tenant3.tenantId);

    // Users for Tenant 1
    const user1_1 = await User.findOneAndUpdate(
      { userId: 'user-tenant1-001' },
      {
        userId: 'user-tenant1-001',
        tenantId: 'tenant1',
        keycloakUserId: 'kc-tenant1-001',
        email: 'admin@acme.com',
        firstName: 'John',
        lastName: 'Doe',
        roles: ['admin', 'manager'],
        status: 'active'
      },
      { upsert: true, new: true }
    );
    console.log('✓ User 1 for Tenant 1 created:', user1_1.email);

    const user1_2 = await User.findOneAndUpdate(
      { userId: 'user-tenant1-002' },
      {
        userId: 'user-tenant1-002',
        tenantId: 'tenant1',
        keycloakUserId: 'kc-tenant1-002',
        email: 'user@acme.com',
        firstName: 'Jane',
        lastName: 'Smith',
        roles: ['user'],
        status: 'active'
      },
      { upsert: true, new: true }
    );
    console.log('✓ User 2 for Tenant 1 created:', user1_2.email);

    // Users for Tenant 2
    const user2_1 = await User.findOneAndUpdate(
      { userId: 'user-tenant2-001' },
      {
        userId: 'user-tenant2-001',
        tenantId: 'tenant2',
        keycloakUserId: 'kc-tenant2-001',
        email: 'admin@global.com',
        firstName: 'Alice',
        lastName: 'Johnson',
        roles: ['admin'],
        status: 'active'
      },
      { upsert: true, new: true }
    );
    console.log('✓ User 1 for Tenant 2 created:', user2_1.email);

    // Users for Tenant 3
    const user3_1 = await User.findOneAndUpdate(
      { userId: 'user-tenant3-001' },
      {
        userId: 'user-tenant3-001',
        tenantId: 'tenant3',
        keycloakUserId: 'kc-tenant3-001',
        email: 'admin@startup.com',
        firstName: 'Bob',
        lastName: 'Williams',
        roles: ['admin', 'user'],
        status: 'active'
      },
      { upsert: true, new: true }
    );
    console.log('✓ User 1 for Tenant 3 created:', user3_1.email);

    // Forms for Tenant 1
    let form1_1 = await Form.findOne({ formId: 'form-tenant1-001' });
    if (!form1_1) {
      form1_1 = await Form.create({
        formId: 'form-tenant1-001',
        tenantId: 'tenant1',
        title: 'Customer Feedback Survey',
        description: 'Collect customer feedback on our products and services',
        fields: [
          { name: 'customerName', type: 'text', required: true, options: [] },
          { name: 'rating', type: 'number', required: true, options: [] },
          { name: 'comments', type: 'textarea', required: false, options: [] }
        ],
        status: 'published',
        createdBy: 'user-tenant1-001'
      });
    }
    console.log('✓ Form 1 for Tenant 1 created:', form1_1.title);

    let form1_2 = await Form.findOne({ formId: 'form-tenant1-002' });
    if (!form1_2) {
      form1_2 = await Form.create({
        formId: 'form-tenant1-002',
        tenantId: 'tenant1',
        title: 'Employee Onboarding Form',
        description: 'New employee information collection',
        fields: [
          { name: 'employeeName', type: 'text', required: true, options: [] },
          { name: 'department', type: 'select', required: true, options: ['IT', 'HR', 'Sales'] },
          { name: 'startDate', type: 'date', required: true, options: [] }
        ],
        status: 'published',
        createdBy: 'user-tenant1-001'
      });
    }
    console.log('✓ Form 2 for Tenant 1 created:', form1_2.title);

    // Forms for Tenant 2
    let form2_1 = await Form.findOne({ formId: 'form-tenant2-001' });
    if (!form2_1) {
      form2_1 = await Form.create({
        formId: 'form-tenant2-001',
        tenantId: 'tenant2',
        title: 'Quality Inspection Report',
        description: 'Manufacturing quality control form',
        fields: [
          { name: 'productId', type: 'text', required: true, options: [] },
          { name: 'inspectionDate', type: 'date', required: true, options: [] },
          { name: 'qualityScore', type: 'number', required: true, options: [] },
          { name: 'inspectorName', type: 'text', required: true, options: [] }
        ],
        status: 'published',
        createdBy: 'user-tenant2-001'
      });
    }
    console.log('✓ Form 1 for Tenant 2 created:', form2_1.title);

    // Forms for Tenant 3
    let form3_1 = await Form.findOne({ formId: 'form-tenant3-001' });
    if (!form3_1) {
      form3_1 = await Form.create({
        formId: 'form-tenant3-001',
        tenantId: 'tenant3',
        title: 'Loan Application Form',
        description: 'Customer loan application',
        fields: [
          { name: 'applicantName', type: 'text', required: true, options: [] },
          { name: 'loanAmount', type: 'number', required: true, options: [] },
          { name: 'purpose', type: 'text', required: true, options: [] },
          { name: 'employmentStatus', type: 'select', required: true, options: ['Employed', 'Self-employed', 'Unemployed'] }
        ],
        status: 'published',
        createdBy: 'user-tenant3-001'
      });
    }
    console.log('✓ Form 1 for Tenant 3 created:', form3_1.title);

    // Work Orders for Tenant 1
    const wo1_1 = await WorkOrder.findOneAndUpdate(
      { workOrderId: 'wo-tenant1-001' },
      {
        workOrderId: 'wo-tenant1-001',
        tenantId: 'tenant1',
        title: 'Server Room HVAC Maintenance',
        description: 'HVAC system in server room needs inspection and maintenance',
        priority: 'high',
        status: 'in-progress',
        assignedTo: 'user-tenant1-002',
        location: 'Building A, Server Room',
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        createdBy: 'user-tenant1-001'
      },
      { upsert: true, new: true }
    );
    console.log('✓ Work Order 1 for Tenant 1 created:', wo1_1.title);

    const wo1_2 = await WorkOrder.findOneAndUpdate(
      { workOrderId: 'wo-tenant1-002' },
      {
        workOrderId: 'wo-tenant1-002',
        tenantId: 'tenant1',
        title: 'Office Lighting Repair',
        description: 'Flickering lights in conference room B',
        priority: 'medium',
        status: 'open',
        location: 'Building A, Conference Room B',
        createdBy: 'user-tenant1-001'
      },
      { upsert: true, new: true }
    );
    console.log('✓ Work Order 2 for Tenant 1 created:', wo1_2.title);

    // Work Orders for Tenant 2
    const wo2_1 = await WorkOrder.findOneAndUpdate(
      { workOrderId: 'wo-tenant2-001' },
      {
        workOrderId: 'wo-tenant2-001',
        tenantId: 'tenant2',
        title: 'Production Line Machine Calibration',
        description: 'Calibrate machine #5 on production line B',
        priority: 'critical',
        status: 'open',
        assignedTo: 'user-tenant2-001',
        location: 'Factory Floor, Line B',
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        createdBy: 'user-tenant2-001'
      },
      { upsert: true, new: true }
    );
    console.log('✓ Work Order 1 for Tenant 2 created:', wo2_1.title);

    // Work Orders for Tenant 3
    const wo3_1 = await WorkOrder.findOneAndUpdate(
      { workOrderId: 'wo-tenant3-001' },
      {
        workOrderId: 'wo-tenant3-001',
        tenantId: 'tenant3',
        title: 'Office Printer Maintenance',
        description: 'Regular maintenance for office printers',
        priority: 'low',
        status: 'completed',
        location: 'Main Office',
        completedDate: new Date(),
        createdBy: 'user-tenant3-001'
      },
      { upsert: true, new: true }
    );
    console.log('✓ Work Order 1 for Tenant 3 created:', wo3_1.title);

    // Roles for each tenant
    const role1_1 = await Role.findOneAndUpdate(
      { roleId: 'role-tenant1-admin' },
      {
        roleId: 'role-tenant1-admin',
        tenantId: 'tenant1',
        name: 'Administrator',
        permissions: ['forms:create', 'forms:read', 'forms:update', 'forms:delete', 'workorders:create', 'workorders:read', 'workorders:update', 'users:manage'],
        description: 'Full administrative access'
      },
      { upsert: true, new: true }
    );
    console.log('✓ Role for Tenant 1 created:', role1_1.name);

    const role2_1 = await Role.findOneAndUpdate(
      { roleId: 'role-tenant2-admin' },
      {
        roleId: 'role-tenant2-admin',
        tenantId: 'tenant2',
        name: 'Administrator',
        permissions: ['forms:create', 'forms:read', 'workorders:create', 'workorders:read'],
        description: 'Administrative access'
      },
      { upsert: true, new: true }
    );
    console.log('✓ Role for Tenant 2 created:', role2_1.name);

    console.log('\n✅ Seed data created successfully!');
    console.log('\nTest Credentials:');
    console.log('Tenant 1 (tenant1):');
    console.log('  - admin@acme.com / password123');
    console.log('  - user@acme.com / password123');
    console.log('Tenant 2 (tenant2):');
    console.log('  - admin@global.com / password123');
    console.log('Tenant 3 (tenant3):');
    console.log('  - admin@startup.com / password123');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

