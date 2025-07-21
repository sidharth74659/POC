-- Function: get_current_stock()
-- Description: Get total stock per product with status indicators
-- Complexity: Simple
-- Returns: product_name, sku, category, current_quantity, stock_status

CREATE TEMP TABLE IF NOT EXISTS current_stock_result AS
SELECT 
    p.name as product_name,
    p.sku,
    p.category,
    COALESCE(
        (SELECT SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE -t.quantity END)
         FROM transactions t 
         WHERE t.product_id = p.id), 0
    ) as current_quantity,
    CASE 
        WHEN COALESCE(
            (SELECT SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE -t.quantity END)
             FROM transactions t 
             WHERE t.product_id = p.id), 0
        ) < 0 THEN 'negative_stock'
        WHEN COALESCE(
            (SELECT SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE -t.quantity END)
             FROM transactions t 
             WHERE t.product_id = p.id), 0
        ) < p.min_stock_level THEN 'low_stock'
        ELSE 'normal'
    END as stock_status
FROM products p
WHERE p.status = 'active'
ORDER BY current_quantity DESC;

-- Function to get current stock data
CREATE TEMP VIEW get_current_stock AS
SELECT * FROM current_stock_result; 