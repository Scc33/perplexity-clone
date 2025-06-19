import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextRequest, NextResponse } from "next/server";
import { getJson } from "serpapi";
import { Message, SearchAnalysis } from "../../../types";
import {
  SEARCH_ANALYSIS_PROMPT,
  SEARCH_ENHANCED_PROMPT,
  SEARCH_RECOMMENDATION_PROMPT,
} from "../../../prompts/Prompts";

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

  const analysisPrompt = SEARCH_ANALYSIS_PROMPT.replace(
    "{userMessage}",
    userMessage
  );

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

        enhancedPrompt = SEARCH_ENHANCED_PROMPT.replace(
          "{searchQuery}",
          searchQuery
        )
          .replace("{searchResults}", searchSnippets)
          .replace("{userRequest}", lastMessage.content);
      } else {
        enhancedPrompt = SEARCH_RECOMMENDATION_PROMPT.replace(
          "{searchQuery}",
          searchQuery
        ).replace("{userRequest}", lastMessage.content);
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
