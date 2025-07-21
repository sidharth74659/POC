-- Function: get_recent_movements()
-- Description: List assets moved in the last 7 days by user and location
-- Complexity: Medium
-- Returns: product_name, sku, transaction_type, quantity, user_name, location_name, transaction_date

CREATE TEMP TABLE IF NOT EXISTS recent_movements_result AS
SELECT 
    p.name as product_name, 
    p.sku, 
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

-- Function to get recent movements data
CREATE TEMP VIEW get_recent_movements AS
SELECT * FROM recent_movements_result; 