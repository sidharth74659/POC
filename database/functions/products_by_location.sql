-- Function: get_products_by_location()
-- Description: List all products with their current locations
-- Complexity: Simple
-- Returns: product_name, sku, location_name, quantity_at_location

CREATE TEMP TABLE IF NOT EXISTS products_by_location_result AS
SELECT 
    p.name as product_name, 
    p.sku, 
    l.name as location_name,
    COALESCE(SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END), 0) -
    COALESCE(SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END), 0) as quantity_at_location
FROM products p
LEFT JOIN transactions t ON p.id = t.product_id
LEFT JOIN locations l ON t.location_id = l.id
WHERE p.status = 'active'
GROUP BY p.id, p.name, p.sku, l.name
HAVING quantity_at_location > 0
ORDER BY p.name, l.name;

-- Function to get products by location data
CREATE TEMP VIEW get_products_by_location AS
SELECT * FROM products_by_location_result; 