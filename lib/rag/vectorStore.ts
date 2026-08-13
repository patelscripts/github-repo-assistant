import { ChromaClient } from "chromadb";
import { generateEmbedding, generateEmbeddings } from "./embeddings";

const chroma = new ChromaClient({ path: "http://localhost:8000" });

interface Chunk {
  id: string;
  text: string;
  filePath: string;
}

// Har repo ke liye alag collection — naam "owner-repo" format mein
function getCollectionName(owner: string, repo: string): string {
  return `repo-${owner}-${repo}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

export async function indexRepoChunks(owner: string, repo: string, chunks: Chunk[]) {
  const collection = await chroma.getOrCreateCollection({
    name: getCollectionName(owner, repo),
  });

  const embeddings = await generateEmbeddings(chunks.map((c) => c.text));

  await collection.add({
    ids: chunks.map((c) => c.id),
    embeddings,
    documents: chunks.map((c) => c.text),
    metadatas: chunks.map((c) => ({ filePath: c.filePath })),
  });

  return { indexed: chunks.length };
}

export async function searchRepoCode(owner: string, repo: string, query: string, topK = 5) {
  const collection = await chroma.getOrCreateCollection({
    name: getCollectionName(owner, repo),
  });

  const queryEmbedding = await generateEmbedding(query);

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK,
  });

  return results.documents[0]?.map((doc, i) => ({
    text: doc,
    filePath: (results.metadatas[0]?.[i] as { filePath: string })?.filePath,
  })) || [];
}