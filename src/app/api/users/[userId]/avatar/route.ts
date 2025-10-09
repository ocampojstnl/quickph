import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    // Get current user to check if they can access this data
    const currentUser = await stackServerApp.getUser();
    
    if (!currentUser) {
      // Return a default avatar for unauthenticated requests
      return NextResponse.redirect(`https://api.dicebear.com/7.x/initials/svg?seed=User`);
    }

    // For now, return a generated avatar based on user ID
    // In a real implementation, you'd get the actual profile image from Stack Auth
    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${userId}`;
    
    return NextResponse.redirect(avatarUrl);
  } catch (error) {
    console.error("Error fetching user avatar:", error);
    // Return default avatar on error
    return NextResponse.redirect(`https://api.dicebear.com/7.x/initials/svg?seed=User`);
  }
}