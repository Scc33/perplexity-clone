import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextRequest, NextResponse } from "next/server";
import { getJson } from "serpapi";
import { Message, SearchAnalysis } from "../../../types";

// Initialize the Google Generative AI client
const genAI = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

// Function to perform Google search
async function performGoogleSearch(searchQuery: string) {
  try {
    const response = await getJson({
      engine: "google",
      api_key: process.env.SERP_API_KEY!,
      q: searchQuery,
    });
    return response;
  } catch (error) {
    console.error("Error performing Google search:", error);
    return null;
  }
}

// Function to analyze if search is needed
async function analyzeSearchNeeds(
  userMessage: string
): Promise<SearchAnalysis> {
  const model = genAI("gemini-2.0-flash");

  const analysisPrompt = `Analyze the following user message and determine if a Google search would be helpful to provide a better response.

User message: "${userMessage}"

Consider the following factors:
1. Does the message ask for current events, recent information, or time-sensitive data?
2. Does it request specific facts, statistics, or data that might be outdated?
3. Does it ask about products, services, or information that changes frequently?
4. Does it request information about specific people, places, or events that might need verification?
5. Does it ask for recommendations or reviews that would benefit from current information?

Respond in the following JSON format:
{
  "needsSearch": true/false,
  "searchQuery": "specific search terms if search is needed, otherwise null",
  "reasoning": "brief explanation of why search is or isn't needed"
}

Only respond with valid JSON.`;

  try {
    const result = await model.doGenerate({
      inputFormat: "prompt",
      mode: { type: "regular" },
      prompt: [
        { role: "user", content: [{ type: "text", text: analysisPrompt }] },
      ],
    });

    let rawText = (result.text ?? "").trim();
    // Remove code block markers if present
    if (rawText.startsWith("```")) {
      rawText = rawText
        .replace(/^```[a-zA-Z]*\n?/, "")
        .replace(/```$/, "")
        .trim();
    }
    const analysis = JSON.parse(rawText);
    return {
      needsSearch: analysis.needsSearch,
      searchQuery:
        typeof analysis.searchQuery === "string" ? analysis.searchQuery : "",
      reasoning: analysis.reasoning,
    };
  } catch (error) {
    console.error("Error analyzing search needs:", error);
    // Default to no search if analysis fails
    return {
      needsSearch: false,
      searchQuery: "",
      reasoning: "Unable to analyze search needs",
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Get the last message (user's current message)
    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role !== "user") {
      return NextResponse.json(
        { error: "Last message must be from user" },
        { status: 400 }
      );
    }

    // Analyze if search is needed
    const searchAnalysis = await analyzeSearchNeeds(lastMessage.content);

    // Perform search if needed
    let searchResults = null;
    if (searchAnalysis.needsSearch && searchAnalysis.searchQuery) {
      searchResults = await performGoogleSearch(searchAnalysis.searchQuery);
    }

    // Create a context from previous messages
    const context = messages
      .slice(0, -1)
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    // Enhance the prompt based on search analysis
    let enhancedPrompt = lastMessage.content;

    if (searchAnalysis.needsSearch) {
      const searchQuery = searchAnalysis.searchQuery || lastMessage.content;

      if (searchResults) {
        // Include search results in the prompt
        const searchSnippets =
          searchResults.organic_results
            ?.slice(0, 3)
            .map(
              (result: { title: string; snippet: string; link: string }) =>
                `Title: ${result.title}\nSnippet: ${result.snippet}\nURL: ${result.link}`
            )
            .join("\n\n") || "No search results found.";

        enhancedPrompt = `I have performed a Google search for: "${searchQuery}"

Search Results:
${searchSnippets}

Based on these search results, please provide a comprehensive answer to the user's request: ${lastMessage.content}

Please cite the sources when appropriate and provide the most current information available.`;
      } else {
        enhancedPrompt = `The user's request may benefit from current information. Please note that a search could provide more up-to-date information for: "${searchQuery}"

User's request: ${lastMessage.content}

Please provide a helpful response, but note that for the most current information, a web search would be recommended.`;
      }
    }

    const prompt = context
      ? `${context}\n\nUser: ${enhancedPrompt}\nAssistant:`
      : enhancedPrompt;

    // Get the model
    const model = genAI("gemini-2.0-flash");

    // Generate response using the model
    const result = await model.doGenerate({
      inputFormat: "prompt",
      mode: { type: "regular" },
      prompt: [{ role: "user", content: [{ type: "text", text: prompt }] }],
    });

    return NextResponse.json({
      content: result.text,
      role: "assistant",
      searchAnalysis: searchAnalysis,
      searchResults: searchResults,
    });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json(
      { error: "Failed to get response from AI" },
      { status: 500 }
    );
  }
}
