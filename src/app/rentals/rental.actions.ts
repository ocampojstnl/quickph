"use server";

import { prisma } from "../../../lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";
import fs from "fs/promises";
import { getUserId } from "../../../actions/user.action";
import { S3Client, PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

async function uploadToS3(file: File, userId: string) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const timestamp = Date.now();
  const fileName = `${userId}-${timestamp}-${file.name.replace(/\s/g, '_')}`;
  const key = `rentals/${fileName}`;

  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: file.type,
    ACL: "public-read" as ObjectCannedACL,
  };

  const command = new PutObjectCommand(uploadParams);
  await s3Client.send(command);

  return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
}

export async function createRental(data: FormData) {
  const currentUserId = await getUserId();

  const files = data.getAll("images") as File[];
  const imageUrls: string[] = [];

  for (const file of files) {
    if (file instanceof File && file.size > 0) {
      const imageUrl = await uploadToS3(file, currentUserId as string);
      imageUrls.push(imageUrl);
    }
  }

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
      userId: currentUserId as string,
      imageUrls: imageUrls,
    },
  });

  revalidatePath("/rentals");
  redirect("/rentals");
}

export async function updateRental(id: string, data: FormData) {
  const currentUserId = await getUserId();
  const files = data.getAll("images") as File[];
  let imageUrls: string[] = [];

  // If new files uploaded, process them
  if (files.length > 0 && files[0].size > 0) {
    imageUrls = [];
    for (const file of files) {
      if (file instanceof File && file.size > 0) {
        const imageUrl = await uploadToS3(file, currentUserId as string);
        imageUrls.push(imageUrl);
      }
    }
  } else {
    // No new files → keep old images
    const rental = await prisma.rental.findUnique({ where: { id } });
    imageUrls = rental?.imageUrls ?? [];
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
      imageUrls: imageUrls,
    },
  });

  revalidatePath("/rentals");
  redirect("/rentals");
}

export async function deleteRental(id: string) {
  await prisma.rental.delete({ where: { id } });
  revalidatePath("/rentals");
}

export async function getRentals() {
  return await prisma.rental.findMany({ orderBy: { createdAt: "desc" } });
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
