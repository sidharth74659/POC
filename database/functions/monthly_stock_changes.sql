-- Function: get_monthly_stock_changes()
-- Description: Calculate stock changes over time with trends
-- Complexity: Complex
-- Returns: product_name, sku, month, total_inbound, total_outbound, net_change

CREATE TEMP TABLE IF NOT EXISTS monthly_stock_changes_result AS
SELECT 
    p.name as product_name, 
    p.sku, 
    strftime('%Y-%m', t.transaction_date) as month,
    SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END) as total_inbound,
    SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END) as total_outbound,
    SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END) - 
    SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END) as net_change
FROM products p
LEFT JOIN transactions t ON p.id = t.product_id
WHERE t.transaction_date >= datetime('now', '-3 months')
    AND t.transaction_date IS NOT NULL
GROUP BY p.id, p.name, p.sku, strftime('%Y-%m', t.transaction_date)
ORDER BY p.name, month DESC;

-- Function to get monthly stock changes data
CREATE TEMP VIEW get_monthly_stock_changes AS
SELECT * FROM monthly_stock_changes_result; 