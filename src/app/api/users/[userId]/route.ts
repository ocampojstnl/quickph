import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    // Get the current authenticated user first
    const currentUser = await stackServerApp.getUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    
    // If requesting own user data, return it
    if (currentUser.id === userId) {
      return NextResponse.json({
        id: currentUser.id,
        displayName: currentUser.displayName,
        primaryEmail: currentUser.primaryEmail,
        profileImageUrl: currentUser.profileImageUrl,
      });
    }
    
    // For chat functionality, we need to allow users to see basic info of chat participants
    // Try to get the user from Stack Auth's user list
    try {
      const users = await stackServerApp.listUsers();
      const targetUser = users.find(user => user.id === userId);
      
      if (targetUser) {
        return NextResponse.json({
          id: targetUser.id,
          displayName: targetUser.displayName || targetUser.primaryEmail?.split('@')[0] || "User",
          primaryEmail: targetUser.primaryEmail,
          profileImageUrl: targetUser.profileImageUrl,
        });
      }
    } catch (error) {
      console.error("Error fetching user from Stack Auth:", error);
    }
    
    // Fallback if user not found
    return NextResponse.json({
      id: userId,
      displayName: "User",
      primaryEmail: "",
      profileImageUrl: null,
    });
    
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}