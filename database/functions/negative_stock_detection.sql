-- Function: get_negative_stock_detection()
-- Description: Detect assets with negative stock or status issues
-- Complexity: Complex
-- Returns: product_name, sku, current_quantity, stock_status, alert_type

CREATE TEMP TABLE IF NOT EXISTS negative_stock_detection_result AS
SELECT 
    p.name as product_name,
    p.sku,
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
    END as stock_status,
    CASE 
        WHEN COALESCE(
            (SELECT SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE -t.quantity END)
             FROM transactions t 
             WHERE t.product_id = p.id), 0
        ) < 0 THEN 'NEGATIVE_STOCK' 
        WHEN COALESCE(
            (SELECT SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE -t.quantity END)
             FROM transactions t 
             WHERE t.product_id = p.id), 0
        ) < p.min_stock_level THEN 'LOW_STOCK' 
        ELSE 'NORMAL' 
    END as alert_type
FROM products p
WHERE p.status = 'active'
    AND (COALESCE(
        (SELECT SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE -t.quantity END)
         FROM transactions t 
         WHERE t.product_id = p.id), 0
    ) < 0 OR COALESCE(
        (SELECT SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE -t.quantity END)
         FROM transactions t 
         WHERE t.product_id = p.id), 0
    ) < p.min_stock_level)
ORDER BY current_quantity ASC;

-- Function to get negative stock detection data
CREATE TEMP VIEW get_negative_stock_detection AS
SELECT * FROM negative_stock_detection_result; 