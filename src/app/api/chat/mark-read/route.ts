import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "../../../../../actions/user.action";
import { prisma } from "../../../../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId } = await request.json();

    if (!chatId) {
      return NextResponse.json({ error: "Chat ID required" }, { status: 400 });
    }

    // Simple approach: add a "read marker" message to indicate the chat was read
    await prisma.message.create({
      data: {
        chatId,
        senderId: userId,
        content: "🔵 CHAT_READ_MARKER", // Special marker that won't be displayed
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking chat as read:", error);
    return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 });
  }
}