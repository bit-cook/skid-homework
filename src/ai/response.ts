import type { ProblemSolution } from "@/store/problems-store";

// SECTION: Type Definitions

export interface SolveResponse {
  problems: ProblemSolution[];
}

export interface ImproveResponse {
  improved_answer: string;
  improved_explanation: string;
}

// SECTION: Shared Utilities

/**
 * Trims markdown code fences (e.g., ```text) from a string.
 * @param content The string which may be wrapped in a markdown code block.
 * @returns The unwrapped, trimmed content.
 */
function trimMarkdownFence(content: string): string {
  const regex = /^```(?:\w+\s*)?\n?([\s\S]*)\n?```$/;
  const match = content.trim().match(regex);
  return match ? match[1].trim() : content.trim();
}

/**
 * Extracts content associated with a specific header key from a text block.
 * @param text The full text block.
 * @param key The specific header key (e.g., "### ANSWER").
 * @returns The extracted content or empty string.
 */
function extractSection(text: string, key: string): string {
  // Regex Explanation:
  // 1. We look for the literal key (e.g., ### ANSWER).
  // 2. We match everything [\s\S]*? (non-greedy) until...
  // 3. We hit another header (starting with ###) OR the Separator OR the End of String ($).
  const regex = new RegExp(
    `${escapeRegExp(key)}\\s*([\\s\\S]*?)(?=(?:###|---PROBLEM_SEPARATOR---|$))`,
    "i",
  );
  const match = text.match(regex);
  return match && match[1] ? match[1].trim() : "";
}

/**
 * Helper to escape special regex characters in the key.
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

// SECTION: Solve Response Parsing

/**
 * Parses a string response from the AI for a "solve" request in MarkdownKV format.
 * @param response The raw string response from the AI.
 * @returns A SolveResponse object.
 */
export function parseSolveResponse(response: string): SolveResponse {
  const content = trimMarkdownFence(response);

  // 1. Split by the problem separator if multiple problems exist
  const problemChunks = content.split("---PROBLEM_SEPARATOR---");

  const problems: ProblemSolution[] = [];

  for (const chunk of problemChunks) {
    if (!chunk.trim()) continue;

    const problemText = extractSection(chunk, "### PROBLEM_TEXT");
    const explanation = extractSection(chunk, "### EXPLANATION");
    const answer = extractSection(chunk, "### ANSWER");

    // Only add if we successfully extracted at least one field to avoid empty trash
    if (problemText || explanation || answer) {
      problems.push({
        problem: problemText,
        explanation: explanation,
        answer: answer,
      });
    }
  }

  // Fallback: If parsing failed completely, return raw content in explanation
  if (problems.length === 0 && content.trim()) {
    return {
      problems: [
        {
          problem: "Error parsing problem text",
          answer: "",
          explanation: content, // Return full raw text so user sees something
        },
      ],
    };
  }

  return { problems };
}

// SECTION: Improve Response Parsing

/**
 * Parses a string response from the AI for an "improve" request in MarkdownKV format.
 * @param response The raw string response from the AI.
 * @returns An ImproveResponse object.
 */
export function parseImproveResponse(response: string): ImproveResponse | null {
  const content = trimMarkdownFence(response);

  const improvedExplanation = extractSection(
    content,
    "### IMPROVED_EXPLANATION",
  );
  const improvedAnswer = extractSection(content, "### IMPROVED_ANSWER");

  if (!improvedExplanation && !improvedAnswer) {
    console.error("Failed to parse Improve Response keys.");
    return null;
  }

  return {
    improved_answer: improvedAnswer,
    improved_explanation: improvedExplanation,
  };
}
