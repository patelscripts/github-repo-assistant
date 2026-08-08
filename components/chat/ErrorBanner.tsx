interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-sm flex justify-between items-center">
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-500 font-bold ml-2">
          ×
        </button>
        
      )}
    </div>
  );
}