const { OpenAPIV3 } = require("openapi-types");
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { CallToolRequestSchema, ListToolsRequestSchema } = require("@modelcontextprotocol/sdk/types.js");
const axios = require("axios");
module.exports = class OpenApiMCPSeverConverter {
    openApiDoc;
    options;
    tools;
    mcpTools;
    server;
    constructor(openApiDoc, options) {
        this.openApiDoc = openApiDoc;
        this.options = options;
        this.tools = this.analyzeOpenApiSchema();
        this.mcpTools = this.createMcpTools();
        this.server = this.initializeServer();
    }
    getServer() {
        return this.server;
    }
    getMcpTools() {
        return this.mcpTools;
    }
    getTools() {
        return this.tools;
    }
    initializeServer() {
        const server = new Server({ name: "github-mcp-server", version: "1.0.0" }, { capabilities: { tools: {} } });
        server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: this.mcpTools
        }));
        server.setRequestHandler(CallToolRequestSchema, async (request) => {
            try {
                const tool = this.tools.find(t => t.operationId === request.params.name);
                if (!tool)
                    throw new Error("Tool not found");
                if (!request.params.arguments)
                    throw new Error("Arguments are required");
                const result = await axios.request({
                    method: tool.method,
                    url: tool.url,
                    data: (request.params.arguments && request.params.arguments.body) || undefined,
                    params: (request.params.arguments && request.params.arguments.query) || undefined,
                    headers: (request.params.arguments && request.params.arguments.header) || undefined,
                    // default timeout is 60 seconds
                    timeout: (this.options && this.options.timeout) || 60000,
                });
                return {
                    content: [{ type: "text", text: JSON.stringify(result.data) }],
                    isError: false
                };
            }
            catch (error) {
                throw error;
            }
        });
        return server;
    }
    createMcpTools() {
        return this.tools.map(tool => ({
            name: tool.operationId,
            description: tool.description,
            inputSchema: tool.parametersSchema
        }));
    }
    analyzeOpenApiSchema() {
        const results = [];
        const servers = this.openApiDoc.servers || [{ url: "/" }];
        for (const [path, pathItem] of Object.entries(this.openApiDoc.paths)) {
            for (const method of Object.values(OpenAPIV3.HttpMethods)) {
                const operation = pathItem && pathItem[method];
                if (!operation)
                    continue;
                const parameters = this.mergeParameters(pathItem.parameters, operation.parameters);
                const parametersSchema = this.buildParameterSchema(parameters, operation.requestBody);
                const baseUrl = servers[0].url.endsWith("/")
                    ? servers[0].url.slice(0, -1)
                    : servers[0].url;
                const fullUrl = `${baseUrl}${path}`;
                results.push({
                    path,
                    method,
                    url: fullUrl,
                    operationId: operation.operationId || `${method}:${path}`,
                    parametersSchema,
                    description: operation.description || operation.summary || "",
                });
            }
        }
        return results;
    }
    mergeParameters(pathParams, operationParams) {
        const paramMap = new Map();
        const addParams = (params = []) => {
            params.forEach((p) => {
                const param = p;
                if (param.in && param.name) {
                    paramMap.set(`${param.in}:${param.name}`, param);
                }
            });
        };
        addParams(pathParams);
        addParams(operationParams);
        return Array.from(paramMap.values());
    }
    buildParameterSchema(parameters, requestBody) {
        const schema = {
            type: "object",
            properties: {
                path: { type: "object", properties: {}, required: [] },
                query: { type: "object", properties: {}, required: [] },
                header: { type: "object", properties: {}, required: [] },
                body: { type: "object", properties: {}, required: [] },
            },
            required: [],
        };
        parameters.forEach((param) => {
            const location = param.in === "cookie" ? "header" : param.in;
            if (!["path", "query", "header"].includes(location))
                return;
            const target = schema.properties[location];
            const paramSchema = param.schema;
            target.properties[param.name] = paramSchema;
            if (param.required) {
                target.required.push(param.name);
            }
        });
        if (requestBody && "content" in requestBody) {
            const content = requestBody.content["application/json"];
            if (content && content.schema) {
                schema.properties.body = content.schema;
                if (requestBody.required) {
                    schema.required.push("body");
                }
            }
        }
        Object.keys(schema.properties).forEach((key) => {
            const prop = schema.properties[key];
            if (Object.keys(prop.properties || {}).length === 0) {
                delete schema.properties[key];
            }
        });
        return schema;
    }
}
