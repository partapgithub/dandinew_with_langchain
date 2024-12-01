import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";

export async function createSummaryChain(readmeContent) {
  // Initialize the LLM with API key
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY
  });

  // Define strict schema for output
  const schema = z.object({
    summary: z.string().describe("A concise summary of the GitHub repository"),
    cool_facts: z.array(z.string()).describe("A list of interesting facts about the repository")
  });

  // Create the output parser with schema
  const parser = StructuredOutputParser.fromZodSchema(schema);

  // Create the prompt template with escaped format instructions
  const formatInstructions = parser.getFormatInstructions();
  const promptTemplate = PromptTemplate.fromTemplate(`
    You are a technical analyst tasked with summarizing GitHub repositories.
    Analyze the following README content and provide:
    1. A clear, concise summary of the repository's purpose and main features
    2. A list of interesting technical facts or unique aspects about the project
    
    README Content:
    {readme_content}
    
    {format_instructions}
    
    Remember to structure your response exactly according to the schema provided.
  `);

  // Create and return the chain
  const chain = RunnableSequence.from([
    promptTemplate,
    model,
    parser
  ]);

  // Execute the chain with properly formatted input
  const response = await chain.invoke({
    readme_content: readmeContent,
    format_instructions: formatInstructions
  });

  return response;
} 