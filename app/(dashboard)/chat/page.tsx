import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Chat from "@/components/chat/chat";

export default async function ChatPage() {
  // Auth gate: unauthenticated visitors get sent to the public landing
  // page. After sign-in, NextAuth redirects back here.
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  return <Chat />;
}
