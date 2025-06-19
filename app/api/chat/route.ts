import { NextRequest, NextResponse } from "next/server";
import { Message } from "../../../types";
import { AiRequestService } from "../../../services/AiRequestService";
import { SearchService } from "../../../services/SearchService";

const aiRequestService = new AiRequestService();
const searchService = new SearchService();

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
    const searchAnalysis = await aiRequestService.analyzeSearchNeeds(
      lastMessage.content
    );

    // Perform search if needed
    let searchResults = null;
    if (searchAnalysis.needsSearch && searchAnalysis.searchQuery) {
      searchResults = await searchService.performGoogleSearch(
        searchAnalysis.searchQuery
      );
    }

    // Create enhanced prompt based on search analysis and results
    const enhancedPrompt = aiRequestService.createEnhancedPrompt(
      lastMessage.content,
      searchAnalysis,
      searchResults
    );

    // Create final prompt with conversation context
    const finalPrompt = aiRequestService.createFinalPrompt(
      messages,
      enhancedPrompt
    );

    // Generate response using the AI model
    const responseContent = await aiRequestService.generateResponse(
      finalPrompt
    );

    return NextResponse.json({
      content: responseContent,
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
