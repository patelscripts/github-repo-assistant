import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Chat from "@/components/chat/chat";
import SideBar from "@/components/layout/SideBar";

export default async function ChatPage() {
  // Auth gate: unauthenticated visitors get sent to the public landing
  // page. After sign-in, NextAuth redirects back here.
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="flex flex-1 w-full">
      <SideBar />
      <main className="flex-1 flex justify-center">
        <Chat />
      </main>
    </div>
  );
}
