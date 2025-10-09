"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, User, Calendar, MapPin, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getChatWithUnreadStatus } from "@/app/chat/chat.actions";
import { useRouter } from "next/navigation";

interface Chat {
  id: string;
  rentalId: string;
  tenantId: string;
  landlordId: string;
  createdAt: Date;
  updatedAt: Date;
  hasUnread: boolean;
  rental: {
    id: string;
    name: string;
    category: string;
    address: string;
    price: number;
  };
  messages: Array<{
    id: string;
    content: string;
    senderId: string;
    createdAt: Date;
  }>;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
}

export default function ChatModal({ isOpen, onClose, currentUserId }: ChatModalProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAvatars, setUserAvatars] = useState<Record<string, string>>({});
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      loadChats();
    }
  }, [isOpen, currentUserId]);

  const loadChats = async () => {
    try {
      setLoading(true);
      const result = await getChatWithUnreadStatus(currentUserId);
      if (result.success && result.chats) {
        setChats(result.chats);
        
        // Load user avatars
        const userIds = new Set<string>();
        result.chats.forEach(chat => {
          userIds.add(chat.tenantId);
          userIds.add(chat.landlordId);
        });
        
        const avatarPromises = Array.from(userIds).map(async (userId) => {
          try {
            const response = await fetch(`/api/users/${userId}/avatar`);
            if (response.ok) {
              const blob = await response.blob();
              return { userId, avatar: URL.createObjectURL(blob) };
            }
          } catch (error) {
            console.error(`Error loading avatar for user ${userId}:`, error);
          }
          return { userId, avatar: '' };
        });
        
        const avatarResults = await Promise.all(avatarPromises);
        const avatarMap: Record<string, string> = {};
        avatarResults.forEach(({ userId, avatar }) => {
          avatarMap[userId] = avatar;
        });
        setUserAvatars(avatarMap);
      }
    } catch (error) {
      console.error("Error loading chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getOtherUserId = (chat: Chat) => {
    return chat.tenantId === currentUserId ? chat.landlordId : chat.tenantId;
  };

  const getOtherUserRole = (chat: Chat) => {
    return chat.tenantId === currentUserId ? "Landlord" : "Tenant";
  };

  const handleChatSelect = (chat: Chat) => {
    // Close the modal and navigate to the chat page
    onClose();
    router.push(`/chat/${chat.id}`);
  };

  const refreshChats = () => {
    loadChats();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Messages
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading chats...</div>
            </div>
          ) : chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
              <p className="text-muted-foreground">
                Start a conversation by clicking "Enquire" on any rental listing.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => {
                const otherUserId = getOtherUserId(chat);
                const otherUserRole = getOtherUserRole(chat);
                const lastMessage = chat.messages[0];
                
                return (
                  <div
                    key={chat.id}
                    onClick={() => handleChatSelect(chat)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                      chat.hasUnread ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={userAvatars[otherUserId]} />
                        <AvatarFallback>
                          {otherUserRole === "Landlord" ? "L" : "T"}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {otherUserRole}
                          </span>
                          {chat.hasUnread && (
                            <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                              New
                            </Badge>
                          )}
                        </div>
                        
                        <div className="mb-2">
                          <h4 className="font-medium text-sm truncate">{chat.rental.name}</h4>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">
                              {chat.rental.category}
                            </Badge>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              ₱{chat.rental.price.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{chat.rental.address}</span>
                          </div>
                        </div>
                        
                        {lastMessage && (
                          <p className="text-sm text-muted-foreground truncate">
                            {lastMessage.content.startsWith("🔵") ? "Chat opened" : lastMessage.content}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(chat.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}