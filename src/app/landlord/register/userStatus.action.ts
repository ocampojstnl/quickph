"use server";

import { prisma } from "../../../../lib/prisma"; 
import { getUserId } from "../../../../actions/user.action";

export async function getUserStatus() {
  const currentUserId = await getUserId();
  if (!currentUserId) return null;

  const existing = await prisma.userType.findUnique({
    where: { userId: currentUserId },
  });

  return existing ? existing.status : "TENANT"; // default assumption
}
