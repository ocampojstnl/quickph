"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip, X, Image as ImageIcon, FileText, Trash2, MoreVertical } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatUserProfile from "./ChatUserProfile";
import { sendMessage, markChatAsRead, deleteChatForUser } from "@/app/chat/chat.actions";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Message, Chat, Rental } from "@prisma/client";
import { stackServerApp } from "@/stack/server";

interface ChatInterfaceProps {
  chat: Chat & {
    messages: Message[];
    rental: Rental;
  };
  currentUserId: string;
}

export default function ChatInterface({ chat, currentUserId }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(chat.messages);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [isDeleting, setIsDeleting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark chat as read when component mounts
  useEffect(() => {
    const markAsRead = async () => {
      try {
        await fetch('/api/chat/mark-read', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chatId: chat.id }),
        });
      } catch (error) {
        console.error('Error marking chat as read:', error);
      }
    };
    markAsRead();
  }, [chat.id]);

  // Real-time polling for new messages
  useEffect(() => {
    const pollMessages = async () => {
      try {
        const response = await fetch(`/api/chat/${chat.id}/messages`);
        if (response.ok) {
          const data = await response.json();
          if (data.messages && data.messages.length !== messages.length) {
            setMessages(data.messages);
          }
        }
      } catch (error) {
        console.error("Error polling messages:", error);
      }
    };

    const interval = setInterval(pollMessages, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, [chat.id, messages.length]);

  // Load user names from Stack Auth
  useEffect(() => {
    const loadUserNames = async () => {
      // Include both chat participants, not just message senders
      const uniqueUserIds = [...new Set([
        ...messages.map(m => m.senderId),
        chat.landlordId,
        chat.tenantId
      ])];
      const names: Record<string, string> = {};
      
      for (const userId of uniqueUserIds) {
        try {
          // Use Stack Auth to get user details
          const response = await fetch(`/api/users/${userId}`);
          if (response.ok) {
            const userData = await response.json();
            names[userId] = userData.displayName || userData.primaryEmail || "User";
          } else {
            // Fallback naming
            if (userId === chat.landlordId) {
              names[userId] = "Landlord";
            } else if (userId === chat.tenantId) {
              names[userId] = "Tenant";
            } else {
              names[userId] = "User";
            }
          }
        } catch (error) {
          // Fallback naming
          if (userId === chat.landlordId) {
            names[userId] = "Landlord";
          } else if (userId === chat.tenantId) {
            names[userId] = "Tenant";
          } else {
            names[userId] = "User";
          }
        }
      }
      setUserNames(names);
    };

    loadUserNames(); // Always load, even if no messages yet
  }, [messages, chat.landlordId, chat.tenantId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && !selectedFile) || isLoading) return;

    setIsLoading(true);
    const messageContent = message.trim();
    setMessage("");

    try {
      let fileUrl, fileName, fileType;
      
      if (selectedFile) {
        // Upload the file to the server
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          if (uploadResult.success) {
            fileUrl = uploadResult.fileUrl;
            fileName = selectedFile.name;
            fileType = selectedFile.type;
          } else {
            throw new Error(uploadResult.error || 'Failed to upload file');
          }
        } else {
          throw new Error('Failed to upload file');
        }
        
        setSelectedFile(null);
      }

      const result = await sendMessage(
        chat.id,
        currentUserId,
        messageContent || "",
        fileUrl,
        fileName,
        fileType
      );
      
      if (result.success && result.message) {
        setMessages(prev => [...prev, result.message]);
      } else {
        console.error("Failed to send message:", result.error);
        setMessage(messageContent); // Restore message on error
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessage(messageContent); // Restore message on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = async () => {
    if (!confirm("Are you sure you want to delete this chat? This action cannot be undone. The chat will only be deleted from your side.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteChatForUser(chat.id, currentUserId);
      if (result.success) {
        // Navigate back to chat list or home
        router.push("/chat");
      } else {
        alert("Failed to delete chat. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete chat. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const isLandlord = currentUserId === chat.landlordId;
  const otherUserId = isLandlord ? chat.tenantId : chat.landlordId;
  const otherPartyName = userNames[otherUserId] || (isLandlord ? "Tenant" : "Landlord");

  return (
    <Card className="h-[85vh] flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">
              {chat.rental.name}
            </CardTitle>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">
                {chat.rental.category}
              </Badge>
              <span className="text-xs text-muted-foreground">
                ₱ {chat.rental.price.toLocaleString()} • {chat.rental.address}
              </span>
            </div>
            
            {/* User Profile Section */}
            <div className="border-t pt-3">
              <ChatUserProfile
                userId={otherUserId}
                isLandlord={!isLandlord}
                userName={otherPartyName}
                className="mb-0"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isDeleting}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleDeleteChat}
                  className="text-red-600 focus:text-red-600"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete Chat"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col h-100 p-4">
        <div className="flex-1 overflow-y-auto mb-4 space-y-2">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isCurrentUser={msg.senderId === currentUserId}
                senderName={userNames[msg.senderId] || "User"}
                senderAvatar={`/api/users/${msg.senderId}/avatar`}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {selectedFile && (
          <div className="mb-2 p-2 bg-gray-50 rounded-lg flex items-center gap-2">
            {selectedFile.type.startsWith('image/') ? (
              <ImageIcon className="w-4 h-4" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            <span className="text-sm flex-1 truncate">{selectedFile.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFile(null)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.txt"
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || (!message.trim() && !selectedFile)}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}