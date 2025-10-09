"use server";

import { prisma } from "../../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function createOrGetChat(rentalId: string, tenantId: string, landlordId: string) {
  try {
    // Check if chat already exists
    let chat = await prisma.chat.findUnique({
      where: {
        rentalId_tenantId: {
          rentalId,
          tenantId,
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
        rental: true,
      },
    });

    // If chat doesn't exist, create it
    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          rentalId,
          tenantId,
          landlordId,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
          rental: true,
        },
      });
    }

    return { success: true, chat };
  } catch (error) {
    console.error("Error creating/getting chat:", error);
    return { success: false, error: "Failed to create or get chat" };
  }
}

export async function sendMessage(
  chatId: string,
  senderId: string,
  content: string,
  fileUrl?: string,
  fileName?: string,
  fileType?: string
) {
  try {
    const message = await prisma.message.create({
      data: {
        chatId,
        senderId,
        content,
        fileUrl,
        fileName,
        fileType,
      },
    });

    // Update chat's updatedAt timestamp
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    revalidatePath("/chat");
    return { success: true, message };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: "Failed to send message" };
  }
}

export async function uploadFile(file: File): Promise<{ success: boolean; fileUrl?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // Create uploads directory if it doesn't exist
    const uploadDir = 'public/uploads/chat';
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/\s/g, '_')}`;
    const filePath = `${uploadDir}/${fileName}`;
    
    // In a real implementation, you'd save the file to the server
    // For now, we'll return a placeholder URL
    const fileUrl = `/uploads/chat/${fileName}`;
    
    return { success: true, fileUrl };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error: "Failed to upload file" };
  }
}

export async function getChatMessages(chatId: string) {
  try {
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });

    return { success: true, messages };
  } catch (error) {
    console.error("Error getting messages:", error);
    return { success: false, error: "Failed to get messages" };
  }
}

export async function getUserChats(userId: string) {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { tenantId: userId },
          { landlordId: userId },
        ],
      },
      include: {
        rental: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // Get the latest message
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Filter out chats that have been deleted by the current user
    const filteredChats = [];
    for (const chat of chats) {
      const deleteMarker = await prisma.message.findFirst({
        where: {
          chatId: chat.id,
          senderId: userId,
          content: "🗑️ CHAT_DELETED_MARKER",
        },
        orderBy: { createdAt: "desc" },
      });

      // If no delete marker found, include the chat
      if (!deleteMarker) {
        filteredChats.push(chat);
      }
    }

    return { success: true, chats: filteredChats };
  } catch (error) {
    console.error("Error getting user chats:", error);
    return { success: false, error: "Failed to get chats" };
  }
}

export async function getChat(chatId: string, userId?: string) {
  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        rental: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chat) {
      return { success: false, error: "Chat not found" };
    }

    // If userId is provided, filter messages based on user's delete marker
    if (userId) {
      // Find the latest delete marker for this user
      const deleteMarker = await prisma.message.findFirst({
        where: {
          chatId: chat.id,
          senderId: userId,
          content: "🗑️ CHAT_DELETED_MARKER",
        },
        orderBy: { createdAt: "desc" },
      });

      // If delete marker exists, only show messages after the delete marker
      if (deleteMarker) {
        chat.messages = chat.messages.filter(
          message => message.createdAt > deleteMarker.createdAt
        );
      }
    }

    return { success: true, chat };
  } catch (error) {
    console.error("Error getting chat:", error);
    return { success: false, error: "Failed to get chat" };
  }
}

export async function markChatAsRead(chatId: string, userId: string) {
  try {
    // Use read marker approach since database fields don't exist yet
    await prisma.message.create({
      data: {
        chatId,
        senderId: userId,
        content: "🔵 CHAT_READ_MARKER",
      },
    });

    revalidatePath("/chat");
    return { success: true };
  } catch (error) {
    console.error("Error marking chat as read:", error);
    return { success: false, error: "Failed to mark chat as read" };
  }
}

export async function getUnreadMessageCount(userId: string) {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { tenantId: userId },
          { landlordId: userId },
        ],
      },
    });

    // Get unread count using read marker approach
    let unreadCount = 0;
    
    for (const chat of chats) {
      // Get the latest delete marker for this user (if any)
      const deleteMarker = await prisma.message.findFirst({
        where: {
          chatId: chat.id,
          senderId: userId,
          content: "🗑️ CHAT_DELETED_MARKER",
        },
        orderBy: { createdAt: "desc" },
      });

      // Check if there are messages from others that haven't been read
      // If user deleted chat, only consider messages after the delete marker
      const messageFilter: any = {
        chatId: chat.id,
        senderId: { not: userId },
        content: { not: "🔵 CHAT_READ_MARKER" },
      };

      // If there's a delete marker, only consider messages after it
      if (deleteMarker) {
        messageFilter.createdAt = { gt: deleteMarker.createdAt };
      }

      const unreadMessages = await prisma.message.findMany({
        where: messageFilter,
        orderBy: { createdAt: "desc" },
      });

      if (unreadMessages.length > 0) {
        // Check if there's a read marker after the latest message from others
        const latestMessage = unreadMessages[0];
        const readMarker = await prisma.message.findFirst({
          where: {
            chatId: chat.id,
            senderId: userId,
            content: "🔵 CHAT_READ_MARKER",
            createdAt: { gt: latestMessage.createdAt },
          },
        });

        if (!readMarker) {
          unreadCount++;
        }
      }
    }

    return { success: true, count: unreadCount };
  } catch (error) {
    console.error("Error getting unread message count:", error);
    return { success: false, error: "Failed to get unread count", count: 0 };
  }
}

export async function getChatWithUnreadStatus(userId: string) {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { tenantId: userId },
          { landlordId: userId },
        ],
      },
      include: {
        rental: true,
        messages: {
          where: {
            content: { not: "🔵 CHAT_READ_MARKER" }, // Exclude read markers
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Filter chats and add unread status
    const filteredChatsWithUnreadStatus = [];
    
    for (const chat of chats) {
      // Get the latest delete marker for this user (if any)
      const deleteMarker = await prisma.message.findFirst({
        where: {
          chatId: chat.id,
          senderId: userId,
          content: "🗑️ CHAT_DELETED_MARKER",
        },
        orderBy: { createdAt: "desc" },
      });

      // Get messages after delete marker (if any)
      const messageFilter: any = {
        chatId: chat.id,
        content: { not: "🔵 CHAT_READ_MARKER" },
      };

      if (deleteMarker) {
        messageFilter.createdAt = { gt: deleteMarker.createdAt };
      }

      const messagesAfterDelete = await prisma.message.findMany({
        where: messageFilter,
        orderBy: { createdAt: "desc" },
        take: 1,
      });

      // Only include chat if there are messages after delete marker (or no delete marker)
      if (messagesAfterDelete.length === 0 && deleteMarker) {
        continue; // Skip this chat - it was deleted and has no new messages
      }

      const lastMessage = messagesAfterDelete[0] || chat.messages[0];
      let hasUnread = false;

      if (lastMessage && lastMessage.senderId !== userId) {
        // Check if there's a read marker after this message
        const readMarker = await prisma.message.findFirst({
          where: {
            chatId: chat.id,
            senderId: userId,
            content: "🔵 CHAT_READ_MARKER",
            createdAt: { gt: lastMessage.createdAt },
          },
        });

        hasUnread = !readMarker;
      }

      // Update the chat's messages to show only the latest message after delete
      const chatWithFilteredMessages = {
        ...chat,
        messages: messagesAfterDelete.length > 0 ? messagesAfterDelete : chat.messages,
        hasUnread,
      };

      filteredChatsWithUnreadStatus.push(chatWithFilteredMessages);
    }

    return { success: true, chats: filteredChatsWithUnreadStatus };
  } catch (error) {
    console.error("Error getting chats with unread status:", error);
    return { success: false, error: "Failed to get chats" };
  }
}

export async function deleteChatForUser(chatId: string, userId: string) {
  try {
    // Use a special marker message to indicate user deleted the chat
    await prisma.message.create({
      data: {
        chatId,
        senderId: userId,
        content: "🗑️ CHAT_DELETED_MARKER",
      },
    });

    revalidatePath("/chat");
    return { success: true };
  } catch (error) {
    console.error("Error deleting chat for user:", error);
    return { success: false, error: "Failed to delete chat" };
  }
}

export async function markChatAsReadSimple(chatId: string, userId: string) {
  try {
    // Simple approach: send a "read" message to mark the chat as seen
    // This is a workaround until the migration completes
    await prisma.message.create({
      data: {
        chatId,
        senderId: userId,
        content: "📖 Message read", // Special marker message
      },
    });

    revalidatePath("/chat");
    return { success: true };
  } catch (error) {
    console.error("Error marking chat as read:", error);
    return { success: false, error: "Failed to mark chat as read" };
  }
}