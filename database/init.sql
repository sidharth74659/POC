-- Inventory Asset Management System - SQL-Only Implementation
-- All DDL, DML, and logic in standard SQL

-- =====================================================
-- DATABASE SCHEMA CREATION
-- =====================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    address TEXT,
    capacity INTEGER,
    status VARCHAR(20) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50),
    unit_price DECIMAL(10,2) DEFAULT 0.00,
    min_stock_level INTEGER DEFAULT 0,
    max_stock_level INTEGER,
    status VARCHAR(20) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    location_id INTEGER,
    user_id INTEGER NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- 'inbound', 'outbound', 'adjustment', 'transfer'
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2),
    reference_number VARCHAR(50),
    notes TEXT,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (location_id) REFERENCES locations(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Logs table for audit trail
CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(50),
    record_id INTEGER,
    old_values TEXT,
    new_values TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_transactions_product_id ON transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_transactions_location_id ON transactions(location_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

-- =====================================================
-- COMPUTED VIEWS FOR COMPLEX LOGIC
-- =====================================================

-- Current stock view with real-time calculations
CREATE VIEW IF NOT EXISTS current_stock AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.sku,
    p.category,
    COALESCE(SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END), 0) -
    COALESCE(SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END), 0) as current_quantity,
    p.min_stock_level,
    p.max_stock_level,
    p.status as product_status,
    CASE 
        WHEN COALESCE(SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END), 0) -
             COALESCE(SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END), 0) < p.min_stock_level 
        THEN 'low_stock'
        WHEN COALESCE(SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END), 0) -
             COALESCE(SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END), 0) < 0 
        THEN 'negative_stock'
        ELSE 'normal'
    END as stock_status
FROM products p
LEFT JOIN transactions t ON p.id = t.product_id
WHERE p.status = 'active'
GROUP BY p.id, p.name, p.sku, p.category, p.min_stock_level, p.max_stock_level, p.status;

-- =====================================================
-- SAMPLE DATA INSERTION (STATIC SQL ONLY)
-- =====================================================

-- Insert Users
INSERT INTO users (username, email, full_name, role) VALUES
('admin', 'admin@company.com', 'System Administrator', 'admin'),
('john.doe', 'john.doe@company.com', 'John Doe', 'manager'),
('jane.smith', 'jane.smith@company.com', 'Jane Smith', 'user'),
('mike.wilson', 'mike.wilson@company.com', 'Mike Wilson', 'user'),
('sarah.jones', 'sarah.jones@company.com', 'Sarah Jones', 'manager'),
('david.brown', 'david.brown@company.com', 'David Brown', 'user');

-- Insert Locations
INSERT INTO locations (name, description, address, capacity) VALUES
('Main Warehouse', 'Primary storage facility', '123 Main St, City', 10000),
('North Branch', 'Northern distribution center', '456 North Ave, City', 5000),
('South Branch', 'Southern distribution center', '789 South Blvd, City', 3000),
('East Storage', 'Eastern storage facility', '321 East Rd, City', 2000),
('West Storage', 'Western storage facility', '654 West Ln, City', 1500),
('Central Hub', 'Central processing center', '987 Central Dr, City', 8000);

-- Insert Products
INSERT INTO products (name, sku, description, category, unit_price, min_stock_level, max_stock_level) VALUES
('Laptop Dell XPS 13', 'LAP-DELL-XPS13', '13-inch premium laptop', 'Electronics', 1299.99, 5, 50),
('iPhone 15 Pro', 'PHONE-IPHONE-15PRO', 'Latest iPhone model', 'Electronics', 999.99, 10, 100),
('Office Chair Ergonomic', 'FURN-CHAIR-ERG', 'Ergonomic office chair', 'Furniture', 299.99, 3, 25),
('Coffee Maker Deluxe', 'APPL-COFFEE-DELUXE', 'Premium coffee machine', 'Appliances', 199.99, 2, 15),
('Wireless Headphones', 'ELEC-HEADPHONES-WIRELESS', 'Noise-cancelling headphones', 'Electronics', 249.99, 8, 40),
('Desk Lamp LED', 'LIGHT-DESK-LED', 'LED desk lamp with dimmer', 'Lighting', 89.99, 4, 30),
('Printer HP LaserJet', 'OFFICE-PRINTER-HP', 'Laser printer for office use', 'Office Equipment', 399.99, 2, 10),
('Monitor 27" 4K', 'MONITOR-27-4K', '27-inch 4K monitor', 'Electronics', 449.99, 6, 35),
('Filing Cabinet 4-Drawer', 'FURN-CABINET-4DRAWER', 'Metal filing cabinet', 'Furniture', 179.99, 2, 12),
('Microwave Oven', 'APPL-MICROWAVE-STANDARD', 'Standard microwave oven', 'Appliances', 129.99, 3, 20),
('USB-C Cable Pack', 'CABLE-USB-C-PACK', 'Pack of 5 USB-C cables', 'Accessories', 19.99, 20, 200),
('Mouse Wireless', 'ACC-MOUSE-WIRELESS', 'Wireless computer mouse', 'Accessories', 29.99, 15, 100),
('Keyboard Mechanical', 'ACC-KEYBOARD-MECH', 'Mechanical gaming keyboard', 'Accessories', 149.99, 5, 30),
('Webcam HD', 'ACC-WEBCAM-HD', 'HD webcam for video calls', 'Accessories', 79.99, 10, 50),
('Tablet Stand Adjustable', 'ACC-TABLET-STAND', 'Adjustable tablet stand', 'Accessories', 39.99, 8, 40);

-- Insert Transactions (with realistic patterns and edge cases)
INSERT INTO transactions (product_id, location_id, user_id, transaction_type, quantity, unit_price, reference_number, notes, transaction_date) VALUES
-- Recent transactions (last 7 days)
(1, 1, 2, 'inbound', 15, 1299.99, 'REF-001', 'New stock arrival', datetime('now', '-2 days')),
(2, 1, 3, 'inbound', 25, 999.99, 'REF-002', 'iPhone shipment', datetime('now', '-3 days')),
(3, 2, 4, 'inbound', 8, 299.99, 'REF-003', 'Furniture delivery', datetime('now', '-1 days')),
(1, 1, 2, 'outbound', 3, 1299.99, 'REF-004', 'Sales order', datetime('now', '-1 days')),
(2, 1, 3, 'outbound', 5, 999.99, 'REF-005', 'Customer order', datetime('now', '-2 days')),
(4, 3, 5, 'inbound', 12, 199.99, 'REF-006', 'Appliance restock', datetime('now', '-4 days')),
(5, 1, 2, 'inbound', 20, 249.99, 'REF-007', 'Electronics shipment', datetime('now', '-5 days')),
(6, 2, 4, 'inbound', 15, 89.99, 'REF-008', 'Lighting restock', datetime('now', '-6 days')),
(7, 1, 3, 'inbound', 5, 399.99, 'REF-009', 'Office equipment', datetime('now', '-7 days')),
(8, 1, 2, 'inbound', 10, 449.99, 'REF-010', 'Monitor shipment', datetime('now', '-3 days')),

-- Older transactions (creating realistic patterns)
(1, 1, 2, 'inbound', 20, 1299.99, 'REF-011', 'Initial stock', datetime('now', '-15 days')),
(1, 1, 3, 'outbound', 8, 1299.99, 'REF-012', 'Sales', datetime('now', '-14 days')),
(2, 1, 4, 'inbound', 30, 999.99, 'REF-013', 'Bulk order', datetime('now', '-20 days')),
(2, 1, 2, 'outbound', 12, 999.99, 'REF-014', 'Customer orders', datetime('now', '-18 days')),
(3, 2, 5, 'inbound', 10, 299.99, 'REF-015', 'Furniture delivery', datetime('now', '-25 days')),
(3, 2, 3, 'outbound', 4, 299.99, 'REF-016', 'Office setup', datetime('now', '-22 days')),
(4, 3, 2, 'inbound', 8, 199.99, 'REF-017', 'Appliance restock', datetime('now', '-30 days')),
(4, 3, 4, 'outbound', 3, 199.99, 'REF-018', 'Kitchen equipment', datetime('now', '-28 days')),
(5, 1, 3, 'inbound', 25, 249.99, 'REF-019', 'Electronics shipment', datetime('now', '-35 days')),
(5, 1, 2, 'outbound', 10, 249.99, 'REF-020', 'Audio equipment', datetime('now', '-32 days')),

-- Edge cases for testing
(11, NULL, 2, 'inbound', 50, 19.99, 'REF-021', 'Missing location test', datetime('now', '-10 days')),
(12, 1, 3, 'inbound', 30, 29.99, 'REF-022', 'Mouse restock', datetime('now', '-12 days')),
(13, 2, 4, 'inbound', 8, 149.99, 'REF-023', 'Keyboard shipment', datetime('now', '-8 days')),
(14, 1, 5, 'inbound', 15, 79.99, 'REF-024', 'Webcam delivery', datetime('now', '-9 days')),
(15, 3, 2, 'inbound', 20, 39.99, 'REF-025', 'Accessories restock', datetime('now', '-11 days')),

-- Transactions creating negative stock scenarios
(11, 1, 3, 'outbound', 25, 19.99, 'REF-026', 'Large order', datetime('now', '-5 days')),
(11, 1, 2, 'outbound', 30, 19.99, 'REF-027', 'Bulk sale', datetime('now', '-3 days')),
(12, 1, 4, 'outbound', 20, 29.99, 'REF-028', 'Mouse orders', datetime('now', '-4 days')),
(12, 1, 3, 'outbound', 15, 29.99, 'REF-029', 'Additional orders', datetime('now', '-2 days')),

-- Adjustment transactions
(1, 1, 2, 'adjustment', -2, 1299.99, 'REF-030', 'Damage adjustment', datetime('now', '-6 days')),
(2, 1, 3, 'adjustment', 1, 999.99, 'REF-031', 'Found item', datetime('now', '-7 days')),
(3, 2, 4, 'adjustment', -1, 299.99, 'REF-032', 'Return adjustment', datetime('now', '-8 days')),

-- More realistic transaction patterns
(6, 2, 5, 'inbound', 25, 89.99, 'REF-033', 'Lighting restock', datetime('now', '-40 days')),
(6, 2, 2, 'outbound', 8, 89.99, 'REF-034', 'Office lighting', datetime('now', '-35 days')),
(7, 1, 3, 'inbound', 6, 399.99, 'REF-035', 'Printer shipment', datetime('now', '-45 days')),
(7, 1, 4, 'outbound', 2, 399.99, 'REF-036', 'Office setup', datetime('now', '-40 days')),
(8, 1, 5, 'inbound', 12, 449.99, 'REF-037', 'Monitor delivery', datetime('now', '-50 days')),
(8, 1, 2, 'outbound', 4, 449.99, 'REF-038', 'Workstation setup', datetime('now', '-45 days')),
(9, 2, 3, 'inbound', 8, 179.99, 'REF-039', 'Furniture delivery', datetime('now', '-55 days')),
(9, 2, 4, 'outbound', 3, 179.99, 'REF-040', 'Storage setup', datetime('now', '-50 days')),
(10, 3, 5, 'inbound', 15, 129.99, 'REF-041', 'Appliance restock', datetime('now', '-60 days')),
(10, 3, 2, 'outbound', 6, 129.99, 'REF-042', 'Kitchen equipment', datetime('now', '-55 days'));

-- Insert some audit logs
INSERT INTO logs (user_id, action, table_name, record_id, old_values, new_values) VALUES
(2, 'INSERT', 'transactions', 1, NULL, '{"product_id": 1, "quantity": 15}'),
(3, 'INSERT', 'transactions', 2, NULL, '{"product_id": 2, "quantity": 25}'),
(4, 'INSERT', 'transactions', 3, NULL, '{"product_id": 3, "quantity": 8}'),
(2, 'UPDATE', 'products', 1, '{"min_stock_level": 3}', '{"min_stock_level": 5}'),
(3, 'UPDATE', 'products', 2, '{"max_stock_level": 50}', '{"max_stock_level": 100}');

-- =====================================================
-- PREDEFINED QUERIES FOR TESTING
-- =====================================================

-- Query 1: Current Stock Per Product (Simple)
-- SELECT product_name, sku, category, current_quantity, stock_status FROM current_stock ORDER BY current_quantity DESC;

-- Query 2: Products by Location (Simple)
-- SELECT p.name as product_name, p.sku, l.name as location_name,
--        COALESCE(SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END), 0) -
--        COALESCE(SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END), 0) as quantity_at_location
-- FROM products p
-- LEFT JOIN transactions t ON p.id = t.product_id
-- LEFT JOIN locations l ON t.location_id = l.id
-- WHERE p.status = 'active'
-- GROUP BY p.id, p.name, p.sku, l.name
-- HAVING quantity_at_location > 0
-- ORDER BY p.name, l.name;

-- Query 3: Recent Movements (Medium)
-- SELECT p.name as product_name, p.sku, t.transaction_type, t.quantity,
--        u.full_name as user_name, l.name as location_name, t.transaction_date
-- FROM transactions t
-- JOIN products p ON t.product_id = p.id
-- JOIN users u ON t.user_id = u.id
-- LEFT JOIN locations l ON t.location_id = l.id
-- WHERE t.transaction_date >= datetime('now', '-7 days')
-- ORDER BY t.transaction_date DESC;

-- Query 4: Negative Stock Detection (Complex)
-- SELECT product_name, sku, current_quantity, stock_status,
--        CASE WHEN current_quantity < 0 THEN 'NEGATIVE_STOCK' 
--             WHEN stock_status = 'low_stock' THEN 'LOW_STOCK' 
--             ELSE 'NORMAL' END as alert_type
-- FROM current_stock
-- WHERE current_quantity < 0 OR stock_status = 'low_stock'
-- ORDER BY current_quantity ASC;

-- Query 5: Missing Location Transactions (Edge Case)
-- SELECT t.id as transaction_id, p.name as product_name, t.transaction_type,
--        t.quantity, u.full_name as user_name, t.transaction_date,
--        CASE WHEN t.location_id IS NULL THEN 'MISSING_LOCATION'
--             WHEN t.transaction_date IS NULL THEN 'MISSING_TIMESTAMP'
--             ELSE 'VALID' END as validation_status
-- FROM transactions t
-- JOIN products p ON t.product_id = p.id
-- JOIN users u ON t.user_id = u.id
-- WHERE t.location_id IS NULL OR t.transaction_date IS NULL
-- ORDER BY t.transaction_date DESC; 