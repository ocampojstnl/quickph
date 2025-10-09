import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await params;

    if (!chatId) {
      return NextResponse.json({ success: false, error: 'Chat ID is required' }, { status: 400 });
    }

    const messages = await prisma.message.findMany({
      where: { 
        chatId,
        // Exclude marker messages from the response
        content: {
          notIn: ["🔵 CHAT_READ_MARKER", "🗑️ CHAT_DELETED_MARKER"]
        }
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch messages" }, { status: 500 });
  }
}