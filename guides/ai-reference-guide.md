# AI Reference Guide - Inventory Asset Management System

## 📋 Table of Contents
1. [Database Schema Overview](#database-schema-overview)
2. [Table Relationships](#table-relationships)
3. [Query APIs](#query-apis)
4. [AI Prompt Template](#ai-prompt-template)
5. [Best Practices](#best-practices)
6. [Common Pitfalls](#common-pitfalls)
7. [AI Assistance Guidelines](#ai-assistance-guidelines)

---

## 🗄️ Database Schema Overview

### Core Tables

#### `users` Table
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
**Purpose**: User management and authentication
**Key Fields**: `id` (PK), `username`, `email`, `role`

#### `locations` Table
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
**Purpose**: Physical storage locations
**Key Fields**: `id` (PK), `name`, `capacity`, `status`

#### `products` Table
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
**Purpose**: Product catalog and specifications
**Key Fields**: `id` (PK), `sku` (unique), `category`, `min_stock_level`, `max_stock_level`

#### `transactions` Table
```sql
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    location_id INTEGER,
    user_id INTEGER NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,
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
**Purpose**: Track all inventory movements
**Key Fields**: `id` (PK), `product_id` (FK), `location_id` (FK), `user_id` (FK), `transaction_type`, `quantity`

#### `logs` Table
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
**Purpose**: Audit trail and system logs
**Key Fields**: `id` (PK), `user_id` (FK), `action`, `table_name`, `record_id`

### Computed Views

#### `current_stock` View
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
GROUP BY p.id, p.name, p.sku, p.category, p.min_stock_level, p.max_stock_level, p.status;
```
**Purpose**: Real-time stock calculation with status indicators
**Key Fields**: `product_id`, `product_name`, `sku`, `current_quantity`, `stock_status`

---

## 🔗 Table Relationships

### Primary Relationships
1. **transactions → products**: Many-to-one (product_id)
2. **transactions → locations**: Many-to-one (location_id) 
3. **transactions → users**: Many-to-one (user_id)
4. **logs → users**: Many-to-one (user_id)

### Relationship Diagram
```
users (1) ←→ (N) transactions (N) ←→ (1) products
                ↓
                (N) ←→ (1) locations
```

### Key Constraints
- `transactions.product_id` → `products.id` (NOT NULL)
- `transactions.user_id` → `users.id` (NOT NULL)
- `transactions.location_id` → `locations.id` (NULL allowed)
- `logs.user_id` → `users.id` (NULL allowed)

---

## 🔍 Query APIs

### Simple Queries (Basic SELECT)

#### 1. Current Stock Per Product
**Purpose**: Get total stock per product with status indicators
**Logic**: Calculate inbound - outbound quantities with status classification
```sql
SELECT product_name, sku, category, current_quantity, stock_status 
FROM current_stock 
ORDER BY current_quantity DESC;
```

#### 2. Products by Location
**Purpose**: List all products with their current locations
**Logic**: Group by product and location, calculate net quantity per location
```sql
SELECT p.name as product_name, p.sku, l.name as location_name,
       COALESCE(SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END), 0) -
       COALESCE(SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END), 0) as quantity_at_location
FROM products p
LEFT JOIN transactions t ON p.id = t.product_id
LEFT JOIN locations l ON t.location_id = l.id
WHERE p.status = 'active'
GROUP BY p.id, p.name, p.sku, l.name
HAVING quantity_at_location > 0
ORDER BY p.name, l.name;
```

#### 3. Products by Status
**Purpose**: Count products by status (active/inactive)
**Logic**: Simple aggregation with GROUP BY
```sql
SELECT status, COUNT(*) as product_count
FROM products
GROUP BY status
ORDER BY product_count DESC;
```

### Medium Complexity Queries (JOINs + Filtering)

#### 4. Recent Movements
**Purpose**: List assets moved in the last 7 days by user and location
**Logic**: Multi-table JOIN with date filtering
```sql
SELECT p.name as product_name, p.sku, t.transaction_type, t.quantity,
       u.full_name as user_name, l.name as location_name, t.transaction_date
FROM transactions t
JOIN products p ON t.product_id = p.id
JOIN users u ON t.user_id = u.id
LEFT JOIN locations l ON t.location_id = l.id
WHERE t.transaction_date >= datetime('now', '-7 days')
ORDER BY t.transaction_date DESC;
```

#### 5. Low Stock Products
**Purpose**: Find products with stock below minimum threshold
**Logic**: Use computed view with conditional filtering
```sql
SELECT product_name, sku, category, current_quantity, min_stock_level,
       (min_stock_level - current_quantity) as shortage
FROM current_stock
WHERE current_quantity < min_stock_level
ORDER BY shortage DESC;
```

### Complex Queries (Advanced Logic)

#### 6. Negative Stock Detection
**Purpose**: Detect assets with negative stock or status issues
**Logic**: Complex CASE statements with multiple conditions
```sql
SELECT product_name, sku, current_quantity, stock_status,
       CASE WHEN current_quantity < 0 THEN 'NEGATIVE_STOCK' 
            WHEN stock_status = 'low_stock' THEN 'LOW_STOCK' 
            ELSE 'NORMAL' END as alert_type
FROM current_stock
WHERE current_quantity < 0 OR stock_status = 'low_stock'
ORDER BY current_quantity ASC;
```

#### 7. Monthly Stock Changes
**Purpose**: Calculate stock changes over time with trends
**Logic**: Date functions, conditional aggregation, time-based grouping
```sql
SELECT p.name as product_name, p.sku, strftime('%Y-%m', t.transaction_date) as month,
       SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END) as total_inbound,
       SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END) as total_outbound,
       SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END) - 
       SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END) as net_change
FROM products p
LEFT JOIN transactions t ON p.id = t.product_id
WHERE t.transaction_date >= datetime('now', '-3 months')
GROUP BY p.id, p.name, p.sku, strftime('%Y-%m', t.transaction_date)
ORDER BY p.name, month DESC;
```

#### 8. Location Capacity Analysis
**Purpose**: Multi-table joins with aggregation for location analysis
**Logic**: Complex aggregation with percentage calculations
```sql
SELECT l.name as location_name, l.capacity,
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
ORDER BY capacity_utilization_percent DESC;
```

### Edge Case Queries (Data Validation)

#### 9. Missing Location Transactions
**Purpose**: Flag transactions missing location IDs or timestamps
**Logic**: NULL checking with CASE statements
```sql
SELECT t.id as transaction_id, p.name as product_name, t.transaction_type,
       t.quantity, u.full_name as user_name, t.transaction_date,
       CASE WHEN t.location_id IS NULL THEN 'MISSING_LOCATION'
            WHEN t.transaction_date IS NULL THEN 'MISSING_TIMESTAMP'
            ELSE 'VALID' END as validation_status
FROM transactions t
JOIN products p ON t.product_id = p.id
JOIN users u ON t.user_id = u.id
WHERE t.location_id IS NULL OR t.transaction_date IS NULL
ORDER BY t.transaction_date DESC;
```

#### 10. Data Integrity Validation
**Purpose**: Validate data integrity constraints and handle NULL values
**Logic**: UNION queries with NULL checking
```sql
SELECT 'products' as table_name, COUNT(*) as total_records,
       COUNT(CASE WHEN name IS NULL OR name = '' THEN 1 END) as missing_names,
       COUNT(CASE WHEN sku IS NULL OR sku = '' THEN 1 END) as missing_skus,
       COUNT(CASE WHEN status IS NULL THEN 1 END) as missing_status
FROM products
UNION ALL
SELECT 'transactions' as table_name, COUNT(*) as total_records,
       COUNT(CASE WHEN product_id IS NULL THEN 1 END) as missing_product_id,
       COUNT(CASE WHEN user_id IS NULL THEN 1 END) as missing_user_id,
       COUNT(CASE WHEN transaction_type IS NULL THEN 1 END) as missing_type
FROM transactions;
```

### Advanced Queries (Complex Analytics)

#### 11. Pivoted Stock Report
**Purpose**: Generate pivoted stock report per location per month
**Logic**: Multi-dimensional grouping with time and location dimensions
```sql
SELECT p.name as product_name, p.sku, strftime('%Y-%m', t.transaction_date) as month,
       l.name as location_name,
       SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END) -
       SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END) as stock_at_location
FROM products p
LEFT JOIN transactions t ON p.id = t.product_id
LEFT JOIN locations l ON t.location_id = l.id
WHERE t.transaction_date >= datetime('now', '-6 months')
GROUP BY p.id, p.name, p.sku, strftime('%Y-%m', t.transaction_date), l.name
HAVING stock_at_location > 0
ORDER BY p.name, month DESC, l.name;
```

---

## 🤖 AI Prompt Template

### Standard Query Generation Template

```
You are a SQL expert for an inventory asset management system. 

DATABASE SCHEMA:
[Include relevant table schemas]

BUSINESS REQUIREMENT:
[Describe the specific business need]

REQUIRED OUTPUT:
- List the exact columns needed
- Specify any filtering conditions
- Indicate sorting requirements
- Mention any aggregation needs

CONSTRAINTS:
- Use only standard SQL (SQLite dialect)
- Handle NULL values appropriately
- Consider performance implications
- Include proper JOINs where needed

Please generate a SQL query that:
1. [Specific requirement 1]
2. [Specific requirement 2]
3. [Specific requirement 3]

Expected output format: [Describe expected result structure]
```

### Example Prompt Usage

```
You are a SQL expert for an inventory asset management system.

DATABASE SCHEMA:
- products (id, name, sku, category, min_stock_level, max_stock_level, status)
- transactions (id, product_id, location_id, user_id, transaction_type, quantity, transaction_date)
- locations (id, name, capacity, status)
- users (id, username, full_name, role)

BUSINESS REQUIREMENT:
Find all products that have negative stock (more outbound than inbound transactions) and show which locations are affected.

REQUIRED OUTPUT:
- Product name and SKU
- Current stock quantity (can be negative)
- List of locations where the product has transactions
- Stock status indicator

CONSTRAINTS:
- Use only standard SQL (SQLite dialect)
- Handle NULL values appropriately
- Consider performance implications
- Include proper JOINs where needed

Please generate a SQL query that:
1. Calculates current stock per product
2. Identifies products with negative stock
3. Shows affected locations
4. Provides clear status indicators

Expected output format: product_name, sku, current_quantity, affected_locations, stock_status
```

---

## ✅ Best Practices

### DO's

#### Query Structure
- ✅ **Use meaningful column aliases**: `p.name as product_name`
- ✅ **Include proper JOIN conditions**: Always specify ON clause
- ✅ **Handle NULL values**: Use COALESCE() for calculations
- ✅ **Add appropriate WHERE clauses**: Filter early for performance
- ✅ **Use GROUP BY with aggregations**: Include all non-aggregated columns
- ✅ **Order results logically**: Use ORDER BY for consistent output

#### Performance
- ✅ **Use indexes effectively**: Leverage existing indexes on foreign keys
- ✅ **Limit result sets**: Use LIMIT for large datasets
- ✅ **Avoid SELECT ***: Specify only needed columns
- ✅ **Use EXISTS over IN**: For better performance with subqueries
- ✅ **Consider query complexity**: Break complex queries into views

#### Data Integrity
- ✅ **Validate foreign keys**: Ensure proper JOIN conditions
- ✅ **Handle edge cases**: Consider NULL values and missing data
- ✅ **Use appropriate data types**: Match column types to data
- ✅ **Include error handling**: Plan for data inconsistencies
- ✅ **Document assumptions**: Note any business logic assumptions

#### Business Logic
- ✅ **Understand transaction types**: inbound, outbound, adjustment
- ✅ **Calculate stock correctly**: inbound - outbound = current stock
- ✅ **Consider time periods**: Use datetime functions appropriately
- ✅ **Handle status indicators**: low_stock, negative_stock, normal
- ✅ **Respect business rules**: Follow inventory management principles

### DON'Ts

#### Query Structure
- ❌ **Avoid SELECT ***: Specifies only needed columns
- ❌ **Don't forget JOIN conditions**: Always specify ON clause
- ❌ **Avoid nested subqueries**: Use CTEs or views instead
- ❌ **Don't ignore NULL values**: Always handle them explicitly
- ❌ **Avoid complex CASE statements**: Break into smaller queries

#### Performance
- ❌ **Don't use ORDER BY unnecessarily**: Only when needed
- ❌ **Avoid multiple aggregations**: Can impact performance
- ❌ **Don't ignore indexes**: Use indexed columns in WHERE/ORDER BY
- ❌ **Avoid correlated subqueries**: Use JOINs instead
- ❌ **Don't process unnecessary data**: Filter early

#### Data Integrity
- ❌ **Don't assume data quality**: Always validate assumptions
- ❌ **Avoid hardcoded values**: Use parameters or variables
- ❌ **Don't ignore constraints**: Respect foreign key relationships
- ❌ **Avoid data type mismatches**: Ensure proper type handling
- ❌ **Don't forget error cases**: Plan for missing or invalid data

#### Business Logic
- ❌ **Don't ignore transaction types**: Understand inbound vs outbound
- ❌ **Avoid incorrect stock calculations**: inbound - outbound = current
- ❌ **Don't forget time zones**: Use consistent datetime handling
- ❌ **Avoid business rule violations**: Follow inventory principles
- ❌ **Don't ignore status logic**: Understand stock status indicators

---

## ⚠️ Common Pitfalls

### 1. Stock Calculation Errors
**Problem**: Incorrect stock calculation logic
```sql
-- WRONG: Simple sum of all quantities
SELECT SUM(quantity) FROM transactions WHERE product_id = 1;

-- CORRECT: Separate inbound and outbound
SELECT 
    SUM(CASE WHEN transaction_type = 'inbound' THEN quantity ELSE 0 END) -
    SUM(CASE WHEN transaction_type = 'outbound' THEN quantity ELSE 0 END)
FROM transactions WHERE product_id = 1;
```

**Solution**: Always separate inbound and outbound transactions

### 2. NULL Value Handling
**Problem**: NULL values breaking calculations
```sql
-- WRONG: NULL values break arithmetic
SELECT SUM(quantity) FROM transactions;

-- CORRECT: Handle NULLs with COALESCE
SELECT COALESCE(SUM(quantity), 0) FROM transactions;
```

**Solution**: Use COALESCE() for all aggregations

### 3. JOIN Condition Mistakes
**Problem**: Missing or incorrect JOIN conditions
```sql
-- WRONG: Missing ON clause
SELECT p.name, t.quantity 
FROM products p, transactions t;

-- CORRECT: Explicit JOIN with condition
SELECT p.name, t.quantity 
FROM products p
JOIN transactions t ON p.id = t.product_id;
```

**Solution**: Always use explicit JOINs with proper conditions

### 4. GROUP BY Issues
**Problem**: Missing columns in GROUP BY
```sql
-- WRONG: Column not in GROUP BY
SELECT p.name, p.category, COUNT(*)
FROM products p
GROUP BY p.name;

-- CORRECT: Include all non-aggregated columns
SELECT p.name, p.category, COUNT(*)
FROM products p
GROUP BY p.name, p.category;
```

**Solution**: Include all non-aggregated columns in GROUP BY

### 5. Date Function Errors
**Problem**: Incorrect date filtering
```sql
-- WRONG: String comparison
WHERE transaction_date > '2024-01-01'

-- CORRECT: Use datetime functions
WHERE transaction_date >= datetime('now', '-7 days')
```

**Solution**: Use SQLite datetime functions consistently

### 6. Performance Issues
**Problem**: Inefficient query patterns
```sql
-- WRONG: Multiple subqueries
SELECT p.name, 
       (SELECT COUNT(*) FROM transactions WHERE product_id = p.id) as tx_count
FROM products p;

-- CORRECT: Use JOIN with aggregation
SELECT p.name, COUNT(t.id) as tx_count
FROM products p
LEFT JOIN transactions t ON p.id = t.product_id
GROUP BY p.id, p.name;
```

**Solution**: Use JOINs and aggregations instead of subqueries

---

## 🤖 AI Assistance Guidelines

### When to Use AI Assistance

#### ✅ **Good Use Cases**
- **Complex aggregations**: Multi-table calculations with conditions
- **Data validation queries**: Finding inconsistencies or missing data
- **Business logic implementation**: Converting requirements to SQL
- **Performance optimization**: Improving query efficiency
- **Edge case handling**: Dealing with NULL values and exceptions
- **Analytics queries**: Time-based analysis and trends
- **Data integrity checks**: Validating relationships and constraints

#### ❌ **Avoid AI for**
- **Simple SELECT statements**: Basic queries are straightforward
- **Standard CRUD operations**: INSERT, UPDATE, DELETE
- **Index creation**: Database administration tasks
- **Schema modifications**: DDL operations
- **Basic filtering**: Simple WHERE clauses

### AI Prompt Best Practices

#### 1. **Provide Context**
```
Include relevant table schemas and relationships
Specify business requirements clearly
Mention any constraints or limitations
```

#### 2. **Be Specific**
```
Instead of: "Find products with low stock"
Use: "Find products where current_quantity < min_stock_level, 
      ordered by shortage amount descending"
```

#### 3. **Include Examples**
```
Provide sample input data
Show expected output format
Include edge cases to consider
```

#### 4. **Specify Constraints**
```
Mention performance requirements
Include data type considerations
Specify SQL dialect limitations
```

### Validation Checklist

#### Before Using AI-Generated Queries
- [ ] **Verify table relationships**: Ensure JOINs are correct
- [ ] **Check data types**: Confirm column type compatibility
- [ ] **Test with sample data**: Run on small dataset first
- [ ] **Validate business logic**: Ensure calculations are correct
- [ ] **Check performance**: Monitor query execution time
- [ ] **Handle edge cases**: Test with NULL values and empty results
- [ ] **Verify output format**: Ensure results match requirements

#### After Receiving AI-Generated Queries
- [ ] **Review JOIN conditions**: Ensure proper relationships
- [ ] **Check aggregations**: Verify GROUP BY and aggregate functions
- [ ] **Test NULL handling**: Ensure COALESCE usage is appropriate
- [ ] **Validate business rules**: Confirm logic matches requirements
- [ ] **Optimize if needed**: Consider performance improvements
- [ ] **Document assumptions**: Note any business logic included

### Common AI Query Patterns

#### 1. **Stock Calculation Pattern**
```sql
-- Standard pattern for stock calculation
SELECT 
    p.id,
    p.name,
    COALESCE(SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END), 0) -
    COALESCE(SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END), 0) as current_stock
FROM products p
LEFT JOIN transactions t ON p.id = t.product_id
GROUP BY p.id, p.name;
```

#### 2. **Time-Based Analysis Pattern**
```sql
-- Standard pattern for time-based queries
SELECT 
    strftime('%Y-%m', transaction_date) as month,
    COUNT(*) as transaction_count,
    SUM(CASE WHEN transaction_type = 'inbound' THEN quantity ELSE 0 END) as total_inbound
FROM transactions
WHERE transaction_date >= datetime('now', '-6 months')
GROUP BY strftime('%Y-%m', transaction_date)
ORDER BY month DESC;
```

#### 3. **Data Validation Pattern**
```sql
-- Standard pattern for data integrity checks
SELECT 
    'table_name' as check_type,
    COUNT(*) as total_records,
    COUNT(CASE WHEN column_name IS NULL THEN 1 END) as null_count
FROM table_name
WHERE condition;
```

---

## 📊 Expected Query Outputs

### Simple Query Examples

#### Current Stock Query
```sql
SELECT product_name, sku, category, current_quantity, stock_status 
FROM current_stock 
ORDER BY current_quantity DESC;
```
**Expected Output**:
```
product_name           | sku                | category    | current_quantity | stock_status
Laptop Dell XPS 13    | LAP-DELL-XPS13     | Electronics | 24              | normal
iPhone 15 Pro         | PHONE-IPHONE-15PRO | Electronics | 8               | low_stock
Office Chair Ergonomic| FURN-CHAIR-ERG     | Furniture   | 3               | normal
```

#### Products by Location Query
```sql
SELECT p.name as product_name, p.sku, l.name as location_name,
       COALESCE(SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END), 0) -
       COALESCE(SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END), 0) as quantity_at_location
FROM products p
LEFT JOIN transactions t ON p.id = t.product_id
LEFT JOIN locations l ON t.location_id = l.id
WHERE p.status = 'active'
GROUP BY p.id, p.name, p.sku, l.name
HAVING quantity_at_location > 0
ORDER BY p.name, l.name;
```
**Expected Output**:
```
product_name           | sku                | location_name    | quantity_at_location
Laptop Dell XPS 13    | LAP-DELL-XPS13     | Main Warehouse   | 24
iPhone 15 Pro         | PHONE-IPHONE-15PRO | Main Warehouse   | 8
Office Chair Ergonomic| FURN-CHAIR-ERG     | North Branch     | 3
```

### Complex Query Examples

#### Negative Stock Detection Query
```sql
SELECT product_name, sku, current_quantity, stock_status,
       CASE WHEN current_quantity < 0 THEN 'NEGATIVE_STOCK' 
            WHEN stock_status = 'low_stock' THEN 'LOW_STOCK' 
            ELSE 'NORMAL' END as alert_type
FROM current_stock
WHERE current_quantity < 0 OR stock_status = 'low_stock'
ORDER BY current_quantity ASC;
```
**Expected Output**:
```
product_name      | sku                | current_quantity | stock_status  | alert_type
USB-C Cable Pack  | CABLE-USB-C-PACK   | -5              | negative_stock| NEGATIVE_STOCK
Mouse Wireless    | ACC-MOUSE-WIRELESS | -5              | negative_stock| NEGATIVE_STOCK
iPhone 15 Pro     | PHONE-IPHONE-15PRO | 8               | low_stock     | LOW_STOCK
```

#### Monthly Stock Changes Query
```sql
SELECT p.name as product_name, p.sku, strftime('%Y-%m', t.transaction_date) as month,
       SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END) as total_inbound,
       SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END) as total_outbound,
       SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END) - 
       SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END) as net_change
FROM products p
LEFT JOIN transactions t ON p.id = t.product_id
WHERE t.transaction_date >= datetime('now', '-3 months')
GROUP BY p.id, p.name, p.sku, strftime('%Y-%m', t.transaction_date)
ORDER BY p.name, month DESC;
```
**Expected Output**:
```
product_name      | sku                | month   | total_inbound | total_outbound | net_change
Laptop Dell XPS 13| LAP-DELL-XPS13     | 2024-01| 35            | 11             | 24
Laptop Dell XPS 13| LAP-DELL-XPS13     | 2023-12| 20            | 8              | 12
iPhone 15 Pro     | PHONE-IPHONE-15PRO | 2024-01| 25            | 17             | 8
```

---

## 🔧 Troubleshooting Guide

### Common Error Messages

#### 1. **"no such column"**
**Cause**: Column name typo or missing table alias
**Solution**: Verify column names and table aliases

#### 2. **"ambiguous column name"**
**Cause**: Column exists in multiple joined tables
**Solution**: Use table alias prefix: `p.name` instead of `name`

#### 3. **"GROUP BY clause"**
**Cause**: Non-aggregated column missing from GROUP BY
**Solution**: Include all non-aggregated columns in GROUP BY

#### 4. **"no such table"**
**Cause**: Table name typo or missing table
**Solution**: Verify table names and check if tables exist

#### 5. **"foreign key constraint failed"**
**Cause**: Invalid foreign key reference
**Solution**: Ensure referenced record exists in parent table

### Performance Issues

#### 1. **Slow Queries**
**Solutions**:
- Add appropriate indexes
- Limit result sets with WHERE clauses
- Use EXISTS instead of IN for subqueries
- Break complex queries into smaller parts

#### 2. **Memory Issues**
**Solutions**:
- Use LIMIT for large result sets
- Avoid SELECT * (specify columns)
- Use pagination for large datasets
- Consider materialized views for complex calculations

#### 3. **Incorrect Results**
**Solutions**:
- Verify JOIN conditions
- Check for NULL value handling
- Validate business logic assumptions
- Test with known data sets

---

This AI Reference Guide provides comprehensive information for AI-assisted SQL development in the inventory asset management system. Use these guidelines to generate accurate, efficient, and maintainable SQL queries. 