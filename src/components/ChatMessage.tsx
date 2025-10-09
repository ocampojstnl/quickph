import { Message } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download, FileText, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import ImageModal from "./ImageModal";

interface ChatMessageProps {
  message: Message & {
    fileUrl?: string | null;
    fileName?: string | null;
    fileType?: string | null;
  };
  isCurrentUser: boolean;
  senderName?: string;
  senderAvatar?: string;
}

export default function ChatMessage({
  message,
  isCurrentUser,
  senderName = "User",
  senderAvatar
}: ChatMessageProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  // Hide marker messages (read markers and delete markers)
  if (message.content === "🔵 CHAT_READ_MARKER" || message.content === "🗑️ CHAT_DELETED_MARKER") {
    return null;
  }

  const getFileIcon = (fileType: string | null) => {
    if (!fileType) return <FileText className="w-4 h-4" />;
    
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const isImage = message.fileType?.startsWith('image/');

  return (
    <div
      className={cn(
        "flex w-full mb-4 gap-2",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      {!isCurrentUser && (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback className="text-xs">
            {senderName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex flex-col max-w-[70%]">
        {!isCurrentUser && (
          <span className="text-xs text-gray-500 mb-1 ml-2">{senderName}</span>
        )}
        
        <div
          className={cn(
            "rounded-lg px-4 py-2",
            isCurrentUser
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-900"
          )}
        >
          {message.content && (
            <p className="text-sm mb-2">{message.content}</p>
          )}
          
          {message.fileUrl && (
            <div className="mt-2">
              {isImage ? (
                <div className="relative group">
                  <img
                    src={message.fileUrl}
                    alt="Uploaded image"
                    className="max-w-full h-auto rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setIsImageModalOpen(true)}
                    style={{ maxHeight: '200px', objectFit: 'cover' }}
                  />
                  
                  <ImageModal
                    isOpen={isImageModalOpen}
                    onClose={() => setIsImageModalOpen(false)}
                    imageUrl={message.fileUrl}
                    fileName={message.fileName || undefined}
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    "flex items-center gap-2 p-2 rounded border cursor-pointer hover:opacity-80",
                    isCurrentUser ? "border-blue-300 bg-blue-400" : "border-gray-300 bg-white"
                  )}
                  onClick={() => window.open(message.fileUrl!, '_blank')}
                >
                  {getFileIcon(message.fileType || null)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{message.fileName}</p>
                    <p className="text-xs opacity-75">{message.fileType}</p>
                  </div>
                  <Download className="w-3 h-3" />
                </div>
              )}
            </div>
          )}
          
          <p
            className={cn(
              "text-xs mt-1",
              isCurrentUser ? "text-blue-100" : "text-gray-500"
            )}
          >
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
      
      {isCurrentUser && (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback className="text-xs">
            {senderName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}