// Import new tools for operations and resources (to be implemented)
const { getOperations, getOperationById, getOperationsToolConfig, getOperationByIdToolConfig } = require("./operations.js");
const { getResources, getResourceById, getResourcesToolConfig, getResourceByIdToolConfig } = require("./resources.js");

const functions = {
    // New tools for operations
    getOperations,
    getOperationById,
    // New tools for resources
    getResources,
    getResourceById,
}

const configsArray = [
    // Register new tool configs
    getOperationsToolConfig,
    getOperationByIdToolConfig,
    getResourcesToolConfig,
    getResourceByIdToolConfig,
]

module.exports = {
    functions,
    configsArray
}