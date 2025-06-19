export const SEARCH_ANALYSIS_PROMPT = `Analyze the following user message and determine if a Google search would be helpful to provide a better response.

User message: "{userMessage}"

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

export const SEARCH_ENHANCED_PROMPT = `I have performed a Google search for: "{searchQuery}"

Search Results:
{searchResults}

Based on these search results, please provide a comprehensive answer to the user's request: {userRequest}

Please cite the sources when appropriate and provide the most current information available.`;

export const SEARCH_RECOMMENDATION_PROMPT = `The user's request may benefit from current information. Please note that a search could provide more up-to-date information for: "{searchQuery}"

User's request: {userRequest}

Please provide a helpful response, but note that for the most current information, a web search would be recommended.`;
