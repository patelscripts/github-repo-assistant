import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-page text-text gap-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold font-sans">repo-assistant</h1>
        <p className="text-sm text-text-muted font-mono">
          Sign in to explain and save GitHub repos
        </p>
      </div>
      <LoginForm />
    </div>
  );
}