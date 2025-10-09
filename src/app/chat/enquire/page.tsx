import { redirect } from "next/navigation";
import { createOrGetChat } from "../chat.actions";
import { prisma } from "../../../../lib/prisma";
import { getUserId } from "../../../../actions/user.action";

interface EnquirePageProps {
  searchParams: Promise<{
    rental?: string;
    landlord?: string;
  }>;
}

export default async function EnquirePage({ searchParams }: EnquirePageProps) {
  const { rental: rentalId, landlord: landlordId } = await searchParams;

  if (!rentalId || !landlordId) {
    redirect("/rentals");
  }

  // Get the current user ID from authentication
  const tenantId = await getUserId();
  
  if (!tenantId) {
    redirect("/handler/sign-in");
  }

  // Verify the rental exists
  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
  });

  if (!rental) {
    redirect("/rentals");
  }

  // Create or get existing chat
  const result = await createOrGetChat(rentalId, tenantId, landlordId);

  if (!result.success || !result.chat) {
    redirect("/rentals");
  }

  // Redirect to the chat page
  redirect(`/chat/${result.chat.id}`);
}