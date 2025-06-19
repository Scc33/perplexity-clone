import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextRequest, NextResponse } from "next/server";
import { Message } from "../../../types";

// Initialize the Google Generative AI client
const genAI = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { messages }: { messages: Message[] } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Get the model
    const model = genAI("gemini-2.0-flash");

    // Get the last message (user's current message)
    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role !== "user") {
      return NextResponse.json(
        { error: "Last message must be from user" },
        { status: 400 }
      );
    }

    // Create a context from previous messages
    const context = messages
      .slice(0, -1)
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const prompt = context
      ? `${context}\n\nUser: ${lastMessage.content}\nAssistant:`
      : lastMessage.content;

    // Generate response using the model
    const result = await model.doGenerate({
      inputFormat: "prompt",
      mode: { type: "regular" },
      prompt: [{ role: "user", content: [{ type: "text", text: prompt }] }],
    });

    return NextResponse.json({
      content: result.text,
      role: "assistant",
    });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json(
      { error: "Failed to get response from AI" },
      { status: 500 }
    );
  }
}
