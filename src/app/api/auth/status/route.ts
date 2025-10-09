import { NextRequest, NextResponse } from "next/server";
import { getUserStatus } from "@/app/landlord/register/userStatus.action";

export async function GET(request: NextRequest) {
  try {
    const status = await getUserStatus();
    
    return NextResponse.json({
      status: status || "TENANT",
    });
  } catch (error) {
    console.error("Error getting user status:", error);
    return NextResponse.json({ status: "TENANT" });
  }
}