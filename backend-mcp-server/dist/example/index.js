const fs = require('fs');
const { OpenApiMCPSeverConverter } = require('../index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const path = require('path');

const openApiDoc = JSON.parse(fs.readFileSync(path.join(__dirname, 'openapi.json'), 'utf8'));

const converter = new OpenApiMCPSeverConverter(openApiDoc, { timeout: 100000 });
const server = converter.getServer();
console.log(JSON.stringify(converter.getMcpTools(), null, 2));
console.log(JSON.stringify(converter.getTools(), null, 2));
async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("GitHub MCP Server running on stdio");
}

runServer().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});