const { OpenAPIV3 } = require("openapi-types");
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
type JSONSchema = OpenAPIV3.SchemaObject;
type HTTPMethod = OpenAPIV3.HttpMethods;
interface ToolCall {
    path: string;
    method: HTTPMethod;
    url: string;
    operationId: string;
    parametersSchema: JSONSchema;
    description: string;
}
interface Options {
    timeout?: number;
}
export declare class OpenApiMCPSeverConverter {
    private openApiDoc;
    private options?;
    private tools;
    private mcpTools;
    private server;
    constructor(openApiDoc: OpenAPIV3.Document, options?: Options | undefined);
    getServer(): Server;
    getMcpTools(): any[];
    getTools(): ToolCall[];
    private initializeServer;
    private createMcpTools;
    private analyzeOpenApiSchema;
    private mergeParameters;
    private buildParameterSchema;
}
export {};
