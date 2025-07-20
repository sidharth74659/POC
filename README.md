# Inventory Asset Management System

A medium-complexity inventory/asset management Minimum Working Example (MWE) that demonstrates manual vs. AI-assisted development workflows.

## 🎯 Project Overview

This system provides a complete inventory management solution with:
- **Relational database** with 5 core tables and computed views
- **Web-based query interface** for both predefined and custom SQL
- **12 predefined queries** covering simple to complex scenarios
- **Realistic sample data** (50-100 records) for testing
- **Performance benchmarks** and optimization examples
- **Manual vs AI-assisted** development comparison framework

## 🏗️ System Architecture

### Database Schema
- **Users**: System users with roles and permissions
- **Locations**: Physical storage locations with capacity tracking
- **Products**: Inventory items with SKUs, categories, and pricing
- **Transactions**: Movement, adjustments, and status changes
- **Logs**: Audit trail for all operations
- **Current Stock View**: Computed view for real-time stock levels

### Web Interface
- **Predefined Query Selection**: Dropdown with 12 categorized queries
- **Custom SQL Input**: Text area for manual SQL execution
- **Results Display**: Styled table output with row counts
- **Error Handling**: Comprehensive error messages and validation
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Installation

1. **Clone and Install Dependencies**
```bash
npm install
```

2. **Initialize Database**
```bash
npm run init-db
```

3. **Seed Sample Data**
```bash
npm run seed-data
```

4. **Start the Server**
```bash
npm start
```

5. **Access the Application**
Open your browser and navigate to: `http://localhost:3000`

## 📊 Available Queries

### Simple Queries (Basic Operations)
1. **Current Stock Per Product** - Get total stock with status indicators
2. **Products by Location** - List products with their current locations
3. **Products by Status** - Count products by active/inactive status

### Medium Complexity Queries (Business Logic)
4. **Recent Movements (Last 7 Days)** - Assets moved by user and location
5. **Low Stock Products** - Find products below minimum threshold
6. **Transaction History by Product** - Show history for specific product

### Complex Queries (Advanced Analytics)
7. **Negative Stock Detection** - Detect assets with negative stock or status issues
8. **Monthly Stock Changes** - Calculate stock changes over time with trends
9. **Location Capacity Analysis** - Multi-table joins with capacity calculations

### Edge Cases & Data Validation
10. **Missing Location Transactions** - Flag transactions missing critical data
11. **Data Integrity Validation** - Validate data integrity constraints

### Advanced Features
12. **Pivoted Stock Report** - Generate pivoted stock report per location per month

## 🧪 Testing Scenarios

### Simple Scenarios
- Get total stock per product
- List products by category
- Count active vs inactive products

### Medium Scenarios
- Recent movements by user and location
- Low stock alerts
- Transaction history for specific products

### Complex Scenarios
- Negative stock detection
- Trend analysis over time
- Capacity utilization analysis

### Edge Cases
- Missing data validation
- Data integrity checks
- Performance testing with large datasets

## 📈 Performance Benchmarks

| Query Type | Target Execution Time | Memory Usage |
|------------|---------------------|--------------|
| Simple | < 100ms | < 10MB |
| Medium | < 200ms | < 50MB |
| Complex | < 500ms | < 100MB |
| Edge Cases | < 200ms | < 50MB |
| Advanced | < 1000ms | < 200MB |

## 🔧 API Endpoints

### Query Management
- `GET /api/queries` - List all predefined queries
- `GET /api/queries/:id` - Execute predefined query
- `POST /api/execute` - Execute custom SQL

### System Information
- `GET /api/schema` - Get database schema information
- `GET /api/health` - System health check

### Web Interface
- `GET /` - Main application interface

## 📚 Documentation

### Core Documents
- [`specs.md`](specs.md) - System specifications and architecture
- [`test-plan.md`](test-plan.md) - Comprehensive testing plan
- [`ai-reference-guide.md`](ai-reference-guide.md) - AI assistance reference
- [`requirements-testing.md`](requirements-testing.md) - Testing requirements

### Database Schema
```sql
-- Core tables with relationships
users (id, username, email, full_name, role)
locations (id, name, description, address, capacity, status)
products (id, name, sku, description, category, unit_price, min_stock_level, max_stock_level, status)
transactions (id, product_id, location_id, user_id, transaction_type, quantity, unit_price, reference_number, notes, transaction_date)
logs (id, user_id, action, table_name, record_id, old_values, new_values, ip_address, user_agent, created_at)
```

## 🤖 Manual vs AI-Assisted Development

### Manual Development Workflow
1. **Schema Design**: Manual database design with normalization
2. **Query Writing**: Hand-written SQL with trial and error
3. **Optimization**: Manual performance tuning and debugging
4. **Documentation**: Manual documentation and comments

### AI-Assisted Development Workflow
1. **Schema Generation**: AI-suggested schema with best practices
2. **Query Generation**: Natural language to SQL conversion
3. **Optimization**: AI-recommended indexes and query improvements
4. **Documentation**: Self-documenting code with explanations

### Comparison Metrics
| Aspect | Manual | AI-Assisted |
|--------|--------|-------------|
| Development Time | 2-4 hours per complex query | 30 minutes - 1 hour |
| Error Rate | 15-20% initial errors | 5-10% initial errors |
| Optimization Level | Basic to moderate | Advanced with best practices |
| Maintainability | Requires documentation | Self-documenting |

## 🛠️ Development

### Project Structure
```
inventory-asset-management/
├── data/                   # Database files
├── public/                 # Frontend files
│   └── index.html         # Main web interface
├── scripts/               # Database scripts
│   ├── init-database.js   # Database initialization
│   └── seed-data.js       # Sample data seeding
├── server.js              # Express server
├── package.json           # Dependencies and scripts
├── specs.md              # System specifications
├── test-plan.md          # Testing documentation
├── ai-reference-guide.md # AI assistance guide
├── requirements-testing.md # Testing requirements
└── README.md             # This file
```

### Database Initialization
The system creates:
- 5 core tables with proper relationships
- Computed views for complex calculations
- Indexes for performance optimization
- Foreign key constraints for data integrity

### Sample Data
The seeding script creates:
- 6 users with different roles
- 6 locations with varying capacities
- 15 products across multiple categories
- 100+ transactions over 30 days
- Realistic data patterns and edge cases

## 🔍 Testing

### Automated Testing
```bash
# Run all tests
npm test

# Test specific scenarios
npm run test:simple
npm run test:medium
npm run test:complex
npm run test:edge
```

### Manual Testing
1. **Web Interface**: Test all predefined queries
2. **Custom SQL**: Test custom query execution
3. **Performance**: Monitor query execution times
4. **Edge Cases**: Test error handling and validation

### Browser Testing
The system includes comprehensive browser testing using Puppeteer/Playwright for:
- Interface functionality
- Query execution
- Error handling
- Performance validation

## 📊 Sample Queries

### Simple Query Example
```sql
-- Get current stock per product
SELECT 
    product_name,
    sku,
    category,
    current_quantity,
    stock_status
FROM current_stock
ORDER BY current_quantity DESC;
```

### Medium Complexity Example
```sql
-- Recent movements by user and location
SELECT 
    p.name as product_name,
    t.transaction_type,
    t.quantity,
    u.full_name as user_name,
    l.name as location_name,
    t.transaction_date
FROM transactions t
JOIN products p ON t.product_id = p.id
JOIN users u ON t.user_id = u.id
LEFT JOIN locations l ON t.location_id = l.id
WHERE t.transaction_date >= datetime('now', '-7 days')
ORDER BY t.transaction_date DESC;
```

### Complex Query Example
```sql
-- Negative stock detection
SELECT 
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
ORDER BY current_quantity ASC;
```

## 🚀 Deployment

### Local Development
```bash
npm run dev  # Start with nodemon for development
```

### Production Deployment
```bash
npm start    # Start production server
```

### Environment Variables
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- SQLite for lightweight database solution
- Express.js for web framework
- Modern CSS for responsive design
- Node.js ecosystem for development tools

---

**Note**: This system is designed for educational and demonstration purposes. For production use, consider additional security measures, comprehensive testing, and performance optimization. 