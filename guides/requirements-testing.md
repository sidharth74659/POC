# Requirements Document - Manual vs AI-Assisted Development Testing

## Project Overview
This document outlines the incremental API/task requirements to test both **manual vs. AI-assisted** workflows for the inventory/asset management system.

## Testing Scenarios

### 1. Simple Queries ✅

#### 1.1 Get Total Stock Per Product
**Manual Approach:**
- Write basic SELECT with GROUP BY
- Use SUM() aggregation for inbound/outbound quantities
- Handle NULL values with COALESCE

**AI-Assisted Approach:**
- Describe requirement: "Get total stock per product"
- AI generates optimized query with proper NULL handling
- AI suggests indexing strategies

**Success Criteria:**
- Returns product_name, sku, current_quantity, stock_status
- Handles products with no transactions (NULL values)
- Performance: < 100ms execution time

**Expected Output Shape:**
```json
{
  "product_name": "Laptop Dell XPS 13",
  "sku": "LAP-DELL-XPS13", 
  "current_quantity": 25,
  "stock_status": "normal"
}
```

#### 1.2 List Products by Category
**Manual Approach:**
- Simple SELECT with WHERE clause
- Basic filtering logic

**AI-Assisted Approach:**
- Natural language: "Show all electronics products"
- AI generates appropriate WHERE condition

**Success Criteria:**
- Returns products filtered by category
- Includes all relevant product fields
- Performance: < 50ms execution time

#### 1.3 Count Products by Status
**Manual Approach:**
- GROUP BY with COUNT aggregation
- Basic statistical query

**AI-Assisted Approach:**
- Natural language: "Count active vs inactive products"
- AI generates GROUP BY query

**Success Criteria:**
- Returns status and count for each status
- Handles all status types (active, inactive)
- Performance: < 30ms execution time

### 2. Medium Complexity Queries ✅

#### 2.1 List Assets Moved in Last 7 Days by User and Location
**Manual Approach:**
- Date filtering with datetime functions
- Multiple table joins (transactions, users, locations)
- Complex WHERE clause with date arithmetic

**AI-Assisted Approach:**
- Natural language: "Show recent movements by user and location"
- AI generates date filtering and joins
- AI suggests appropriate indexes

**Success Criteria:**
- Returns transactions from last 7 days only
- Includes user_name, location_name, product details
- Performance: < 200ms execution time

**Expected Output Shape:**
```json
{
  "product_name": "iPhone 15 Pro",
  "transaction_type": "inbound",
  "quantity": 10,
  "user_name": "John Doe",
  "location_name": "Main Warehouse",
  "transaction_date": "2024-01-15T10:30:00"
}
```

#### 2.2 Find Products with Low Stock
**Manual Approach:**
- Compare current_quantity with min_stock_level
- Use computed view or subquery
- Calculate shortage amount

**AI-Assisted Approach:**
- Natural language: "Find products below minimum stock level"
- AI generates comparison logic
- AI suggests alert thresholds

**Success Criteria:**
- Returns products where current_quantity < min_stock_level
- Includes shortage calculation
- Performance: < 150ms execution time

#### 2.3 Transaction History for Specific Product
**Manual Approach:**
- Filter by product_id
- Order by transaction_date DESC
- Join with users and locations

**AI-Assisted Approach:**
- Natural language: "Show transaction history for Laptop Dell XPS 13"
- AI generates product lookup and history query

**Success Criteria:**
- Returns all transactions for specified product
- Ordered by most recent first
- Includes user and location details
- Performance: < 100ms execution time

### 3. Complex Queries ✅

#### 3.1 Detect Assets with Negative Stock or Status Flips
**Manual Approach:**
- Complex CASE statements
- Multiple conditions in WHERE clause
- Alert classification logic

**AI-Assisted Approach:**
- Natural language: "Detect negative stock and status issues"
- AI generates complex conditional logic
- AI suggests alert categories

**Success Criteria:**
- Identifies products with negative stock
- Detects status changes (inactive → active)
- Classifies alerts by type
- Performance: < 300ms execution time

**Expected Output Shape:**
```json
{
  "product_name": "USB-C Cable Pack",
  "sku": "CABLE-USB-C-PACK",
  "current_quantity": -5,
  "stock_status": "negative_stock",
  "alert_type": "NEGATIVE_STOCK"
}
```

#### 3.2 Monthly Stock Changes with Trends
**Manual Approach:**
- Date grouping with strftime
- Complex aggregations
- Time-series analysis

**AI-Assisted Approach:**
- Natural language: "Show monthly stock trends"
- AI generates time-based aggregations
- AI suggests trend analysis

**Success Criteria:**
- Groups by month and product
- Calculates inbound/outbound totals
- Shows net change over time
- Performance: < 500ms execution time

#### 3.3 Location Capacity Analysis
**Manual Approach:**
- Multi-table joins
- Capacity percentage calculations
- Complex aggregations

**AI-Assisted Approach:**
- Natural language: "Analyze location capacity utilization"
- AI generates join logic and calculations
- AI suggests optimization strategies

**Success Criteria:**
- Shows capacity utilization per location
- Calculates unique products per location
- Includes percentage calculations
- Performance: < 400ms execution time

### 4. Edge Cases & Data Validation ✅

#### 4.1 Flag Transactions Missing Location IDs or Timestamps
**Manual Approach:**
- Check for NULL values in critical fields
- Data integrity validation
- Error reporting logic

**AI-Assisted Approach:**
- Natural language: "Find transactions with missing data"
- AI generates NULL checking logic
- AI suggests data validation rules

**Success Criteria:**
- Identifies transactions with missing location_id
- Detects missing transaction_date
- Classifies validation status
- Performance: < 100ms execution time

#### 4.2 Data Integrity Validation
**Manual Approach:**
- Count missing values across tables
- Constraint validation
- Data quality assessment

**AI-Assisted Approach:**
- Natural language: "Validate data integrity"
- AI generates comprehensive validation queries
- AI suggests data quality improvements

**Success Criteria:**
- Reports missing values by table
- Validates foreign key constraints
- Provides data quality metrics
- Performance: < 200ms execution time

### 5. Optional Advanced Features ✅

#### 5.1 Generate Pivoted Stock Report per Location per Month
**Manual Approach:**
- Complex GROUP BY with multiple dimensions
- Pivot table logic
- Multi-dimensional aggregation

**AI-Assisted Approach:**
- Natural language: "Create pivoted stock report"
- AI generates multi-dimensional grouping
- AI suggests report formatting

**Success Criteria:**
- Groups by product, month, and location
- Shows stock levels across dimensions
- Handles sparse data appropriately
- Performance: < 1000ms execution time

#### 5.2 Export Data Functionality
**Manual Approach:**
- CSV/JSON export logic
- File generation
- Download handling

**AI-Assisted Approach:**
- Natural language: "Export query results"
- AI generates export functionality
- AI suggests data formatting

**Success Criteria:**
- Exports query results to CSV/JSON
- Handles large datasets
- Provides download links
- Performance: < 2000ms for large exports

## Performance Benchmarks

### Query Execution Times
- **Simple Queries**: < 100ms
- **Medium Queries**: < 200ms  
- **Complex Queries**: < 500ms
- **Edge Case Queries**: < 200ms
- **Advanced Features**: < 1000ms

### Memory Usage
- **Small Results**: < 10MB
- **Medium Results**: < 50MB
- **Large Results**: < 200MB

### Concurrent Users
- **System Capacity**: 10+ concurrent users
- **Response Time**: < 2 seconds under load

## Manual vs AI-Assisted Comparison Metrics

### Development Time
- **Manual**: 2-4 hours per complex query
- **AI-Assisted**: 30 minutes - 1 hour per complex query

### Error Rate
- **Manual**: 15-20% initial errors
- **AI-Assisted**: 5-10% initial errors

### Optimization Level
- **Manual**: Basic to moderate optimization
- **AI-Assisted**: Advanced optimization with best practices

### Maintainability
- **Manual**: Requires documentation and comments
- **AI-Assisted**: Self-documenting with explanations

## Testing Checklist

### System Setup
- [ ] Database initialization completed
- [ ] Sample data seeded (50-100 records)
- [ ] Web interface accessible
- [ ] API endpoints functional

### Query Testing
- [ ] All simple queries execute successfully
- [ ] All medium queries return expected results
- [ ] All complex queries handle edge cases
- [ ] All edge case queries validate data integrity
- [ ] All advanced features work as expected

### Performance Testing
- [ ] Query execution times within benchmarks
- [ ] Memory usage within limits
- [ ] Concurrent user handling
- [ ] Large dataset performance

### Manual vs AI Comparison
- [ ] Both approaches produce identical results
- [ ] AI-assisted queries are optimized
- [ ] Manual queries are well-documented
- [ ] Performance differences measured
- [ ] Error handling compared

## Success Criteria Summary

### Functional Requirements
- ✅ All 12 query scenarios implemented
- ✅ Web interface fully functional
- ✅ API endpoints working correctly
- ✅ Data validation and error handling

### Performance Requirements
- ✅ Query execution times within benchmarks
- ✅ Memory usage optimized
- ✅ Concurrent access supported
- ✅ Scalability demonstrated

### Comparison Requirements
- ✅ Manual vs AI workflows documented
- ✅ Performance metrics collected
- ✅ Best practices demonstrated
- ✅ Lessons learned captured

### Documentation Requirements
- ✅ Complete system documentation
- ✅ API reference guide
- ✅ Testing procedures documented
- ✅ Comparison analysis completed 