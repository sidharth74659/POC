-- Function: get_active_products()
-- Description: List all active products with basic information
-- Complexity: Simple
-- Returns: id, name, sku, category, unit_price

CREATE TEMP TABLE IF NOT EXISTS active_products_result AS
SELECT 
    id,
    name,
    sku,
    category,
    unit_price
FROM products
WHERE status = 'active'
ORDER BY name ASC;

-- Function to get active products data
CREATE TEMP VIEW get_active_products AS
SELECT * FROM active_products_result; 