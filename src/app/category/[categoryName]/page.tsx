"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Rental } from "@prisma/client";
import RentCards from '@/components/RentCards';
import { getRentals } from '@/app/rentals/rental.actions';
import Navigation from '@/components/navigation';
import Footer from '@/components/Footer';

const CategoryPage = () => {
  const params = useParams();
  const categoryName = params.categoryName as string;
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [filteredRentals, setFilteredRentals] = useState<Rental[]>([]);

  useEffect(() => {
    const fetchRentals = async () => {
      const allRentals = await getRentals();
      console.log("All Rentals Length:", allRentals.length);
      setRentals(allRentals);
    };

    fetchRentals();
  }, []);

  useEffect(() => {
    if (rentals) {
      const filtered = rentals.filter(rental => {
        console.log("Rental:", rental);
        console.log("Category Name:", categoryName);
        const match = rental.category ? rental.category.toLowerCase() === categoryName.toLowerCase() : false;
        console.log("Match:", match);
        return match;
      });
      setFilteredRentals(filtered);
    }
  }, [rentals, categoryName]);

  return (
    <div>
      <Navigation/>
      <div className="bg-blue-100 py-4 text-center">
        <h1 className="text-2xl font-bold">Category: {categoryName.replace(/-/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase())}</h1>
      </div>
      <div className="container mx-auto py-8">
        {filteredRentals.length > 0 ? (
          <RentCards rentals={filteredRentals} userId={null} />
        ) : (
          <p>No rentals found in this category.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;