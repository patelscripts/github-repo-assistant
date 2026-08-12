import SignupForm from "@/components/auth/SignUpForm";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-page text-text gap-6 px-4">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold font-sans">repo-assistant</h1>
        <p className="text-sm text-text-muted font-mono">
          Create an account to get started
        </p>
      </div>
      <SignupForm />
      <p className="text-xs text-text-dim">
        Already have an account?{" "}
        <a href="/login" className="underline text-text-muted">
          Sign in
        </a>
      </p>
    </div>
  );
}