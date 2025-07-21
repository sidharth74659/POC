-- Function Loader: Loads all SQL functions and creates a registry
-- This file should be executed after the main init.sql to load all function definitions

-- Create a function registry table
CREATE TEMP TABLE IF NOT EXISTS function_registry (
    function_name TEXT PRIMARY KEY,
    description TEXT,
    complexity TEXT,
    returns TEXT,
    file_path TEXT
);

-- Register all available functions
INSERT OR REPLACE INTO function_registry VALUES
('get_current_stock', 'Get total stock per product with status indicators', 'simple', 'product_name, sku, category, current_quantity, stock_status', 'current_stock.sql'),
('get_products_by_location', 'List all products with their current locations', 'simple', 'product_name, sku, location_name, quantity_at_location', 'products_by_location.sql'),
('get_products_by_status', 'Count products by status (active/inactive)', 'simple', 'status, product_count', 'products_by_status.sql'),
('get_active_products', 'List all active products with basic information', 'simple', 'id, name, sku, category, unit_price', 'active_products.sql'),
('get_recent_movements', 'List assets moved in the last 7 days by user and location', 'medium', 'product_name, sku, transaction_type, quantity, user_name, location_name, transaction_date', 'recent_movements.sql'),
('get_low_stock_products', 'Find products with stock below minimum threshold', 'medium', 'product_name, sku, category, current_quantity, min_stock_level, shortage', 'low_stock_products.sql'),
('get_transaction_history_by_user', 'Show transaction history for specific users', 'medium', 'user_name, product_name, transaction_type, quantity, transaction_date', 'transaction_history_by_user.sql'),
('get_negative_stock_detection', 'Detect assets with negative stock or status issues', 'complex', 'product_name, sku, current_quantity, stock_status, alert_type', 'negative_stock_detection.sql'),
('get_missing_location_transactions', 'Flag transactions missing location IDs or timestamps', 'edge', 'transaction_id, product_name, transaction_type, quantity, user_name, transaction_date, validation_status', 'missing_location_transactions.sql'),
('get_monthly_stock_changes', 'Calculate stock changes over time with trends', 'complex', 'product_name, sku, month, total_inbound, total_outbound, net_change', 'monthly_stock_changes.sql'),
('get_location_capacity_analysis', 'Multi-table joins with aggregation for location analysis', 'complex', 'location_name, capacity, unique_products, total_stock, capacity_utilization_percent', 'location_capacity_analysis.sql'),
('get_data_integrity_check', 'Validate data integrity constraints and handle NULL values', 'edge', 'table_name, total_records, missing_names, missing_skus, missing_status, missing_product_id, missing_user_id, missing_type', 'data_integrity_check.sql'),
('get_pivoted_stock_report', 'Generate pivoted stock report per location per month', 'advanced', 'product_name, sku, month, location_name, stock_at_location', 'pivoted_stock_report.sql');

-- Create a view to list all available functions
CREATE TEMP VIEW available_functions AS
SELECT 
    function_name,
    description,
    complexity,
    returns,
    file_path
FROM function_registry
ORDER BY 
    CASE complexity
        WHEN 'simple' THEN 1
        WHEN 'medium' THEN 2
        WHEN 'complex' THEN 3
        WHEN 'edge' THEN 4
        WHEN 'advanced' THEN 5
        ELSE 6
    END,
    function_name; 