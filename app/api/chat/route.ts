import {google} from "@ai-sdk/google"
import {groq} from "@ai-sdk/groq"
import { convertToModelMessages, stepCountIs, streamText, UIMessage } from "ai"
import {getReadme} from "@/lib/tools/getReadme"
import { getFileStructure } from "@/lib/tools/getFileStructure";
import { getRepoMetadata } from "@/lib/tools/getRepoMetadata";
import { getOpenIssues } from "@/lib/tools/getOpenIssues";

function isQuotaError(error : unknown) : boolean{
  const messages = (error as Error)?.message?.toLowerCase() || "";
  return messages.includes("quota") || messages.includes("429") || messages.includes("resouce_exhausted");
}

export async function POST(req : Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    let selectModel = google("gemini-2.5-flash");

    try{
      await streamText({
        model : selectModel,
        messages : [{role:"user", content:"ping"}]
      }).text;
    }catch(error){
      if(isQuotaError(error)){
        console.log("gemini quota has finished, now i am using groq");
        selectModel = groq("llama-3.3-70b-versatile")
      }
    }
    const result = streamText({
        model : selectModel,
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