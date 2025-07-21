-- Function: get_data_integrity_check()
-- Description: Validate data integrity constraints and handle NULL values
-- Complexity: Edge
-- Returns: table_name, total_records, missing_names, missing_skus, missing_status, missing_product_id, missing_user_id, missing_type

CREATE TEMP TABLE IF NOT EXISTS data_integrity_check_result AS
SELECT 
    'products' as table_name, 
    COUNT(*) as total_records,
    COUNT(CASE WHEN name IS NULL OR name = '' THEN 1 END) as missing_names,
    COUNT(CASE WHEN sku IS NULL OR sku = '' THEN 1 END) as missing_skus,
    COUNT(CASE WHEN status IS NULL THEN 1 END) as missing_status,
    NULL as missing_product_id,
    NULL as missing_user_id,
    NULL as missing_type
FROM products
UNION ALL
SELECT 
    'transactions' as table_name, 
    COUNT(*) as total_records,
    NULL as missing_names,
    NULL as missing_skus,
    NULL as missing_status,
    COUNT(CASE WHEN product_id IS NULL THEN 1 END) as missing_product_id,
    COUNT(CASE WHEN user_id IS NULL THEN 1 END) as missing_user_id,
    COUNT(CASE WHEN transaction_type IS NULL THEN 1 END) as missing_type
FROM transactions;

-- Function to get data integrity check data
CREATE TEMP VIEW get_data_integrity_check AS
SELECT * FROM data_integrity_check_result; 