-- Function: get_products_by_status()
-- Description: Count products by status (active/inactive)
-- Complexity: Simple
-- Returns: status, product_count

CREATE TEMP TABLE IF NOT EXISTS products_by_status_result AS
SELECT 
    status, 
    COUNT(*) as product_count
FROM products
GROUP BY status
ORDER BY product_count DESC;

-- Function to get products by status data
CREATE TEMP VIEW get_products_by_status AS
SELECT * FROM products_by_status_result; 