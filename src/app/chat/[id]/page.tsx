import { notFound, redirect } from "next/navigation";
import { getChat } from "../chat.actions";
import ChatInterface from "@/components/ChatInterface";
import Navigation from "@/components/navigation";
import { getUserId } from "../../../../actions/user.action";

interface ChatPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  // Get the current user ID from authentication
  const currentUserId = await getUserId();
  
  if (!currentUserId) {
    redirect("/handler/sign-in");
  }

  const result = await getChat(id, currentUserId);

  if (!result.success || !result.chat) {
    notFound();
  }

  // Verify that the current user is part of this chat
  if (result.chat.tenantId !== currentUserId && result.chat.landlordId !== currentUserId) {
    notFound();
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ChatInterface chat={result.chat} currentUserId={currentUserId} />
        </div>
      </div>
    </>
  );
}