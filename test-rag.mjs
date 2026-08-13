import { config } from "dotenv";

// Next.js auto-loads .env.local, but a standalone .mjs script has to do
// it explicitly. .env.local takes priority over .env when both exist.
config({ path: ".env.local" });
config({ path: ".env" });

import { ChromaClient } from "chromadb";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!apiKey) {
  console.error(
    "Missing GOOGLE_GENERATIVE_AI_API_KEY. Add it to .env.local before running this test."
  );
  process.exit(1);
}

const chromaHost = process.env.CHROMA_HOST ?? "localhost";
const chromaPort = Number(process.env.CHROMA_PORT ?? 8000);
const chromaSsl = (process.env.CHROMA_SSL ?? "false") === "true";

const genAI = new GoogleGenerativeAI(apiKey);
// New ChromaClient API: ssl/host/port — `path` is deprecated.
const chroma = new ChromaClient({ host: chromaHost, port: chromaPort, ssl: chromaSsl });

async function testEmbedding(text) {
  // text-embedding-004 was retired on this account — use the new
  // gemini-embedding-001 model (3072 dims) instead.
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

async function main() {
  console.log(
    `1. Chroma target: ${chromaSsl ? "https" : "http"}://${chromaHost}:${chromaPort}`
  );
  console.log("2. Testing embedding generation...");
  const vector = await testEmbedding("function to add two numbers");
  console.log(`   embedding length: ${vector.length}`);

  console.log("3. Connecting to Chroma...");
  const collection = await chroma.getOrCreateCollection({ name: "test-collection" });
  console.log(`   collection: ${collection.name}`);

  console.log("4. Adding a test document...");
  await collection.add({
    ids: ["doc1"],
    embeddings: [vector],
    documents: ["function to add two numbers"],
  });
  console.log("   document added");

  console.log("5. Querying similar documents...");
  const queryVector = await testEmbedding("addition function");
  const results = await collection.query({
    queryEmbeddings: [queryVector],
    nResults: 1,
  });
  console.log(`   matches: ${JSON.stringify(results.documents)}`);
}

main().catch((err) => {
  console.error("FAILED:", err?.message ?? err);
  process.exit(1);
});
