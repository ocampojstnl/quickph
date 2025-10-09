import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Hero() {
  return (
    <div className="flex pt-20 pb-5 items-center justify-center">
      <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 pb-12">
        <div>
          <Badge
            variant="secondary"
            className="rounded-full py-1 border-border"
            asChild
          >
            {/* <Link href="#">
              Just released v1.0.0 <ArrowUpRight className="ml-1 size-4" />
            </Link> */}
          </Badge>
          <h1 className="mt-6 text-2xl md:text-5xl lg:text-[2.75rem] xl:text-[2.25rem] font-semibold leading-[1.2]! tracking-tighter">
            QuickRent is the Uber of condo rentals in Metro Manila.
          </h1>
          <p className="mt-6 max-w-[60ch] sm:text-lg">
            Instead of messy Facebook groups with scams and endless scrolling, we create a lightning-fast marketplace where serious landlords meet verified tenants in under 24 hours.
          </p>
          <div className="mt-12 flex items-center gap-4">
            <Button size="lg" className="rounded-full text-base">
              Get Started <ArrowUpRight className="h-5! w-5!" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-base shadow-none"
            >
              <CirclePlay className="h-5! w-5!" /> Watch Demo
            </Button>
          </div>
        </div>
        <div className="w-full aspect-video bg-accent rounded-xl" />
      </div>
    </div>
  );
};

