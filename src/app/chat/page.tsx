import { getChatWithUnreadStatus } from "./chat.actions";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MessageCircle, Clock } from "lucide-react";
import { Chat, Message, Rental } from "@prisma/client";
import { getUserId } from "../../../actions/user.action";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

type ChatWithDetails = Chat & {
  rental: Rental;
  messages: Message[];
  hasUnread: boolean;
};

export default async function ChatListPage() {
  // Get the current user ID from authentication
  const currentUserId = await getUserId();
  
  if (!currentUserId) {
    redirect("/handler/sign-in");
  }

  const result = await getChatWithUnreadStatus(currentUserId);

  if (!result.success) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">My Conversations</h1>
            <p className="text-muted-foreground">Failed to load conversations.</p>
          </div>
        </div>
      </>
    );
  }

  const chats = result.chats || [];

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">My Conversations</h1>
          
          {chats.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageCircle className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start a conversation by clicking "Enquire" on any rental listing.
                </p>
                <Button asChild>
                  <Link href="/rentals">Browse Rentals</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {chats.map((chat: ChatWithDetails) => {
                const lastMessage = chat.messages[0];
                const isLandlord = currentUserId === chat.landlordId;
                const otherPartyName = isLandlord ? "Tenant" : "Landlord";
                
                return (
                  <Card
                    key={chat.id}
                    className={cn(
                      "hover:shadow-md transition-shadow",
                      chat.hasUnread && "ring-2 ring-blue-500 bg-blue-50"
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{chat.rental.name}</CardTitle>
                            {chat.hasUnread && (
                              <Badge variant="destructive" className="text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Conversation with {otherPartyName}
                          </p>
                        </div>
                        <Button asChild size="sm">
                          <Link href={`/chat/${chat.id}`}>Open Chat</Link>
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {lastMessage ? (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {lastMessage.content}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(lastMessage.createdAt).toLocaleDateString()} at{" "}
                            {new Date(lastMessage.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          No messages yet
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}