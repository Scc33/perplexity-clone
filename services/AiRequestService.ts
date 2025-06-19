import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Message, SearchAnalysis, SearchResponse } from "../types";
import {
  SEARCH_ANALYSIS_PROMPT,
  SEARCH_ENHANCED_PROMPT,
  SEARCH_RECOMMENDATION_PROMPT,
} from "../prompts/Prompts";

// Initialize the Google Generative AI client
const genAI = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

export class AiRequestService {
  private model = genAI("gemini-2.0-flash");

  /**
   * Analyzes if a search is needed based on the user message
   */
  async analyzeSearchNeeds(userMessage: string): Promise<SearchAnalysis> {
    const analysisPrompt = SEARCH_ANALYSIS_PROMPT.replace(
      "{userMessage}",
      userMessage
    );

    try {
      const result = await this.model.doGenerate({
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

  /**
   * Generates an enhanced prompt based on search analysis and results
   */
  createEnhancedPrompt(
    userMessage: string,
    searchAnalysis: SearchAnalysis,
    searchResults: SearchResponse | null
  ): string {
    if (!searchAnalysis.needsSearch) {
      return userMessage;
    }

    const searchQuery = searchAnalysis.searchQuery || userMessage;

    if (searchResults) {
      // Include search results in the prompt
      const searchSnippets =
        searchResults.organic_results
          ?.slice(0, 3)
          .map(
            (result) =>
              `Title: ${result.title}\nSnippet: ${result.snippet}\nURL: ${result.link}`
          )
          .join("\n\n") || "No search results found.";

      return SEARCH_ENHANCED_PROMPT.replace("{searchQuery}", searchQuery)
        .replace("{searchResults}", searchSnippets)
        .replace("{userRequest}", userMessage);
    } else {
      return SEARCH_RECOMMENDATION_PROMPT.replace(
        "{searchQuery}",
        searchQuery
      ).replace("{userRequest}", userMessage);
    }
  }

  /**
   * Creates the final prompt with conversation context
   */
  createFinalPrompt(messages: Message[], enhancedPrompt: string): string {
    const context = messages
      .slice(0, -1)
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    return context
      ? `${context}\n\nUser: ${enhancedPrompt}\nAssistant:`
      : enhancedPrompt;
  }

  /**
   * Generates a response from the AI model
   */
  async generateResponse(prompt: string): Promise<string> {
    const result = await this.model.doGenerate({
      inputFormat: "prompt",
      mode: { type: "regular" },
      prompt: [{ role: "user", content: [{ type: "text", text: prompt }] }],
    });

    return result.text || "";
  }
}
