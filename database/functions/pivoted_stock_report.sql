-- Function: get_pivoted_stock_report()
-- Description: Generate pivoted stock report per location per month
-- Complexity: Advanced
-- Returns: product_name, sku, month, location_name, stock_at_location

CREATE TEMP TABLE IF NOT EXISTS pivoted_stock_report_result AS
SELECT 
    p.name as product_name, 
    p.sku, 
    strftime('%Y-%m', t.transaction_date) as month,
    l.name as location_name,
    SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END) -
    SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END) as stock_at_location
FROM products p
LEFT JOIN transactions t ON p.id = t.product_id
LEFT JOIN locations l ON t.location_id = l.id
WHERE t.transaction_date >= datetime('now', '-6 months')
    AND t.transaction_date IS NOT NULL
GROUP BY p.id, p.name, p.sku, strftime('%Y-%m', t.transaction_date), l.name
HAVING stock_at_location > 0
ORDER BY p.name, month DESC, l.name;

-- Function to get pivoted stock report data
CREATE TEMP VIEW get_pivoted_stock_report AS
SELECT * FROM pivoted_stock_report_result; 