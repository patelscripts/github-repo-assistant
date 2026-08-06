interface ToolCallIndicatorProps {
  toolName: string;
}

const toolLabels: Record<string, string> = {
  getReadme: "Reading README...",
  getFileStructure: "Exploring file structure...",
  getRepoMetadata: "Fetching repo info...",
  getOpenIssues: "Looking up issues...",
};

export default function ToolCallIndicator({ toolName }: ToolCallIndicatorProps) {
  return (
    <div className="text-sm text-gray-400 italic">
      {toolLabels[toolName] || `Running ${toolName}...`}
    </div>
  );
}