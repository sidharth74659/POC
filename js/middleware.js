// SQL Function Middleware System
// Handles function calls and returns queried data to the client

class SQLFunctionMiddleware {
    constructor(database) {
        this.db = database;
        this.functionRegistry = new Map();
        this.initialized = false;
        this.initPromise = this.loadFunctionRegistry();
    }

    // Load function registry from database
    async loadFunctionRegistry() {
        try {
            // Wait a bit to ensure all functions are loaded
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const result = this.db.exec("SELECT * FROM available_functions");
            if (result.length > 0) {
                const functions = result[0].values;
                const columns = result[0].columns;
                
                functions.forEach(row => {
                    const functionData = {};
                    columns.forEach((col, index) => {
                        functionData[col] = row[index];
                    });
                    this.functionRegistry.set(functionData.function_name, functionData);
                });
            }
            
            this.initialized = true;
            console.log(`Loaded ${this.functionRegistry.size} functions into registry`);
        } catch (error) {
            console.error('Error loading function registry:', error);
            this.initialized = false;
        }
    }

    // Wait for initialization to complete
    async waitForInit() {
        if (!this.initialized) {
            await this.initPromise;
        }
    }

    // Get list of available functions
    async getAvailableFunctions() {
        await this.waitForInit();
        
        const functions = [];
        this.functionRegistry.forEach((data, name) => {
            functions.push({
                name: name,
                description: data.description,
                complexity: data.complexity,
                returns: data.returns
            });
        });
        return functions.sort((a, b) => {
            const complexityOrder = { 'simple': 1, 'medium': 2, 'complex': 3, 'edge': 4, 'advanced': 5 };
            return complexityOrder[a.complexity] - complexityOrder[b.complexity];
        });
    }

    // Execute a function by name
    async executeFunction(functionName) {
        await this.waitForInit();
        
        try {
            // Check if function exists
            if (!this.functionRegistry.has(functionName)) {
                throw new Error(`Function '${functionName}' not found`);
            }

            const functionData = this.functionRegistry.get(functionName);
            
            // Execute the function using the corresponding view
            // The view name is the same as the function name
            const query = `SELECT * FROM ${functionName}`;
            
            const result = this.db.exec(query);
            
            if (result.length === 0) {
                return {
                    success: true,
                    data: [],
                    columns: [],
                    rowCount: 0,
                    function: functionData
                };
            }

            return {
                success: true,
                data: result[0].values,
                columns: result[0].columns,
                rowCount: result[0].values.length,
                function: functionData
            };

        } catch (error) {
            console.error(`Error executing function '${functionName}':`, error);
            return {
                success: false,
                error: error.message,
                function: functionName
            };
        }
    }

    // Execute a custom SQL query
    async executeCustomQuery(sql) {
        await this.waitForInit();
        
        try {
            const result = this.db.exec(sql);
            
            if (result.length === 0) {
                return {
                    success: true,
                    data: [],
                    columns: [],
                    rowCount: 0
                };
            }

            return {
                success: true,
                data: result[0].values,
                columns: result[0].columns,
                rowCount: result[0].values.length
            };

        } catch (error) {
            console.error('Error executing custom query:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get function information
    async getFunctionInfo(functionName) {
        await this.waitForInit();
        
        if (!this.functionRegistry.has(functionName)) {
            return null;
        }
        
        const data = this.functionRegistry.get(functionName);
        return {
            name: functionName,
            description: data.description,
            complexity: data.complexity,
            returns: data.returns
        };
    }

    // Check if function is valid
    async isValidFunction(functionName) {
        await this.waitForInit();
        return this.functionRegistry.has(functionName);
    }

    // Get functions by complexity
    async getFunctionsByComplexity(complexity) {
        await this.waitForInit();
        
        const functions = [];
        this.functionRegistry.forEach((data, name) => {
            if (data.complexity === complexity) {
                functions.push({
                    name: name,
                    description: data.description,
                    complexity: data.complexity,
                    returns: data.returns
                });
            }
        });
        return functions;
    }

    // Get all complexities
    async getComplexities() {
        await this.waitForInit();
        
        const complexities = new Set();
        this.functionRegistry.forEach((data, name) => {
            complexities.add(data.complexity);
        });
        return Array.from(complexities).sort();
    }
}

// Export the middleware class
window.SQLFunctionMiddleware = SQLFunctionMiddleware; 