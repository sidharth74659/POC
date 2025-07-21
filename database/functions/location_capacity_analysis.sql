-- Function: get_location_capacity_analysis()
-- Description: Multi-table joins with aggregation for location analysis
-- Complexity: Complex
-- Returns: location_name, capacity, unique_products, total_stock, capacity_utilization_percent

CREATE TEMP TABLE IF NOT EXISTS location_capacity_analysis_result AS
SELECT 
    l.name as location_name, 
    l.capacity,
    COUNT(DISTINCT t.product_id) as unique_products,
    SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END) -
    SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END) as total_stock,
    ROUND(
        (SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END) -
         SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END)) * 100.0 / l.capacity, 2
    ) as capacity_utilization_percent
FROM locations l
LEFT JOIN transactions t ON l.id = t.location_id
WHERE l.status = 'active'
GROUP BY l.id, l.name, l.capacity
ORDER BY capacity_utilization_percent DESC;

-- Function to get location capacity analysis data
CREATE TEMP VIEW get_location_capacity_analysis AS
SELECT * FROM location_capacity_analysis_result; 