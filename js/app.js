let db = null;
let predefinedQueries = {};

// Initialize SQL.js and load database
async function initDatabase() {
    try {
        updateStatus('Loading SQL.js...', 'info');
        
        // Initialize SQL.js
        const SQL = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });
        
        updateStatus('Creating database...', 'info');
        
        // Create new database
        db = new SQL.Database();
        
        // Load the SQL initialization script
        const response = await fetch('database/init.sql');
        const sqlScript = await response.text();
        
        updateStatus('Executing initialization script...', 'info');
        
        // Execute the SQL script
        db.exec(sqlScript);
        
        updateStatus('Database ready!', 'success');
        
        // Load predefined queries
        loadPredefinedQueries();
        
        // Enable buttons
        document.getElementById('executeBtn').disabled = false;
        document.getElementById('customExecuteBtn').disabled = false;
        
    } catch (error) {
        console.error('Database initialization error:', error);
        updateStatus('Error initializing database: ' + error.message, 'error');
    }
}

// Update status bar
function updateStatus(message, type = 'info') {
    const statusBar = document.getElementById('statusBar');
    const statusText = document.getElementById('statusText');
    
    statusText.textContent = message;
    
    statusBar.className = 'status-bar';
    if (type === 'error') {
        statusBar.classList.add('error');
    } else if (type === 'warning') {
        statusBar.classList.add('warning');
    }
}

// Predefined queries
const queries = {
    'current_stock': {
        name: 'Current Stock Per Product',
        description: 'Get total stock per product with status indicators',
        sql: `SELECT product_name, sku, category, current_quantity, stock_status 
              FROM current_stock 
              ORDER BY current_quantity DESC`,
        complexity: 'simple'
    },
    'products_by_location': {
        name: 'Products by Location',
        description: 'List all products with their current locations',
        sql: `SELECT p.name as product_name, p.sku, l.name as location_name,
              COALESCE(SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END), 0) -
              COALESCE(SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END), 0) as quantity_at_location
              FROM products p
              LEFT JOIN transactions t ON p.id = t.product_id
              LEFT JOIN locations l ON t.location_id = l.id
              WHERE p.status = 'active'
              GROUP BY p.id, p.name, p.sku, l.name
              HAVING quantity_at_location > 0
              ORDER BY p.name, l.name`,
        complexity: 'simple'
    },
    'products_by_status': {
        name: 'Products by Status',
        description: 'Count products by status (active/inactive)',
        sql: `SELECT status, COUNT(*) as product_count
              FROM products
              GROUP BY status
              ORDER BY product_count DESC`,
        complexity: 'simple'
    },
    'recent_movements': {
        name: 'Recent Movements (Last 7 Days)',
        description: 'List assets moved in the last 7 days by user and location',
        sql: `SELECT p.name as product_name, p.sku, t.transaction_type, t.quantity,
              u.full_name as user_name, l.name as location_name, t.transaction_date
              FROM transactions t
              JOIN products p ON t.product_id = p.id
              JOIN users u ON t.user_id = u.id
              LEFT JOIN locations l ON t.location_id = l.id
              WHERE t.transaction_date >= datetime('now', '-7 days')
              ORDER BY t.transaction_date DESC`,
        complexity: 'medium'
    },
    'low_stock_products': {
        name: 'Low Stock Products',
        description: 'Find products with stock below minimum threshold',
        sql: `SELECT product_name, sku, category, current_quantity, min_stock_level,
              (min_stock_level - current_quantity) as shortage
              FROM current_stock
              WHERE current_quantity < min_stock_level
              ORDER BY shortage DESC`,
        complexity: 'medium'
    },
    'negative_stock_detection': {
        name: 'Negative Stock Detection',
        description: 'Detect assets with negative stock or status issues',
        sql: `SELECT product_name, sku, current_quantity, stock_status,
              CASE WHEN current_quantity < 0 THEN 'NEGATIVE_STOCK' 
                   WHEN stock_status = 'low_stock' THEN 'LOW_STOCK' 
                   ELSE 'NORMAL' END as alert_type
              FROM current_stock
              WHERE current_quantity < 0 OR stock_status = 'low_stock'
              ORDER BY current_quantity ASC`,
        complexity: 'complex'
    },
    'missing_location_transactions': {
        name: 'Transactions Missing Location IDs',
        description: 'Flag transactions missing location IDs or timestamps',
        sql: `SELECT t.id as transaction_id, p.name as product_name, t.transaction_type,
              t.quantity, u.full_name as user_name, t.transaction_date,
              CASE WHEN t.location_id IS NULL THEN 'MISSING_LOCATION'
                   WHEN t.transaction_date IS NULL THEN 'MISSING_TIMESTAMP'
                   ELSE 'VALID' END as validation_status
              FROM transactions t
              JOIN products p ON t.product_id = p.id
              JOIN users u ON t.user_id = u.id
              WHERE t.location_id IS NULL OR t.transaction_date IS NULL
              ORDER BY t.transaction_date DESC`,
        complexity: 'edge'
    },
    'monthly_stock_changes': {
        name: 'Monthly Stock Changes',
        description: 'Calculate stock changes over time with trends',
        sql: `SELECT p.name as product_name, p.sku, strftime('%Y-%m', t.transaction_date) as month,
              SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END) as total_inbound,
              SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END) as total_outbound,
              SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END) - 
              SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END) as net_change
              FROM products p
              LEFT JOIN transactions t ON p.id = t.product_id
              WHERE t.transaction_date >= datetime('now', '-3 months')
              GROUP BY p.id, p.name, p.sku, strftime('%Y-%m', t.transaction_date)
              ORDER BY p.name, month DESC`,
        complexity: 'complex'
    },
    'location_capacity_analysis': {
        name: 'Location Capacity Analysis',
        description: 'Multi-table joins with aggregation for location analysis',
        sql: `SELECT l.name as location_name, l.capacity,
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
              ORDER BY capacity_utilization_percent DESC`,
        complexity: 'complex'
    },
    'data_integrity_check': {
        name: 'Data Integrity Validation',
        description: 'Validate data integrity constraints and handle NULL values',
        sql: `SELECT 'products' as table_name, COUNT(*) as total_records,
              COUNT(CASE WHEN name IS NULL OR name = '' THEN 1 END) as missing_names,
              COUNT(CASE WHEN sku IS NULL OR sku = '' THEN 1 END) as missing_skus,
              COUNT(CASE WHEN status IS NULL THEN 1 END) as missing_status
              FROM products
              UNION ALL
              SELECT 'transactions' as table_name, COUNT(*) as total_records,
              COUNT(CASE WHEN product_id IS NULL THEN 1 END) as missing_product_id,
              COUNT(CASE WHEN user_id IS NULL THEN 1 END) as missing_user_id,
              COUNT(CASE WHEN transaction_type IS NULL THEN 1 END) as missing_type
              FROM transactions`,
        complexity: 'edge'
    },
    'pivoted_stock_report': {
        name: 'Pivoted Stock Report per Location per Month',
        description: 'Generate pivoted stock report per location per month',
        sql: `SELECT p.name as product_name, p.sku, strftime('%Y-%m', t.transaction_date) as month,
              l.name as location_name,
              SUM(CASE WHEN t.transaction_type = 'inbound' THEN t.quantity ELSE 0 END) -
              SUM(CASE WHEN t.transaction_type = 'outbound' THEN t.quantity ELSE 0 END) as stock_at_location
              FROM products p
              LEFT JOIN transactions t ON p.id = t.product_id
              LEFT JOIN locations l ON t.location_id = l.id
              WHERE t.transaction_date >= datetime('now', '-6 months')
              GROUP BY p.id, p.name, p.sku, strftime('%Y-%m', t.transaction_date), l.name
              HAVING stock_at_location > 0
              ORDER BY p.name, month DESC, l.name`,
        complexity: 'advanced'
    }
};

// Load predefined queries into dropdown
function loadPredefinedQueries() {
    const select = document.getElementById('querySelect');
    
    Object.keys(queries).forEach(key => {
        predefinedQueries[key] = queries[key];
        const option = document.createElement('option');
        option.value = key;
        option.textContent = queries[key].name;
        select.appendChild(option);
    });
}

// Handle query selection
document.getElementById('querySelect').addEventListener('change', (e) => {
    const queryId = e.target.value;
    const queryInfo = document.getElementById('queryInfo');
    
    if (queryId && predefinedQueries[queryId]) {
        const query = predefinedQueries[queryId];
        document.getElementById('queryName').textContent = query.name;
        document.getElementById('queryDescription').textContent = query.description;
        document.getElementById('complexityBadge').textContent = query.complexity;
        document.getElementById('complexityBadge').className = `complexity-badge complexity-${query.complexity}`;
        queryInfo.style.display = 'block';
    } else {
        queryInfo.style.display = 'none';
    }
});

// Execute predefined query
function executePredefinedQuery() {
    const queryId = document.getElementById('querySelect').value;
    if (!queryId) {
        alert('Please select a query first.');
        return;
    }

    const query = predefinedQueries[queryId];
    executeQuery(query.sql, query.name);
}

// Execute custom SQL
function executeCustomSql() {
    const sql = document.getElementById('customSql').value.trim();
    if (!sql) {
        alert('Please enter a SQL query.');
        return;
    }

    executeQuery(sql, 'Custom SQL Query');
}

// Execute query and display results
function executeQuery(sql, queryName) {
    showLoading();
    
    try {
        updateStatus('Executing query...', 'info');
        
        // Execute the query
        const results = db.exec(sql);
        
        if (results.length === 0) {
            displayError('No results found for this query.');
            return;
        }
        
        const resultSet = results[0];
        displayResults(resultSet, queryName);
        
        updateStatus(`Query executed successfully. ${resultSet.values.length} rows returned.`, 'success');
        
    } catch (error) {
        console.error('Query execution error:', error);
        displayError('Query execution error: ' + error.message);
        updateStatus('Query execution failed.', 'error');
    } finally {
        hideLoading();
    }
}

// Display results
function displayResults(resultSet, queryName) {
    const container = document.getElementById('resultsContent');
    
    if (!resultSet || !resultSet.values || resultSet.values.length === 0) {
        container.innerHTML = '<p>No results found.</p>';
        return;
    }

    const columns = resultSet.columns;
    const values = resultSet.values;
    
    let html = `
        <div class="results-header">
            <div class="results-count">${values.length} rows returned</div>
        </div>
        <table class="results-table">
            <thead>
                <tr>
                    ${columns.map(col => `<th>${col}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
    `;

    values.forEach(row => {
        html += '<tr>';
        row.forEach(value => {
            html += `<td>${value !== null && value !== undefined ? value : '<em>null</em>'}</td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// Display error
function displayError(message) {
    const container = document.getElementById('resultsContent');
    container.innerHTML = `<div class="error-message">${message}</div>`;
}

// Show/hide loading
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('resultsContent').innerHTML = '';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Clear results
function clearResults() {
    document.getElementById('resultsContent').innerHTML = '';
    document.getElementById('querySelect').value = '';
    document.getElementById('queryInfo').style.display = 'none';
    document.getElementById('customSql').value = '';
    updateStatus('Results cleared.', 'info');
}

// Initialize the application
window.addEventListener('load', initDatabase); 