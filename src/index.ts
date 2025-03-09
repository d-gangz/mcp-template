// currently only scaffold with start and end. Have not added any tools, prompts or resources yet.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"; // MCP server implementation
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"; // Transport layer for MCP communication
import dotenv from "dotenv"; // For loading environment variables from a .env file
import { z } from "zod";

// Initialize dotenv to load environment variables from .env file
dotenv.config();

// Create a new MCP server instance
// This is the core server that will handle all MCP protocol operations
const server = new McpServer({
  name: "mcp-template", // Identifies this server in the MCP ecosystem
  version: "1.0.0", // Semantic versioning of the server implementation
});

/**
 * Main function to initialize and start the MCP server
 * This function sets up the transport layer and connects the server
 */
async function main() {
  try {
    // Log startup message
    console.error("MCP Template Server starting...");

    // Create a stdio transport for communication
    // This allows the server to communicate via standard input/output streams
    const transport = new StdioServerTransport();

    // Connect the server to the transport
    // This starts listening for incoming MCP protocol messages
    await server.connect(transport);

    // Log successful startup
    console.error("MCP Template Server running...");
  } catch (error) {
    // Handle any errors during server startup
    console.error("Error starting MCP Template Server:", error);
    process.exit(1); // Exit with error code 1
  }
}

// Start the server by calling the main function
main();
