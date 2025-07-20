const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, '..', 'data', 'inventory.db');

// Ensure data directory exists
const fs = require('fs');
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(dbPath);

// SQL statements for table creation
const createTables = [
    // Users table
    `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    // Locations table
    `CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        address TEXT,
        capacity INTEGER,
        status VARCHAR(20) DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,

    // Products/Assets table
    `CREATE TABLE IF NOT EXISTS products (
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
    )`,

    // Transactions table (movements, adjustments, status changes)
    `CREATE TABLE IF NOT EXISTS transactions (
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
    )`,

    // Logs table for audit trail
    `CREATE TABLE IF NOT EXISTS logs (
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
    )`,

    // Current stock view (computed)
    `CREATE VIEW IF NOT EXISTS current_stock AS
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
        GROUP BY p.id, p.name, p.sku, p.category, p.min_stock_level, p.max_stock_level, p.status`
];

// Create indexes for better performance
const createIndexes = [
    `CREATE INDEX IF NOT EXISTS idx_transactions_product_id ON transactions(product_id)`,
    `CREATE INDEX IF NOT EXISTS idx_transactions_location_id ON transactions(location_id)`,
    `CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date)`,
    `CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type)`,
    `CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku)`,
    `CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`,
    `CREATE INDEX IF NOT EXISTS idx_products_status ON products(status)`
];

// Execute table creation
db.serialize(() => {
    console.log('Creating database tables...');
    
    createTables.forEach((sql, index) => {
        db.run(sql, (err) => {
            if (err) {
                console.error(`Error creating table ${index + 1}:`, err.message);
            } else {
                console.log(`Table ${index + 1} created successfully`);
            }
        });
    });

    // Create indexes after tables
    setTimeout(() => {
        console.log('Creating indexes...');
        createIndexes.forEach((sql, index) => {
            db.run(sql, (err) => {
                if (err) {
                    console.error(`Error creating index ${index + 1}:`, err.message);
                } else {
                    console.log(`Index ${index + 1} created successfully`);
                }
            });
        });

        // Close database connection
        setTimeout(() => {
            db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err.message);
                } else {
                    console.log('Database initialization completed successfully!');
                    console.log(`Database file: ${dbPath}`);
                }
            });
        }, 1000);
    }, 2000);
}); 