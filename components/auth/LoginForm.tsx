import { signIn } from "@/lib/auth";

export default function LoginForm(){
    return(
        <form
        action={async () => {
            "use server";
            await signIn("github")
        }}
        >
            <button
            type="submit"
            className="bg-inverse text-inverse-text px-4 py-2 rounded-md text-sm font-sans font-bold hover:bg-text transition-colors"
            >
                Sign in with Github
            </button>

        </form>
    )
}