"use client";

import { Rental } from "@prisma/client";
import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Bed, Bath, RulerDimensionLine, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RentCardsProps {
    rentals: Rental[];
    userId: string | null;
}

export default function RentCards({ rentals, userId }: RentCardsProps) {

    const createSlug = (name: string) => {
        return name
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
          .trim();
    };

    return (
        <>
            {rentals && rentals.map((r: Rental) => {
                const slug = createSlug(r.name);
                const rentalUrl = `/rental/${r.id}/${slug}`;
                return (
                    // <Card key={r.id} className="w-full gap-0 md:w-[23.75%] p-4 mx-2 mb-5 hover:shadow-lg transition-shadow duration-300">
                    <Card key={r.id} className="w-full max-h-[406px] gap-0 md:w-[48%] p-4 mx-auto mb-5 hover:shadow-lg transition-shadow duration-300">
                    <Link href={rentalUrl} className="block">
                        <CardHeader className="pb-1 px-0">
                        {r.imageUrls && r.imageUrls.length > 0 ? (
                            <div className="img-container relative">
                            <img
                                src={r.imageUrls[0]}
                                alt={`${r.name} image`}
                                className="w-full h-40 object-cover rounded-xl"
                            />
                            <div className="max-w-{100%} absolute text-center bottom-5 left-0 right-0">
                                <div className="price mx-auto py-1 text-black px-5 rounded-xl text-md bg-white/30 backdrop-blur-xl overflow-hidden inline-flex flex-col">
                                <div className="title-price font-bold">Price</div>
                                <span className="text text-black">
                                    ₱ {r.price}
                                </span>
                                </div>
                            </div>
                            </div>
                        ) : (
                            <div className="w-full h-48 bg-muted rounded flex items-center justify-center text-sm text-muted-foreground">
                            No image
                            </div>
                        )}
                        <CardTitle className="text-lg text-left hover:text-blue-600 transition-colors">{r.name}</CardTitle>
                        <CardDescription className="capitalize flex-col flex text-sm text-muted-foreground" />
                        </CardHeader>

                        <span className="category w-[100%] text-sm text-left mb-4 inline-flex items-start">
                        <MapPin className="mt-1 w-4 h-4 mr-2" strokeWidth={1.25} /> {r.address}
                        </span>

                        <CardContent className="px-0 mt-auto">
                        <div className="flex justify-start mb-4 flex flex-wrap gap-2">
                            <span className="inline-flex items-center justify-start text-base font-bold w-[33%]">
                            <div className="p-2 rounded-full bg-cyan-500 mr-2">
                                <Bed color="#ffffff" className="w-3 h-3" />
                            </div>
                            {r.bedroom}
                            </span>
                            <span className="inline-flex items-center justify-start text-base font-bold w-[33%]">
                            <div className="p-2 rounded-full bg-cyan-500 mr-2">
                                <Bath color="#ffffff" className="w-3 h-3" />
                            </div>
                            {r.bathroom}
                            </span>
                            <span className="inline-flex items-center justify-start text-base font-bold w-[100%]">
                                <div className="p-2 flex items-center rounded-full bg-cyan-500 mr-2">
                                    <RulerDimensionLine color="#ffffff" className="w-3 h-3" />
                                </div>
                                <div className="flex">{r.size} <span className="ml-1">sqm</span></div>
                            </span>
                        </div>
                        </CardContent>
                    </Link>

                    <div className="flex gap-2 mt-auto">
                        <Button className="flex-1" size="sm" asChild>
                        <Link href={rentalUrl}>
                            View Details
                        </Link>
                        </Button>
                        {userId && userId !== r.userId && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            asChild
                        >
                            <Link href={`/chat/enquire?rental=${r.id}&landlord=${r.userId}`}>
                            <MessageCircle className="w-4 h-4" />
                            Enquire
                        </Link>
                        </Button>
                        )}
                    </div>
                    </Card>
                );
                })}
        </>
    )
}
