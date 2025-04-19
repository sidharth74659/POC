import { spawn } from "child_process";

// Spawn the server process
const server = spawn("npx", ["ts-node", "--project", "tsconfig.node.json", "src/index.ts"], {
    stdio: ["pipe", "pipe", "inherit"],
    env: { ...process.env, NODE_OPTIONS: "--loader ts-node/esm" }
});

// Spawn the client process and connect its stdio to the server
const client = spawn("npx", ["ts-node", "--project", "tsconfig.node.json", "src/client.ts"], {
    stdio: [server.stdout, server.stdin, "inherit"],
    env: { ...process.env, NODE_OPTIONS: "--loader ts-node/esm" }
});
