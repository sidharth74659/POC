# AI Reference Guide - Inventory Asset Management System

## Database Schema & Relationships

### Core Tables

#### 1. Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. Locations Table
```sql
CREATE TABLE locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    address TEXT,
    capacity INTEGER,
    status VARCHAR(20) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. Products Table
```sql
CREATE TABLE products (
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
```

#### 4. Transactions Table
```sql
CREATE TABLE transactions (
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
```

#### 5. Logs Table
```sql
CREATE TABLE logs (
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
```

### Computed Views

#### Current Stock View
```sql
CREATE VIEW current_stock AS
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
GROUP BY p.id, p.name, p.sku, p.category, p.min_stock_level, p.max_stock_level, p.status
```

## Available Query APIs

### Simple Queries

#### 1. Current Stock Per Product
- **Purpose**: Get total stock per product with status indicators
- **Logic**: Sum inbound transactions minus outbound transactions per product
- **Sample Logic**: `SUM(inbound_quantity) - SUM(outbound_quantity) per product_id`
- **Expected Output**: product_name, sku, category, current_quantity, stock_status

#### 2. Products by Location
- **Purpose**: List all products with their current locations
- **Logic**: Join products with transactions and locations, group by product and location
- **Sample Logic**: `GROUP BY product_id, location_id HAVING quantity > 0`
- **Expected Output**: product_name, sku, location_name, quantity_at_location

#### 3. Products by Status
- **Purpose**: Count products by status (active/inactive)
- **Logic**: Simple GROUP BY on status column
- **Sample Logic**: `GROUP BY status COUNT(*)`
- **Expected Output**: status, product_count

### Medium Complexity Queries

#### 4. Recent Movements (Last 7 Days)
- **Purpose**: List assets moved in the last 7 days by user and location
- **Logic**: Filter transactions by date range, join with users and locations
- **Sample Logic**: `WHERE transaction_date >= datetime('now', '-7 days')`
- **Expected Output**: product_name, transaction_type, quantity, user_name, location_name, transaction_date

#### 5. Low Stock Products
- **Purpose**: Find products with stock below minimum threshold
- **Logic**: Compare current quantity with min_stock_level
- **Sample Logic**: `WHERE current_quantity < min_stock_level`
- **Expected Output**: product_name, sku, current_quantity, min_stock_level, shortage

#### 6. Transaction History by Product
- **Purpose**: Show transaction history for a specific product
- **Logic**: Filter transactions by product_id, order by date
- **Sample Logic**: `WHERE product_id = ? ORDER BY transaction_date DESC`
- **Expected Output**: product_name, transaction_type, quantity, user_name, location_name, transaction_date

### Complex Queries

#### 7. Negative Stock Detection
- **Purpose**: Detect assets with negative stock or status issues
- **Logic**: Complex CASE statements with multiple conditions
- **Sample Logic**: `CASE WHEN current_quantity < 0 THEN 'NEGATIVE_STOCK' WHEN stock_status = 'low_stock' THEN 'LOW_STOCK' ELSE 'NORMAL' END`
- **Expected Output**: product_name, sku, current_quantity, stock_status, alert_type

#### 8. Monthly Stock Changes
- **Purpose**: Calculate stock changes over time with trends
- **Logic**: Group by month, aggregate inbound/outbound quantities
- **Sample Logic**: `GROUP BY strftime('%Y-%m', transaction_date)`
- **Expected Output**: product_name, month, total_inbound, total_outbound, net_change

#### 9. Location Capacity Analysis
- **Purpose**: Multi-table joins with aggregation for location analysis
- **Logic**: Complex joins with capacity calculations and percentages
- **Sample Logic**: `(total_stock * 100.0 / capacity) as capacity_utilization_percent`
- **Expected Output**: location_name, capacity, unique_products, total_stock, capacity_utilization_percent

### Edge Cases & Data Validation

#### 10. Missing Location Transactions
- **Purpose**: Flag transactions missing location IDs or timestamps
- **Logic**: Check for NULL values in critical fields
- **Sample Logic**: `WHERE location_id IS NULL OR transaction_date IS NULL`
- **Expected Output**: transaction_id, product_name, validation_status

#### 11. Data Integrity Validation
- **Purpose**: Validate data integrity constraints and handle NULL values
- **Logic**: Count missing values across multiple tables
- **Sample Logic**: `COUNT(CASE WHEN field IS NULL THEN 1 END)`
- **Expected Output**: table_name, total_records, missing_fields_count

### Advanced Features

#### 12. Pivoted Stock Report
- **Purpose**: Generate pivoted stock report per location per month
- **Logic**: Complex grouping with multiple dimensions
- **Sample Logic**: `GROUP BY product_id, strftime('%Y-%m', transaction_date), location_id`
- **Expected Output**: product_name, sku, month, location_name, stock_at_location

## Best Practices (DO's)

### Database Design
- ✅ Always index foreign keys for better join performance
- ✅ Use appropriate data types (INTEGER, VARCHAR, DECIMAL)
- ✅ Implement proper constraints (NOT NULL, UNIQUE, FOREIGN KEY)
- ✅ Create computed views for complex calculations
- ✅ Use transactions for data consistency

### Query Optimization
- ✅ Use specific column names instead of SELECT *
- ✅ Add WHERE clauses before GROUP BY
- ✅ Use appropriate indexes for frequently queried columns
- ✅ Limit result sets when possible
- ✅ Use parameterized queries to prevent SQL injection

### Performance
- ✅ Use EXPLAIN to analyze query execution plans
- ✅ Monitor query execution times
- ✅ Implement pagination for large result sets
- ✅ Cache frequently accessed data
- ✅ Use appropriate aggregate functions

## Common Pitfalls (DON'Ts)

### Database Design
- ❌ Avoid SELECT * on large tables
- ❌ Don't ignore NULL values in calculations
- ❌ Avoid circular foreign key references
- ❌ Don't use VARCHAR for numeric data
- ❌ Avoid storing calculated values that can be computed

### Query Issues
- ❌ Don't use string concatenation for dynamic SQL
- ❌ Avoid nested subqueries when joins would be more efficient
- ❌ Don't ignore transaction isolation levels
- ❌ Avoid using functions on indexed columns in WHERE clauses
- ❌ Don't forget to handle NULL values in aggregations

### Performance Issues
- ❌ Avoid cartesian products (missing JOIN conditions)
- ❌ Don't use ORDER BY on large datasets without LIMIT
- ❌ Avoid using DISTINCT unnecessarily
- ❌ Don't ignore query execution time warnings
- ❌ Avoid complex queries in loops

## Common Pitfalls & Solutions

### 1. NULL Values in Calculations
**Problem**: NULL values in aggregations can cause unexpected results
```sql
-- Problematic
SELECT SUM(quantity) FROM transactions WHERE product_id = 1;

-- Solution
SELECT COALESCE(SUM(quantity), 0) FROM transactions WHERE product_id = 1;
```

### 2. Date Range Queries
**Problem**: Incorrect date filtering can miss records
```sql
-- Problematic
WHERE transaction_date > '2024-01-01'

-- Solution
WHERE transaction_date >= '2024-01-01 00:00:00'
```

### 3. Complex Joins
**Problem**: Missing JOIN conditions can cause cartesian products
```sql
-- Problematic
FROM products p, transactions t, locations l

-- Solution
FROM products p
LEFT JOIN transactions t ON p.id = t.product_id
LEFT JOIN locations l ON t.location_id = l.id
```

### 4. Performance Issues
**Problem**: Unoptimized queries on large datasets
```sql
-- Problematic
SELECT * FROM transactions ORDER BY transaction_date;

-- Solution
SELECT id, product_id, quantity, transaction_date 
FROM transactions 
ORDER BY transaction_date 
LIMIT 100;
```

## Testing Scenarios

### Simple Scenarios
1. **Get total stock per product** - Basic aggregation
2. **List products by category** - Simple filtering
3. **Count active vs inactive products** - GROUP BY with COUNT

### Medium Scenarios
1. **Recent movements by user** - Date filtering with joins
2. **Low stock alerts** - Conditional logic with thresholds
3. **Transaction history** - Time-based queries with ordering

### Complex Scenarios
1. **Negative stock detection** - Complex CASE statements
2. **Trend analysis** - Time-series aggregations
3. **Capacity utilization** - Multi-table joins with calculations

### Edge Cases
1. **Missing data validation** - NULL value handling
2. **Data integrity checks** - Constraint validation
3. **Performance testing** - Large dataset handling

## AI Assistance Guidelines

### When to Use AI
- ✅ Complex query optimization
- ✅ Schema design suggestions
- ✅ Performance tuning recommendations
- ✅ Error detection and debugging
- ✅ Best practice recommendations

### AI Input Requirements
- ✅ Clear problem description
- ✅ Current schema information
- ✅ Sample data structure
- ✅ Performance requirements
- ✅ Expected output format

### AI Output Validation
- ✅ Test queries with sample data
- ✅ Verify performance improvements
- ✅ Check for SQL injection vulnerabilities
- ✅ Validate against business requirements
- ✅ Test edge cases and error conditions 