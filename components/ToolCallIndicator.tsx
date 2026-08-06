interface ToolCallIndicatorProps {
  toolName: string;
}

const toolLabels: Record<string, string> = {
  getReadme: "Reading README",
  getFileStructure: "Exploring file structure",
  getRepoMetadata: "Fetching repo info",
  getOpenIssues: "Looking up issues",
};

export default function ToolCallIndicator({ toolName }: ToolCallIndicatorProps) {
  const label = toolLabels[toolName] || `Running ${toolName}`;

  return (
    <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
      <span className="animate-pulse">▸</span> {label}...
    </div>
  );
}