# Inventory/Asset Management System - Specifications

## Project Overview
A medium-complexity inventory/asset management Minimum Working Example (MWE) that demonstrates manual vs. AI-assisted development workflows.

## System Architecture

### Database Schema
- **Products/Assets**: Core inventory items with properties
- **Locations**: Physical storage locations
- **Transactions**: Movement, adjustments, and status changes
- **Users**: System users who perform operations
- **Logs**: Audit trail for all operations

### Core Features
1. **Web-based Query Interface**
   - Predefined query selection
   - Custom SQL input
   - Styled table output
   - Manual execution workflow

2. **Query APIs**
   - Simple: Basic stock queries
   - Medium: Time-based and filtered queries
   - Complex: Multi-table joins and analytics
   - Edge: Data validation and error detection

3. **Testing Scenarios**
   - Simple: Total stock per product
   - Medium: Recent movements by user/location
   - Complex: Negative stock detection and status changes
   - Edge: Data integrity validation
   - Optional: Pivoted reports

## Technology Stack
- **Backend**: Node.js with Express
- **Database**: SQLite (for simplicity and portability)
- **Frontend**: HTML, CSS, JavaScript
- **Testing**: Puppeteer/Playwright for end-to-end testing

## Development Phases
1. Core system setup with database schema
2. Web interface implementation
3. Query API development
4. Testing and validation
5. Documentation and comparison examples

## Success Criteria
- Complete, testable demo system
- Clear comparison between manual and AI-assisted workflows
- Scalable architecture for future enhancements
- Comprehensive documentation for AI assistance 