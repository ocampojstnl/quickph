import { getRentals } from "@/app/rentals/rental.actions";
import { notFound } from "next/navigation";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

interface Props {
  params: Promise<any>;
}

export default async function RentalPage({ params }: Props) {
  const { id, slug } = await params;
  const rentals = await getRentals();
  const rental = rentals?.find((rental) => rental.id === id);

  if (!rental) {
    return notFound();
  }

  return (
    <>
      <Navigation />
      <div className="md:flex md:flex-row">
        <div className="md:w-1/2">
          <Image
            src={rental.imageUrls[0]}
            width={600}
            height={400}
            alt={rental.name}
            className="rounded-md"
          />
        </div>
        <div className="md:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>{rental.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-row gap-4">
                <Badge>{rental.category}</Badge>
                <Badge>{rental.address}</Badge>
              </div>
              <p>{rental.description}</p>
              <Features />
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
