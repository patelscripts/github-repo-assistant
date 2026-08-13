interface CodeFile {
  path: string;
  content: string;
}

interface Chunk {
  id: string;
  text: string;
  filePath: string;
}

const CHUNK_SIZE = 1000; // characters
const CHUNK_OVERLAP = 200; // taaki context na tute chunk boundary pe

export function chunkFile(file: CodeFile): Chunk[] {
  const chunks: Chunk[] = [];
  const { path, content } = file;

  if (content.length <= CHUNK_SIZE) {
    chunks.push({ id: `${path}-0`, text: content, filePath: path });
    return chunks;
  }

  let start = 0;
  let index = 0;

  while (start < content.length) {
    const end = Math.min(start + CHUNK_SIZE, content.length);
    const chunkText = content.slice(start, end);

    chunks.push({
      id: `${path}-${index}`,
      text: chunkText,
      filePath: path,
    });

    start += CHUNK_SIZE - CHUNK_OVERLAP;
    index++;
  }

  return chunks;
}

export function chunkFiles(files: CodeFile[]): Chunk[] {
  return files.flatMap((file) => chunkFile(file));
}