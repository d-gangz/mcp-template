import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"; // MCP server implementation
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"; // Transport layer for MCP communication
import dotenv from "dotenv"; // For loading environment variables from a .env file
import { z } from "zod";
import path from "path";
import { fileURLToPath } from "url"; // For ES module __dirname equivalent
// Import the sample text from the resources/sample.js file. Need to use .js extension to avoid import errors.
import { sampleText } from "./resources/sample.js";

// Initialize dotenv to load environment variables from .env file
dotenv.config();

// Resolve the current directory in ES module context
// In ES modules, __dirname is not available by default, so we create it
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create a new MCP server instance
// This is the core server that will handle all MCP protocol operations
const server = new McpServer({
  name: "mcp-template", // Identifies this server in the MCP ecosystem
  version: "1.0.0", // Semantic versioning of the server implementation
});

/**
 * TOOL IMPLEMENTATION
 *
 * For operations that perform actions, have side effects, or require complex
 * parameter filtering, we use tools. Tools are function-like operations that
 * are called explicitly and may modify state.
 */

/**
 * Tool: add-numbers
 * Purpose: Adds two numbers together
 * Parameters:
 *   - a: First number to add
 *   - b: Second number to add
 * Returns: The sum of the two numbers
 */
server.tool(
  "add-numbers",
  "For any addition operation to add two numbers together",
  // Define input schema with zod for runtime validation
  {
    a: z.number().describe("First number to add"),
    b: z.number().describe("Second number to add"),
  },
  // Tool implementation function - executes when the tool is called
  async ({ a, b }) => {
    const sum = a + b;
    return {
      content: [{ type: "text", text: `The sum of ${a} and ${b} is ${sum}` }],
    };
  }
);

/**
 * THIS IS AN EXAMPLE OF DYNAMIC PROMPTING
 * Tool: meeting-agenda-generator
 * Purpose: Generates a prompt for creating a structured meeting agenda
 * Parameters:
 *   - meetingTitle: Title or purpose of the meeting
 *   - participants: Who will attend the meeting
 *   - duration: Expected duration of the meeting (e.g., "30 minutes", "1 hour")
 * Returns: A prompt for generating a structured meeting agenda
 * Note: User must provide all three required variables (meetingTitle, participants, duration).
 *       If any are missing, ask the user to provide the missing information.
 */
server.tool(
  "meeting-agenda-generator",
  // Here is separate prompting to let the LLM know it needs to collect these information
  "Creates a prompt for generating a structured meeting agenda. User must provide meetingTitle, participants, and duration. If any are missing, ask the user to provide them.",
  {
    meetingTitle: z.string().describe("Title or purpose of the meeting"),
    participants: z
      .string()
      .describe("Who will attend the meeting (roles or names)"),
    duration: z
      .string()
      .describe(
        "Expected duration of the meeting (e.g., '30 minutes', '1 hour')"
      ),
  },
  async ({ meetingTitle, participants, duration }) => {
    console.error(`[Tool] Generating meeting agenda for: ${meetingTitle}`);

    const prompt = `Create a structured agenda for a "${meetingTitle}" meeting with ${participants} that will last ${duration}.

The agenda should include:
1. Meeting Objective (1-2 sentences)
2. Discussion Topics (prioritized list with time allocations)
3. Required Preparation for Participants
4. Expected Outcomes/Deliverables
5. Next Steps and Action Items Template

Format the agenda to be clear, concise, and actionable. Ensure the timing works within the ${duration} constraint.`;

    return {
      content: [
        {
          type: "text",
          text: prompt,
        },
      ],
    };
  }
);

/**
 * Prompt: story-idea-generator
 * Purpose: Generates creative story ideas based on user-provided topics and genre preferences
 * Parameters:
 *   - topics: Comma-separated list of topics or themes to incorporate into the story ideas
 *   - genre: The preferred genre for the story (fantasy, sci-fi, mystery, etc.)
 *   - targetAudience: The intended audience for the story (children, young adult, adult)
 *   - mood: The emotional tone of the story (dark, uplifting, humorous, etc.)
 * Returns: A structured message template for generating creative story ideas
 */
server.prompt(
  "story-idea-generator",
  "Generate creative and engaging story ideas based on provided topics, genre, target audience, and mood",
  {
    topics: z
      .string()
      .describe(
        "Comma-separated list of topics or themes to incorporate into the story"
      ),
    genre: z
      .string()
      .describe(
        "Preferred genre for the story (fantasy, sci-fi, mystery, etc.)"
      ),
    mood: z
      .string()
      .describe(
        "Emotional tone of the story (dark, uplifting, humorous, etc.)"
      ),
  },
  ({ topics, genre, mood }) => {
    console.error(
      `[Prompt] Generating story ideas with topics: ${topics}, genre: ${genre}, mood: ${mood}`
    );

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `You are a creative writing assistant specializing in generating unique and engaging story ideas. Provide detailed story concepts with potential plot points, character ideas, and thematic elements.

I need creative story ideas that incorporate the following elements:
            
Topics/Themes: ${topics}
Genre: ${genre}
Mood/Tone: ${mood}

Please generate 3 unique story ideas that blend these elements together. For each idea, include:
1. A compelling title
2. A brief premise (1-2 sentences)
3. Main character concept
4. Key plot points or story arc
5. Potential themes or messages

Make the ideas distinct from each other and tailored specifically to my requirements.`,
          },
        },
      ],
    };
  }
);

/**
 * RESOURCE IMPLEMENTATION
 *
 * For read-only operations that provide data to the client, we use resources.
 * Resources are identified by URIs and are meant to be browsed and consumed
 * by clients without causing side effects.
 */

/**
 * Resource: sample-text
 * Purpose: Provides access to the content of the sample.txt file
 * URI: sample://text
 * Returns: The content of the sample.txt file
 */
server.resource("sample-text", "sample://text", async (uri) => {
  console.error(`[Resource] Providing sample text content`);
  try {
    console.error(`[Resource] Successfully loaded sample text content`);

    return {
      contents: [
        {
          uri: uri.href,
          text: sampleText,
        },
      ],
    };
  } catch (error) {
    console.error(`[Error] Failed to load sample text: ${error}`);
    return {
      contents: [
        {
          uri: uri.href,
          text: `Error: Failed to load sample text content. ${error}`,
        },
      ],
      isError: true,
    };
  }
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
