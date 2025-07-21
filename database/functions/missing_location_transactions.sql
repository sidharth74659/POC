-- Function: get_missing_location_transactions()
-- Description: Flag transactions missing location IDs or timestamps
-- Complexity: Edge
-- Returns: transaction_id, product_name, transaction_type, quantity, user_name, transaction_date, validation_status

CREATE TEMP TABLE IF NOT EXISTS missing_location_transactions_result AS
SELECT 
    t.id as transaction_id, 
    p.name as product_name, 
    t.transaction_type,
    t.quantity, 
    u.full_name as user_name, 
    t.transaction_date,
    CASE 
        WHEN t.location_id IS NULL THEN 'MISSING_LOCATION'
        WHEN t.transaction_date IS NULL THEN 'MISSING_TIMESTAMP'
        ELSE 'VALID' 
    END as validation_status
FROM transactions t
JOIN products p ON t.product_id = p.id
JOIN users u ON t.user_id = u.id
WHERE t.location_id IS NULL OR t.transaction_date IS NULL
ORDER BY t.transaction_date DESC;

-- Function to get missing location transactions data
CREATE TEMP VIEW get_missing_location_transactions AS
SELECT * FROM missing_location_transactions_result; 