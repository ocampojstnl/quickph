import { NextResponse } from "next/server";
import { getUserId } from "../../../../../actions/user.action";
import { prisma } from "../../../../../lib/prisma";

export async function GET() {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json({ count: 0 });
    }

    // Get unread message count directly
    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { tenantId: userId },
          { landlordId: userId },
        ],
      },
      include: {
        messages: {
          where: {
            AND: [
              { senderId: { not: userId } }, // Messages not sent by current user
              { content: { not: "🔵 CHAT_READ_MARKER" } }, // Exclude read markers
            ],
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    let unreadCount = 0;

    for (const chat of chats) {
      if (chat.messages.length === 0) continue;

      const lastMessage = chat.messages[0];
      
      // Check if there's a read marker after this message
      const readMarker = await prisma.message.findFirst({
        where: {
          chatId: chat.id,
          senderId: userId,
          content: "🔵 CHAT_READ_MARKER",
          createdAt: { gt: lastMessage.createdAt },
        },
      });

      // If no read marker found after the last message, it's unread
      if (!readMarker) {
        unreadCount++;
      }
    }

    return NextResponse.json({ count: unreadCount });
  } catch (error) {
    console.error("Error getting unread count:", error);
    return NextResponse.json({ count: 0 });
  }
}