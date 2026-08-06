import {google} from "@ai-sdk/google"
import { convertToModelMessages, stepCountIs, streamText, UIMessage } from "ai"
import {getReadme} from "@/lib/tools/getReadme"
import { getFileStructure } from "@/lib/tools/getFileStructure";
import { getRepoMetadata } from "@/lib/tools/getRepoMetadata";
import { getOpenIssues } from "@/lib/tools/getOpenIssues";

export async function POST(req : Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
        model : google("gemini-2.0-flash"),
        system: `You are a helpful GitHub repository assistant. Your job is to help
      users understand any public GitHub repo — what it does, how it's structured,
      and how a new contributor could get started with it.

      Always use the available tools to fetch real data before answering —
      never guess or make up information about a repo.

      When explaining a repo, be clear and beginner-friendly. If the user
      is looking for issues to work on, prioritize ones labeled
      "good first issue" when available.`,
      messages : await convertToModelMessages(messages),
      tools:{
        getReadme,
        getFileStructure,
        getRepoMetadata,
        getOpenIssues,
      },
      stopWhen: stepCountIs(5)
    });

    return result.toUIMessageStreamResponse();
}