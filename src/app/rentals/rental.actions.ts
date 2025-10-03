"use server";
 
import { prisma } from "../../../lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import fs from "fs/promises";
import { getUserId } from "../../../actions/user.action";

export async function getRentals() {
  return await prisma.rental.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getRental(id: string) {
  return await prisma.rental.findUnique({ where: { id } });
}

export async function createRental(data: FormData) {

  const currentUserId = await getUserId();
   const whereClause: any = {
      userId: currentUserId,
   };

  const imagePaths = data.getAll("images") as string[];

  await prisma.rental.create({
    data: {
      name: data.get("name") as string,
      description: data.get("description") as string,
      category: data.get("category") as string,
      address: data.get("address") as string,
      size: Number(data.get("size")),
      bathroom: Number(data.get("bathroom")),
      bedroom: Number(data.get("bedroom")),
      price: Number(data.get("price")),
      userId : currentUserId as string,
      imageUrls: imagePaths, // ✅ store file paths
    },
  });

  revalidatePath("/rentals");
  redirect("/rentals");
}

export async function updateRental(id: string, data: FormData) {
  const files = data.getAll("images") as File[];
  let imagePaths: string[] = [];

  // If new files uploaded, process them
  if (files.length > 0 && files[0].size > 0) {
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = Date.now() + "-" + file.name.replace(/\s/g, "_");
      const filePath = path.join(process.cwd(), "public/uploads", fileName);

      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, buffer);

      imagePaths.push("/uploads/" + fileName);
    }
  } else {
    // No new files → keep old images
    const rental = await prisma.rental.findUnique({ where: { id } });
    imagePaths = rental?.imageUrls ?? [];
  }

  await prisma.rental.update({
    where: { id },
    data: {
      name: data.get("name") as string,
      description: data.get("description") as string,
      category: data.get("category") as string,
      address: data.get("address") as string,
      size: Number(data.get("size")),
      bathroom: Number(data.get("bathroom")),
      bedroom: Number(data.get("bedroom")),
      price: Number(data.get("price")),
      imageUrls: imagePaths,
    },
  });

  revalidatePath("/rentals");
  redirect("/rentals");
}

export async function deleteRental(id: string) {
  await prisma.rental.delete({ where: { id } });
  revalidatePath("/rentals");
}

export async function getLandlordRentals() {
  const currentUserId = await getUserId();
  if (!currentUserId) return [];
  
  return await prisma.rental.findMany({
    where: { userId: currentUserId },
    orderBy: { createdAt: "desc" }
  });
}

export async function deleteLandlordRental(id: string) {
  const currentUserId = await getUserId();
  if (!currentUserId) throw new Error("Unauthorized");
  
  // Verify the rental belongs to the current user
  const rental = await prisma.rental.findUnique({
    where: { id },
    select: { userId: true }
  });
  
  if (!rental || rental.userId !== currentUserId) {
    throw new Error("Unauthorized");
  }
  
  await prisma.rental.delete({ where: { id } });
  revalidatePath("/landlord/listings");
}
