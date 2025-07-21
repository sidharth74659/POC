-- Function: get_transaction_history_by_user()
-- Description: Show transaction history for specific users
-- Complexity: Medium
-- Returns: user_name, product_name, transaction_type, quantity, transaction_date

CREATE TEMP TABLE IF NOT EXISTS transaction_history_by_user_result AS
SELECT 
    u.full_name as user_name,
    p.name as product_name,
    t.transaction_type,
    t.quantity,
    t.transaction_date
FROM transactions t
JOIN users u ON t.user_id = u.id
JOIN products p ON t.product_id = p.id
ORDER BY t.transaction_date DESC;

-- Function to get transaction history by user data
CREATE TEMP VIEW get_transaction_history_by_user AS
SELECT * FROM transaction_history_by_user_result; 