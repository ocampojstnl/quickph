"use server";

import { prisma } from "../../../../lib/prisma"; 
import { getUserId } from "../../../../actions/user.action";

export async function registerLandlord() {
  const currentUserId = await getUserId();
  if (!currentUserId) {
    throw new Error("User not authenticated");
  }

  // Update user type to LANDLORD
  const updated = await prisma.userType.upsert({
    where: { userId: currentUserId },
    update: { status: "LANDLORD" },
    create: {
      userId: currentUserId,
      status: "LANDLORD",
    },
  });

  return updated;
}
