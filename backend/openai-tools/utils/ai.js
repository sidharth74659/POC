import OpenAI from "openai";
import tools from '../tools/index.js';

// Initialize OpenAI client
export const openai = new OpenAI();

/**
 * Complete a conversation with tools
 * @param {Object} args - Arguments for the OpenAI chat completion
 * @returns {Promise<Object>} - The OpenAI chat completion response
 */
export async function completeWithTools(args) {
  // Log the user's input (last message)
  console.log(`Calling LLM with: ${JSON.stringify(args.messages[args.messages.length-1]).substring(0,500)}`);

  try {
    // Call OpenAI with the current state of the conversation
    const completion = await openai.chat.completions.create(args);

    // If the model wants to use tools, handle those calls
    if (completion.choices[0].message.tool_calls) {
      const toolCalls = completion.choices[0].message.tool_calls;

      // Add the assistant's message with tool calls to the conversation
      args.messages.push(completion.choices[0].message);

      // Process each tool call
      await Promise.all(toolCalls.map(async (toolCall) => {
        try {
          const toolArgs = JSON.parse(toolCall.function.arguments);

          // Log the tool call
          console.log("\n\n" + "#".repeat(40));
          console.log(`tool_calling: ${toolCall.function.name}(${JSON.stringify(toolArgs)})`);
          
          // Call the actual tool function
          const result = await tools.functions[toolCall.function.name](toolArgs);

          // Add the tool response to the conversation
          args.messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: result
          });
        } catch (error) {
          console.error(`Error processing tool call ${toolCall.function.name}:`, error);
          // Add an error message to the conversation
          args.messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: `Error executing tool: ${error.message}`
          });
        }
      }));

      // Continue the conversation with the updated messages
      return completeWithTools(args);
    }

    // Final response from the model (no more tool calls)
    console.log("\n\n" + "#".repeat(40));
    console.log(completion.choices[0].message.content.substring(0, 500));
    return completion;
  } catch (error) {
    console.error('Error in completeWithTools:', error);
    throw error;
  }
}