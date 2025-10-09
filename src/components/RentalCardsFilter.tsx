import { getRentals, deleteRental } from "@/app/rentals/rental.actions";
import { Rental } from "@prisma/client";
import FilterHeaderRentals from "./FilterHeaderRentals";
import { stackServerApp } from "@/stack/server";

interface RentalsCardsFilterProps {
  limit?: number; // optional prop
  category?: string;
}

async function getUser() {
    const user = await stackServerApp.getUser();
    return user ? user.id : null;
}

export default async function RentalsCardsFilter({ limit, category }: RentalsCardsFilterProps) {
  const userId = await getUser();
  return (
    <>
        <FilterHeaderRentals userId={userId} />
    </>
  );
}
