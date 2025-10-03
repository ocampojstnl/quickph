"use client";

import CategoryCombobox from "./CategoryCombobox";
import RentalCardsFilter from "./RentalCardsFilter";
import { use, useState, useEffect } from "react";
import { getRentals } from "@/app/rentals/rental.actions";
import { Rental } from "@prisma/client";
import RentCards from "./RentCards";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface FilterHeaderRentalsProps {
    userId: string | null;
}

export default function FilterHeaderRentals({ userId }: FilterHeaderRentalsProps) {
    const [rentals, setRentals] = useState<Rental[]>([])

    useEffect(() => {
        async function fetchRentals() {
            const rentalsData: Rental[] = await getRentals();
            setRentals(rentalsData);
        }
        fetchRentals();
    }, []);

    return (
        <>
            <div className="flex items-center justify-center min-h-[calc(100vh-68px)] overflow-hidden">
                {/* <div className="max-w-7xl w-full mx-auto"> */}
                <div className="w-full mx-auto">
                    <div className="flex w-[100%] ">
                        <div className="map-filter-wrapper w-[70%] max-w-[70%]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15448.588384449815!2d121.03461230000002!3d14.5335774!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c8f3fa2994af%3A0x89c988af4760e40a!2sFort%20Bonifacio%2C%20Taguig%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1759502362238!5m2!1sen!2sph"
                            className="w-[100%] h-[100%]"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                        </div>
                        <div className="flex flex-wrap w-[30%] px-[10px] max-w-[30%] justify-space-between overflow-y-auto max-h-[calc(100vh-68px)]">
                            <RentCards rentals={rentals} userId={userId} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}