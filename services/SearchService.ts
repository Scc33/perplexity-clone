import { getJson } from "serpapi";
import { SearchResponse } from "../types";

export class SearchService {
  /**
   * Performs a Google search using the SerpAPI
   */
  async performGoogleSearch(
    searchQuery: string
  ): Promise<SearchResponse | null> {
    try {
      const response = await getJson({
        engine: "google",
        api_key: process.env.SERP_API_KEY!,
        q: searchQuery,
      });
      return response as SearchResponse;
    } catch (error) {
      console.error("Error performing Google search:", error);
      return null;
    }
  }
}
