import Navigation from "../components/navigation";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Features from "@/components/Features";
import RentCards from "@/components/RentCards";
import { getRentals } from "@/app/rentals/rental.actions";
import { Rental } from "@prisma/client";
import { stackServerApp } from "@/stack/server";
import FilterHeaderRentals from "@/components/FilterHeaderRentals";

async function getUser() {
    const user = await stackServerApp.getUser();
    return user ? user.id : null;
}

export default async function Home() {
    const userId = await getUser();
    const rentals: Rental[] = await getRentals();

  return (
    <>
      <Navigation />
      <Hero />
      <FilterHeaderRentals userId={userId} />
      <Features />
      <Footer />
    </>
  );
}
