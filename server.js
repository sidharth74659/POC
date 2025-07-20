const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Database connection
const dbPath = path.join(__dirname, 'data', 'inventory.db');
const db = new sqlite3.Database(dbPath);

// Predefined queries with different complexity levels
const predefinedQueries = {
    // Simple queries
    'current_stock': {
        name: 'Current Stock Per Product',
        description: 'Get total stock per product with status indicators',
        sql: `SELECT 
                product_name,
                sku,
                category,
                current_quantity,
                min_stock_level,
                stock_status
            FROM current_stock
            ORDER BY current_quantity DESC`,
        complexity: 'simple'
    },
    
    'products_by_location': {
        name: 'Products by Location',
        description: 'List all products with their current locations',
        sql: `SELECT 
                p.name as product_name,
                p.sku,
                l.name as location_name,
                COALESCE(SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END), 0) as quantity_at_location
            FROM products p
            LEFT JOIN transactions t ON p.id = t.product_id
            LEFT JOIN locations l ON t.location_id = l.id
            WHERE p.status = 'active'
            GROUP BY p.id, p.name, p.sku, l.name
            HAVING quantity_at_location > 0
            ORDER BY p.name, l.name`,
        complexity: 'simple'
    },
    
    'products_by_status': {
        name: 'Products by Status',
        description: 'Count products by status (active/inactive)',
        sql: `SELECT 
                status,
                COUNT(*) as product_count
            FROM products
            GROUP BY status
            ORDER BY product_count DESC`,
        complexity: 'simple'
    },
    
    // Medium complexity queries
    'recent_movements': {
        name: 'Recent Movements (Last 7 Days)',
        description: 'List assets moved in the last 7 days by user and location',
        sql: `SELECT 
                p.name as product_name,
                p.sku,
                t.transaction_type,
                t.quantity,
                u.full_name as user_name,
                l.name as location_name,
                t.transaction_date,
                t.reference_number
            FROM transactions t
            JOIN products p ON t.product_id = p.id
            JOIN users u ON t.user_id = u.id
            LEFT JOIN locations l ON t.location_id = l.id
            WHERE t.transaction_date >= datetime('now', '-7 days')
            ORDER BY t.transaction_date DESC`,
        complexity: 'medium'
    },
    
    'low_stock_products': {
        name: 'Low Stock Products',
        description: 'Find products with stock below minimum threshold',
        sql: `SELECT 
                product_name,
                sku,
                category,
                current_quantity,
                min_stock_level,
                (min_stock_level - current_quantity) as shortage
            FROM current_stock
            WHERE current_quantity < min_stock_level
            ORDER BY shortage DESC`,
        complexity: 'medium'
    },
    
    'transaction_history': {
        name: 'Transaction History by Product',
        description: 'Show transaction history for a specific product',
        sql: `SELECT 
                p.name as product_name,
                t.transaction_type,
                t.quantity,
                t.unit_price,
                u.full_name as user_name,
                l.name as location_name,
                t.transaction_date,
                t.reference_number,
                t.notes
            FROM transactions t
            JOIN products p ON t.product_id = p.id
            JOIN users u ON t.user_id = u.id
            LEFT JOIN locations l ON t.location_id = l.id
            WHERE p.sku = 'LAP-DELL-XPS13'
            ORDER BY t.transaction_date DESC
            LIMIT 20`,
        complexity: 'medium'
    },
    
    // Complex queries
    'negative_stock_detection': {
        name: 'Negative Stock Detection',
        description: 'Detect assets with negative stock or inactive → active status flips',
        sql: `SELECT 
                product_name,
                sku,
                current_quantity,
                stock_status,
                CASE 
                    WHEN current_quantity < 0 THEN 'NEGATIVE_STOCK'
                    WHEN stock_status = 'low_stock' THEN 'LOW_STOCK'
                    ELSE 'NORMAL'
                END as alert_type
            FROM current_stock
            WHERE current_quantity < 0 OR stock_status = 'low_stock'
            ORDER BY current_quantity ASC`,
        complexity: 'complex'
    },
    
    'monthly_stock_changes': {
        name: 'Monthly Stock Changes',
        description: 'Calculate stock changes over time with trends',
        sql: `SELECT 
                p.name as product_name,
                p.sku,
                strftime('%Y-%m', t.transaction_date) as month,
                SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END) as total_inbound,
                SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END) as total_outbound,
                SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END) - 
                SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END) as net_change
            FROM products p
            LEFT JOIN transactions t ON p.id = t.product_id
            WHERE t.transaction_date >= datetime('now', '-3 months')
            GROUP BY p.id, p.name, p.sku, strftime('%Y-%m', t.transaction_date)
            ORDER BY p.name, month DESC`,
        complexity: 'complex'
    },
    
    'location_capacity_analysis': {
        name: 'Location Capacity Analysis',
        description: 'Multi-table joins with aggregation for location analysis',
        sql: `SELECT 
                l.name as location_name,
                l.capacity,
                COUNT(DISTINCT t.product_id) as unique_products,
                SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END) -
                SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END) as total_stock,
                ROUND(
                    (SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END) -
                     SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END)) * 100.0 / l.capacity, 2
                ) as capacity_utilization_percent
            FROM locations l
            LEFT JOIN transactions t ON l.id = t.location_id
            WHERE l.status = 'active'
            GROUP BY l.id, l.name, l.capacity
            ORDER BY capacity_utilization_percent DESC`,
        complexity: 'complex'
    },
    
    // Edge cases and data validation
    'missing_location_transactions': {
        name: 'Transactions Missing Location IDs',
        description: 'Flag transactions missing location IDs or timestamps',
        sql: `SELECT 
                t.id as transaction_id,
                p.name as product_name,
                t.transaction_type,
                t.quantity,
                u.full_name as user_name,
                t.transaction_date,
                CASE 
                    WHEN t.location_id IS NULL THEN 'MISSING_LOCATION'
                    WHEN t.transaction_date IS NULL THEN 'MISSING_TIMESTAMP'
                    ELSE 'VALID'
                END as validation_status
            FROM transactions t
            JOIN products p ON t.product_id = p.id
            JOIN users u ON t.user_id = u.id
            WHERE t.location_id IS NULL OR t.transaction_date IS NULL
            ORDER BY t.transaction_date DESC`,
        complexity: 'edge'
    },
    
    'data_integrity_check': {
        name: 'Data Integrity Validation',
        description: 'Validate data integrity constraints and handle NULL values',
        sql: `SELECT 
                'products' as table_name,
                COUNT(*) as total_records,
                COUNT(CASE WHEN name IS NULL OR name = '' THEN 1 END) as missing_names,
                COUNT(CASE WHEN sku IS NULL OR sku = '' THEN 1 END) as missing_skus,
                COUNT(CASE WHEN status IS NULL THEN 1 END) as missing_status
            FROM products
            UNION ALL
            SELECT 
                'transactions' as table_name,
                COUNT(*) as total_records,
                COUNT(CASE WHEN product_id IS NULL THEN 1 END) as missing_product_id,
                COUNT(CASE WHEN user_id IS NULL THEN 1 END) as missing_user_id,
                COUNT(CASE WHEN transaction_type IS NULL THEN 1 END) as missing_type
            FROM transactions`,
        complexity: 'edge'
    },
    
    // Optional advanced features
    'pivoted_stock_report': {
        name: 'Pivoted Stock Report per Location per Month',
        description: 'Generate pivoted stock report per location per month',
        sql: `SELECT 
                p.name as product_name,
                p.sku,
                strftime('%Y-%m', t.transaction_date) as month,
                l.name as location_name,
                SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END) -
                SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END) as stock_at_location
            FROM products p
            LEFT JOIN transactions t ON p.id = t.product_id
            LEFT JOIN locations l ON t.location_id = l.id
            WHERE t.transaction_date >= datetime('now', '-6 months')
            GROUP BY p.id, p.name, p.sku, strftime('%Y-%m', t.transaction_date), l.name
            HAVING stock_at_location > 0
            ORDER BY p.name, month DESC, l.name`,
        complexity: 'advanced'
    }
};

// API Routes

// Get all predefined queries
app.get('/api/queries', (req, res) => {
    const queries = Object.keys(predefinedQueries).map(key => ({
        id: key,
        ...predefinedQueries[key]
    }));
    res.json(queries);
});

// Execute predefined query
app.get('/api/queries/:queryId', (req, res) => {
    const queryId = req.params.queryId;
    const query = predefinedQueries[queryId];
    
    if (!query) {
        return res.status(404).json({ error: 'Query not found' });
    }
    
    db.all(query.sql, [], (err, rows) => {
        if (err) {
            console.error('Query execution error:', err);
            return res.status(500).json({ error: err.message });
        }
        
        res.json({
            query: query,
            results: rows,
            rowCount: rows.length
        });
    });
});

// Execute custom SQL
app.post('/api/execute', (req, res) => {
    const { sql } = req.body;
    
    if (!sql) {
        return res.status(400).json({ error: 'SQL query is required' });
    }
    
    // Basic SQL injection protection (in production, use proper parameterized queries)
    const dangerousKeywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'CREATE', 'ALTER'];
    const hasDangerousKeyword = dangerousKeywords.some(keyword => 
        sql.toUpperCase().includes(keyword)
    );
    
    if (hasDangerousKeyword) {
        return res.status(400).json({ 
            error: 'Query contains potentially dangerous operations. Only SELECT queries are allowed.' 
        });
    }
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Custom query execution error:', err);
            return res.status(500).json({ error: err.message });
        }
        
        res.json({
            sql: sql,
            results: rows,
            rowCount: rows.length
        });
    });
});

// Get database schema information
app.get('/api/schema', (req, res) => {
    const schemaQueries = [
        "SELECT name FROM sqlite_master WHERE type='table'",
        "PRAGMA table_info(users)",
        "PRAGMA table_info(products)",
        "PRAGMA table_info(locations)",
        "PRAGMA table_info(transactions)",
        "PRAGMA table_info(logs)"
    ];
    
    const schema = {};
    let completed = 0;
    
    schemaQueries.forEach((query, index) => {
        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Schema query error:', err);
            } else {
                if (index === 0) {
                    schema.tables = rows.map(row => row.name);
                } else {
                    const tableName = query.match(/table_info\((\w+)\)/)[1];
                    schema[tableName] = rows;
                }
            }
            
            completed++;
            if (completed === schemaQueries.length) {
                res.json(schema);
            }
        });
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    db.get('SELECT 1 as health', [], (err, row) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        res.json({ status: 'healthy', database: 'connected' });
    });
});

// Serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Inventory Management System running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
}); 