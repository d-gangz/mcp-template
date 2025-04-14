# MCP Server Template

A streamlined template for quickly creating Model Context Protocol (MCP) servers using TypeScript.

## Overview

This template provides a foundation for building MCP servers that expose data and functionality to LLM applications in a standardized way. MCP servers can:

- Expose data through **Resources** (like GET endpoints)
- Provide functionality through **Tools** (like POST endpoints)
- Define interaction patterns through **Prompts** (reusable templates)

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```bash
# Clone this template
git clone https://github.com/yourusername/mcp-template.git my-mcp-server
cd my-mcp-server

# Install dependencies
npm install
```

## Development Workflow

### 1. Planning

Before implementation, consider:
- What problem does your MCP server solve?
- What APIs or services will it use?
- What authentication requirements exist?
  - Standard API key
  - OAuth
  - Other credentials

### 2. Building and Running

```bash
# Build the project
npm run build

# Run the server locally for testing
node build/index.js
```

### 3. Configuration

You need to configure your AI assistant (like Claude Desktop or Cursor) to use this MCP server.

#### Configuration with Claude Desktop

1.  Open Claude Desktop settings.
2.  Navigate to the "MCP Servers" section.
3.  Add a new server configuration:

```json
{
  "mcpServers": {
    "my-server": { // You can choose any name for your server
      "command": "node",
      "args": ["/path/to/your/project/mcp-template/build/index.js"], // Replace with the ABSOLUTE path to the built index.js file
      "env": {
        "EXA_API_KEY": "your-exa-api-key" // Add your Exa API key here (See note below)
      },
      "disabled": false,
      "autoApprove": [] // Optionally list tools to auto-approve
    }
  }
}
```

#### Configuration with Cursor

1.  Locate your Cursor MCP configuration file (`mcp.json`). This is typically found in `~/.cursor/mcp.json` on macOS/Linux or `C:\Users\YourUser\.cursor\mcp.json` on Windows.
2.  Add or update the entry for your server:

```json
{
  // ... other configurations ...
  "mcp-template": { // Use a descriptive name for your server
    "command": "node",
    "args": ["/path/to/your/project/mcp-template/build/index.js"], // Replace with the ABSOLUTE path to the built index.js file
    "env": {
      "EXA_API_KEY": "your-exa-api-key" // Add your Exa API key here (See note below)
    }
  }
  // ... other configurations ...
}
```

**Getting your Exa API Key:**

*   This template uses the Exa AI search API. You need an API key to use the search functionality.
*   Go to the Exa dashboard: [https://dashboard.exa.ai/api-keys](https://dashboard.exa.ai/api-keys)
*   Sign up for an account if you don't have one.
*   Once logged in, navigate to the API Keys section to find or generate your key.
*   Copy the key and replace `"your-exa-api-key"` in the configuration above.

**Important:** For both Claude Desktop and Cursor, the path in `"args"` **must be the absolute path** to the compiled `index.js` file located inside the `build` directory. After running `npm run build`, you can usually get this path by:
1.  Navigating to the `build` folder in your file explorer or IDE.
2.  Right-clicking on the `index.js` file.
3.  Selecting "Copy Path" or "Copy Absolute Path".

### 4. Save and Restart

- Save the configuration file.
- Restart Claude Desktop or Cursor for the changes to take effect.
- Your MCP server should now be available to your AI assistant.

## Development Guidelines

- **Use the Cursor Rule:** When developing tools, prompts, or resources for this server, reference the `@mcp-general.mdc` Cursor rule. It contains detailed instructions, conventions, and code examples tailored for MCP server development. This will help ensure consistency and guide the AI assistant in generating correct code.
- **Build Before Running:** Always run `npm run build` after making changes to your TypeScript code. The server runs the compiled JavaScript code from the `build` directory, not the source `.ts` files.
- **Test Thoroughly:** Test each tool, prompt, and resource individually before relying on them in your AI interactions. Verify inputs, outputs, and error handling.

## Testing

⚠️ **CRITICAL: Test all tools before deployment** ⚠️

1. Test each tool with valid inputs
2. Verify output format is correct
3. Document test results

## Key Requirements

- ✓ Use MCP SDK
- ✓ Implement comprehensive logging. Note to use `console.error` instead of `console.log` for logging.
- ✓ Add type definitions
- ✓ Handle errors gracefully
- ✓ Test each component individually

## Documentation

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/introduction)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Server Examples](https://github.com/modelcontextprotocol/servers)

## License

MIT
