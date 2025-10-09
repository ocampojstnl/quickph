import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getLandlordRentals, deleteLandlordRental } from "@/app/rentals/rental.actions";
import { getUserStatus } from "@/app/landlord/register/userStatus.action";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, Eye, Plus } from "lucide-react";
import Navigation from "@/components/navigation"

export default async function Page() {
  // Check user authentication and landlord status
  const userStatus = await getUserStatus();
  
  // If user is not logged in or not a landlord, redirect to 404
  if (!userStatus || userStatus !== "LANDLORD") {
    notFound();
  }

  // Get landlord's rentals
  const rentals = await getLandlordRentals();
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
      <Navigation/>
      <SidebarProvider className="pt-68px">
      <AppSidebar/>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/landlord">
                    Landlord Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>My Listings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">My Property Listings</h1>
            <Link href="/landlord/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Property
              </Button>
            </Link>
          </div>
          
          {rentals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <h3 className="text-lg font-semibold mb-2">No properties listed yet</h3>
                <p className="text-muted-foreground mb-4">Start by creating your first property listing</p>
                <Link href="/landlord/create">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Listing
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {rentals.map((rental) => (
                <Card key={rental.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{rental.name}</CardTitle>
                      <Badge variant="secondary">{rental.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium">{rental.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-medium">${rental.price.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Size</p>
                        <p className="font-medium">{rental.size} sqft</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Bedrooms/Bathrooms</p>
                        <p className="font-medium">{rental.bedroom}BR / {rental.bathroom}BA</p>
                      </div>
                    </div>
                    
                    {rental.description && (
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="text-sm">{rental.description.substring(0, 150)}...</p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Link target="_blank" href={`/rental/${rental.id}/${createSlug(rental.name)}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/landlord/${rental.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      <form action={async () => {
                        "use server";
                        await deleteLandlordRental(rental.id);
                      }}>
                        <Button variant="destructive" size="sm" type="submit">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </SidebarInset>
      </SidebarProvider>
    </>
  )
}
