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

### 3. Configuration with Claude Desktop

To add your MCP server to Claude Desktop:

1. Open Claude Desktop settings
2. Navigate to the "MCP Servers" section
3. Add a new server configuration:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["path/to/build/index.js"],
      "env": {
        "API_KEY": "your-api-key"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

4. Save the configuration
5. Your MCP server will now be available to Claude

## Testing

⚠️ **CRITICAL: Test all tools before deployment** ⚠️

1. Test each tool with valid inputs
2. Verify output format is correct
3. Document test results

## Key Requirements

- ✓ Use MCP SDK
- ✓ Implement comprehensive logging
- ✓ Add type definitions
- ✓ Handle errors gracefully
- ✓ Test each component individually

## Documentation

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/docs)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Server Examples](https://github.com/modelcontextprotocol/servers)

## License

MIT
