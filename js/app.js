let db = null;
let middleware = null;
let availableFunctions = [];
let currentResults = [];
let filteredResults = [];
let currentPage = 1;
let itemsPerPage = 20;

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
        
        updateStatus('Loading SQL functions...', 'info');
        
        // Load all function files
        await loadAllFunctions();
        
        updateStatus('Initializing middleware...', 'info');
        
        // Initialize middleware
        middleware = new SQLFunctionMiddleware(db);
        
        updateStatus('Loading function registry...', 'info');
        
        // Wait for function registry to load
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Load available functions
        availableFunctions = await middleware.getAvailableFunctions();
        
        updateStatus('Database ready!', 'success');
        
        // Load predefined functions into dropdown
        loadAvailableFunctions();
        
        // Enable buttons
        document.getElementById('executeBtn').disabled = false;
        document.getElementById('customExecuteBtn').disabled = false;
        
    } catch (error) {
        console.error('Database initialization error:', error);
        updateStatus('Error initializing database: ' + error.message, 'error');
    }
}

// Load all SQL function files
async function loadAllFunctions() {
    const functionFiles = [
        'database/functions/current_stock.sql',
        'database/functions/products_by_location.sql',
        'database/functions/products_by_status.sql',
        'database/functions/active_products.sql',
        'database/functions/recent_movements.sql',
        'database/functions/low_stock_products.sql',
        'database/functions/transaction_history_by_user.sql',
        'database/functions/negative_stock_detection.sql',
        'database/functions/missing_location_transactions.sql',
        'database/functions/monthly_stock_changes.sql',
        'database/functions/location_capacity_analysis.sql',
        'database/functions/data_integrity_check.sql',
        'database/functions/pivoted_stock_report.sql',
        'database/functions/function_loader.sql'
    ];

    for (const file of functionFiles) {
        try {
            const response = await fetch(file);
            const sqlScript = await response.text();
            db.exec(sqlScript);
        } catch (error) {
            console.error(`Error loading function file ${file}:`, error);
        }
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

// Load available functions into dropdown
function loadAvailableFunctions() {
    const select = document.getElementById('querySelect');
    
    // Clear existing options
    select.innerHTML = '<option value="">Choose a function...</option>';
    
    availableFunctions.forEach(func => {
        const option = document.createElement('option');
        option.value = func.name;
        option.textContent = `${func.name} (${func.complexity})`;
        select.appendChild(option);
    });
}

// Handle function selection
document.getElementById('querySelect').addEventListener('change', async (e) => {
    const functionName = e.target.value;
    const queryInfo = document.getElementById('queryInfo');
    
    if (functionName && await middleware.isValidFunction(functionName)) {
        const functionInfo = await middleware.getFunctionInfo(functionName);
        document.getElementById('queryName').textContent = functionName;
        document.getElementById('queryDescription').textContent = functionInfo.description;
        document.getElementById('complexityBadge').textContent = functionInfo.complexity;
        document.getElementById('complexityBadge').className = `complexity-badge complexity-${functionInfo.complexity}`;
        queryInfo.style.display = 'block';
    } else {
        queryInfo.style.display = 'none';
    }
});

// Execute predefined function
function executePredefinedQuery() {
    const functionName = document.getElementById('querySelect').value;
    if (!functionName) {
        alert('Please select a function first.');
        return;
    }

    executeFunction(functionName);
}

// Execute custom SQL
function executeCustomSql() {
    const sql = document.getElementById('customSql').value.trim();
    if (!sql) {
        alert('Please enter a SQL query.');
        return;
    }

    executeCustomQuery(sql);
}

// Execute function using middleware
async function executeFunction(functionName) {
    showLoading();
    
    try {
        updateStatus('Executing function...', 'info');
        
        // Execute the function using middleware
        const result = await middleware.executeFunction(functionName);
        
        if (!result.success) {
            displayError('Function execution error: ' + result.error);
            updateStatus('Function execution failed.', 'error');
            return;
        }
        
        if (result.rowCount === 0) {
            displayError('No results found for this function.');
            return;
        }
        
        displayResults(result, functionName);
        
        updateStatus(`Function executed successfully. ${result.rowCount} rows returned.`, 'success');
        
    } catch (error) {
        console.error('Function execution error:', error);
        displayError('Function execution error: ' + error.message);
        updateStatus('Function execution failed.', 'error');
    } finally {
        hideLoading();
    }
}

// Execute custom query using middleware
async function executeCustomQuery(sql) {
    showLoading();
    
    try {
        updateStatus('Executing custom query...', 'info');
        
        // Execute the custom query using middleware
        const result = await middleware.executeCustomQuery(sql);
        
        if (!result.success) {
            displayError('Query execution error: ' + result.error);
            updateStatus('Query execution failed.', 'error');
            return;
        }
        
        if (result.rowCount === 0) {
            displayError('No results found for this query.');
            return;
        }
        
        displayResults(result, 'Custom SQL Query');
        
        updateStatus(`Query executed successfully. ${result.rowCount} rows returned.`, 'success');
        
    } catch (error) {
        console.error('Query execution error:', error);
        displayError('Query execution error: ' + error.message);
        updateStatus('Query execution failed.', 'error');
    } finally {
        hideLoading();
    }
}

// Display results with search and pagination
function displayResults(result, queryName) {
    const container = document.getElementById('resultsContent');
    
    if (!result.data || result.data.length === 0) {
        container.innerHTML = '<p>No results found.</p>';
        hideResultsControls();
        return;
    }

    // Store current results for search and pagination
    currentResults = result.data;
    currentPage = 1;
    
    // Apply search filter (empty search shows all results)
    filterResults();
    
    // Display the filtered results
    displayFilteredResults(result.columns);
    
    // Show search and pagination controls
    showResultsControls();
}

// Filter results based on search input
function filterResults() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        filteredResults = [...currentResults];
    } else {
        filteredResults = currentResults.filter(row => 
            row.some(cell => 
                cell !== null && cell !== undefined && 
                cell.toString().toLowerCase().includes(searchTerm)
            )
        );
    }
    
    // Reset to first page when filtering
    currentPage = 1;
}

// Display filtered results with pagination
function displayFilteredResults(columns) {
    const container = document.getElementById('resultsContent');
    
    if (filteredResults.length === 0) {
        container.innerHTML = '<p>No results match your search criteria.</p>';
        hideResultsControls();
        return;
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredResults.slice(startIndex, endIndex);
    
    // Update pagination info
    updatePaginationInfo(filteredResults.length, totalPages);
    
    // Generate table HTML
    let html = `
        <div class="results-header">
            <div class="results-count">${filteredResults.length} rows returned</div>
        </div>
        <div class="results-table-container">
            <table class="results-table">
                <thead>
                    <tr>
                        ${columns.map(col => `<th>${col}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
    `;

    pageData.forEach(row => {
        html += '<tr>';
        row.forEach(value => {
            html += `<td>${value !== null && value !== undefined ? value : '<em>null</em>'}</td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
    
    // Update pagination controls
    updatePaginationControls(totalPages);
}

// Update pagination info
function updatePaginationInfo(totalResults, totalPages) {
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalResults);
    
    document.getElementById('paginationInfo').textContent = 
        `Showing ${startIndex}-${endIndex} of ${totalResults} results`;
}

// Update pagination controls
function updatePaginationControls(totalPages) {
    const controls = document.getElementById('paginationControls');
    controls.innerHTML = '';
    
    if (totalPages <= 1) {
        return;
    }
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '←';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            displayFilteredResults(getCurrentColumns());
        }
    };
    controls.appendChild(prevBtn);
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = i === currentPage ? 'active' : '';
        pageBtn.onclick = () => {
            currentPage = i;
            displayFilteredResults(getCurrentColumns());
        };
        controls.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '→';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayFilteredResults(getCurrentColumns());
        }
    };
    controls.appendChild(nextBtn);
}

// Get current columns (helper function)
function getCurrentColumns() {
    // This is a simplified approach - in a real app, you'd store columns with results
    const firstRow = currentResults[0];
    if (firstRow) {
        return Array.from({ length: firstRow.length }, (_, i) => `Column ${i + 1}`);
    }
    return [];
}

// Show results controls
function showResultsControls() {
    document.getElementById('resultsControls').style.display = 'flex';
}

// Hide results controls
function hideResultsControls() {
    document.getElementById('resultsControls').style.display = 'none';
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
    if (currentResults.length > 0) {
        filterResults();
        displayFilteredResults(getCurrentColumns());
    }
});

// Display error
function displayError(message) {
    const container = document.getElementById('resultsContent');
    container.innerHTML = `<div class="error-message">${message}</div>`;
    hideResultsControls();
}

// Show/hide loading
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('resultsContent').innerHTML = '';
    hideResultsControls();
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
    document.getElementById('searchInput').value = '';
    currentResults = [];
    filteredResults = [];
    currentPage = 1;
    hideResultsControls();
    updateStatus('Results cleared.', 'info');
}

// Initialize the application
window.addEventListener('load', initDatabase); 