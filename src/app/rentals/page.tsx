import { getRentals, deleteRental } from "./rental.actions";
import { Rental } from "@prisma/client";
import Navigation from "@/components/navigation";
import RentalsCardsFilter from "../../components/RentalCardsFilter";
import Footer from "@/components/Footer";

export default async function RentalsPage() {
  const rentals: Rental[] = await getRentals();
  return (
    <>
      <Navigation />
      <RentalsCardsFilter />
      {/* <Footer/> */}
    </>
  );
}
