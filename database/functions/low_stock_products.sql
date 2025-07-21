-- Function: get_low_stock_products()
-- Description: Find products with stock below minimum threshold
-- Complexity: Medium
-- Returns: product_name, sku, category, current_quantity, min_stock_level, shortage

CREATE TEMP TABLE IF NOT EXISTS low_stock_products_result AS
SELECT 
    p.name as product_name,
    p.sku,
    p.category,
    COALESCE(
        (SELECT SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE -t.quantity END)
         FROM transactions t 
         WHERE t.product_id = p.id), 0
    ) as current_quantity,
    p.min_stock_level,
    (p.min_stock_level - COALESCE(
        (SELECT SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE -t.quantity END)
         FROM transactions t 
         WHERE t.product_id = p.id), 0
    )) as shortage
FROM products p
WHERE p.status = 'active'
    AND COALESCE(
        (SELECT SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE -t.quantity END)
         FROM transactions t 
         WHERE t.product_id = p.id), 0
    ) < p.min_stock_level
ORDER BY shortage DESC;

-- Function to get low stock products data
CREATE TEMP VIEW get_low_stock_products AS
SELECT * FROM low_stock_products_result; 