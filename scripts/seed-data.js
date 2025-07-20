const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, '..', 'data', 'inventory.db');

// Create database connection
const db = new sqlite3.Database(dbPath);

// Sample data arrays
const users = [
    { username: 'admin', email: 'admin@company.com', full_name: 'System Administrator', role: 'admin' },
    { username: 'john.doe', email: 'john.doe@company.com', full_name: 'John Doe', role: 'manager' },
    { username: 'jane.smith', email: 'jane.smith@company.com', full_name: 'Jane Smith', role: 'user' },
    { username: 'mike.wilson', email: 'mike.wilson@company.com', full_name: 'Mike Wilson', role: 'user' },
    { username: 'sarah.jones', email: 'sarah.jones@company.com', full_name: 'Sarah Jones', role: 'manager' },
    { username: 'david.brown', email: 'david.brown@company.com', full_name: 'David Brown', role: 'user' }
];

const locations = [
    { name: 'Main Warehouse', description: 'Primary storage facility', address: '123 Main St, City', capacity: 10000 },
    { name: 'North Branch', description: 'Northern distribution center', address: '456 North Ave, City', capacity: 5000 },
    { name: 'South Branch', description: 'Southern distribution center', address: '789 South Blvd, City', capacity: 3000 },
    { name: 'East Storage', description: 'Eastern storage facility', address: '321 East Rd, City', capacity: 2000 },
    { name: 'West Storage', description: 'Western storage facility', address: '654 West Ln, City', capacity: 1500 },
    { name: 'Central Hub', description: 'Central processing center', address: '987 Central Dr, City', capacity: 8000 }
];

const products = [
    { name: 'Laptop Dell XPS 13', sku: 'LAP-DELL-XPS13', description: '13-inch premium laptop', category: 'Electronics', unit_price: 1299.99, min_stock_level: 5, max_stock_level: 50 },
    { name: 'iPhone 15 Pro', sku: 'PHONE-IPHONE-15PRO', description: 'Latest iPhone model', category: 'Electronics', unit_price: 999.99, min_stock_level: 10, max_stock_level: 100 },
    { name: 'Office Chair Ergonomic', sku: 'FURN-CHAIR-ERG', description: 'Ergonomic office chair', category: 'Furniture', unit_price: 299.99, min_stock_level: 3, max_stock_level: 25 },
    { name: 'Coffee Maker Deluxe', sku: 'APPL-COFFEE-DELUXE', description: 'Premium coffee machine', category: 'Appliances', unit_price: 199.99, min_stock_level: 2, max_stock_level: 15 },
    { name: 'Wireless Headphones', sku: 'ELEC-HEADPHONES-WIRELESS', description: 'Noise-cancelling headphones', category: 'Electronics', unit_price: 249.99, min_stock_level: 8, max_stock_level: 40 },
    { name: 'Desk Lamp LED', sku: 'LIGHT-DESK-LED', description: 'LED desk lamp with dimmer', category: 'Lighting', unit_price: 89.99, min_stock_level: 4, max_stock_level: 30 },
    { name: 'Printer HP LaserJet', sku: 'OFFICE-PRINTER-HP', description: 'Laser printer for office use', category: 'Office Equipment', unit_price: 399.99, min_stock_level: 2, max_stock_level: 10 },
    { name: 'Monitor 27" 4K', sku: 'MONITOR-27-4K', description: '27-inch 4K monitor', category: 'Electronics', unit_price: 449.99, min_stock_level: 6, max_stock_level: 35 },
    { name: 'Filing Cabinet 4-Drawer', sku: 'FURN-CABINET-4DRAWER', description: 'Metal filing cabinet', category: 'Furniture', unit_price: 179.99, min_stock_level: 2, max_stock_level: 12 },
    { name: 'Microwave Oven', sku: 'APPL-MICROWAVE-STANDARD', description: 'Standard microwave oven', category: 'Appliances', unit_price: 129.99, min_stock_level: 3, max_stock_level: 20 },
    { name: 'USB-C Cable Pack', sku: 'CABLE-USB-C-PACK', description: 'Pack of 5 USB-C cables', category: 'Accessories', unit_price: 19.99, min_stock_level: 20, max_stock_level: 200 },
    { name: 'Mouse Wireless', sku: 'ACC-MOUSE-WIRELESS', description: 'Wireless computer mouse', category: 'Accessories', unit_price: 29.99, min_stock_level: 15, max_stock_level: 100 },
    { name: 'Keyboard Mechanical', sku: 'ACC-KEYBOARD-MECH', description: 'Mechanical gaming keyboard', category: 'Accessories', unit_price: 149.99, min_stock_level: 5, max_stock_level: 30 },
    { name: 'Webcam HD', sku: 'ACC-WEBCAM-HD', description: 'HD webcam for video calls', category: 'Accessories', unit_price: 79.99, min_stock_level: 10, max_stock_level: 50 },
    { name: 'Tablet Stand Adjustable', sku: 'ACC-TABLET-STAND', description: 'Adjustable tablet stand', category: 'Accessories', unit_price: 39.99, min_stock_level: 8, max_stock_level: 40 }
];

// Generate transactions with realistic patterns
const generateTransactions = () => {
    const transactions = [];
    const transactionTypes = ['inbound', 'outbound', 'adjustment'];
    const currentDate = new Date();
    
    // Generate transactions for the last 30 days
    for (let day = 30; day >= 0; day--) {
        const transactionDate = new Date(currentDate);
        transactionDate.setDate(currentDate.getDate() - day);
        
        // Generate 3-8 transactions per day
        const transactionsPerDay = Math.floor(Math.random() * 6) + 3;
        
        for (let i = 0; i < transactionsPerDay; i++) {
            const productId = Math.floor(Math.random() * products.length) + 1;
            const locationId = Math.floor(Math.random() * locations.length) + 1;
            const userId = Math.floor(Math.random() * users.length) + 1;
            const transactionType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
            
            // Generate realistic quantities
            let quantity;
            if (transactionType === 'inbound') {
                quantity = Math.floor(Math.random() * 20) + 5; // 5-25 units
            } else if (transactionType === 'outbound') {
                quantity = Math.floor(Math.random() * 10) + 1; // 1-10 units
            } else {
                quantity = Math.floor(Math.random() * 5) - 2; // -2 to +2 for adjustments
            }
            
            // Add some edge cases for testing
            let finalLocationId = locationId;
            if (Math.random() < 0.05) { // 5% chance of missing location
                finalLocationId = null;
            }
            
            transactions.push({
                product_id: productId,
                location_id: finalLocationId,
                user_id: userId,
                transaction_type: transactionType,
                quantity: quantity,
                unit_price: products[productId - 1].unit_price,
                reference_number: `REF-${day}-${i + 1}`,
                notes: `Sample transaction for testing`,
                transaction_date: transactionDate.toISOString()
            });
        }
    }
    
    return transactions;
};

const transactions = generateTransactions();

// Insert data function
const insertData = (tableName, data, callback) => {
    if (data.length === 0) {
        callback();
        return;
    }
    
    const columns = Object.keys(data[0]).join(', ');
    const placeholders = Object.keys(data[0]).map(() => '?').join(', ');
    const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    
    let inserted = 0;
    data.forEach((row, index) => {
        const values = Object.values(row);
        db.run(sql, values, function(err) {
            if (err) {
                console.error(`Error inserting into ${tableName}:`, err.message);
            } else {
                inserted++;
                if (inserted === data.length) {
                    console.log(`Inserted ${inserted} records into ${tableName}`);
                    callback();
                }
            }
        });
    });
};

// Main seeding function
const seedDatabase = () => {
    console.log('Starting database seeding...');
    
    // Insert users
    insertData('users', users, () => {
        // Insert locations
        insertData('locations', locations, () => {
            // Insert products
            insertData('products', products, () => {
                // Insert transactions
                insertData('transactions', transactions, () => {
                    console.log('Database seeding completed successfully!');
                    console.log(`Total records inserted:`);
                    console.log(`- Users: ${users.length}`);
                    console.log(`- Locations: ${locations.length}`);
                    console.log(`- Products: ${products.length}`);
                    console.log(`- Transactions: ${transactions.length}`);
                    
                    // Close database connection
                    db.close((err) => {
                        if (err) {
                            console.error('Error closing database:', err.message);
                        } else {
                            console.log('Database connection closed.');
                        }
                    });
                });
            });
        });
    });
};

// Start seeding
seedDatabase(); 