import { getRentals, updateRental } from "../../../rentals/rental.actions";
import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
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
import { getUserStatus } from "@/app/landlord/register/userStatus.action";
import { notFound } from "next/navigation";
import CategoryCombobox from "@/components/CategoryCombobox";
import Navigation from "@/components/navigation";

export default async function EditRentalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Check user authentication and landlord status
  const userStatus = await getUserStatus();
  
  // If user is not logged in or not a landlord, redirect to 404
  if (!userStatus || userStatus !== "LANDLORD") {
    notFound();
  }

  const { id } = await params;
  const rentals = await getRentals();
  const rental = rentals && rentals.length > 0 ? rentals[0] : null;

  if (!rental) return <div>Not found</div>;

  // ✅ Server Action
  async function updateAction(formData: FormData) { 
    "use server";

    const rentalId = formData.get("id") as string; // grab ID from form
    await updateRental(rentalId, formData);

    redirect("/landlord/listings");
  }

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
    <SidebarProvider>
      <AppSidebar />
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
                  <BreadcrumbLink href="/landlord/listings">
                    My Listings
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit Property</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Edit Property
                </h1>
                <p className="text-lg text-gray-600">
                  Update your property details and information
                </p>
              </div>

              {/* Form Container */}
              <div className="bg-white rounded-2xl shadow-xl p-2 sm:p-2 lg:p-4">
                <form action={updateAction} className="space-y-8">
                  {/* Hidden rental ID field */}
                  {rental && <input type="hidden" name="id" value={rental.id} />}

                  {/* Basic Information Section */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Basic Information
                    </h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Property Name *
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          defaultValue={rental ? rental.name : ""}
                          placeholder="e.g., Modern Downtown Apartment"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                          Property Type *
                        </label>
                        <CategoryCombobox
                          name="category"
                          required
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        defaultValue={rental ? rental.description || "" : ""}
                        placeholder="Describe your property, amenities, and what makes it special..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address *
                      </label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        defaultValue={rental ? rental.address : ""}
                        placeholder="Full address including city and postal code"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Property Details Section */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Property Details
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                          Size (sq ft) *
                        </label>
                        <input
                          id="size"
                          name="size"
                          type="number"
                          defaultValue={rental ? rental.size : 0}
                          placeholder="1200"
                          required
                          min="1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="bedroom" className="block text-sm font-medium text-gray-700">
                          Bedrooms *
                        </label>
                        <input
                          id="bedroom"
                          name="bedroom"
                          type="number"
                          defaultValue={rental ? rental.bedroom : 0}
                          placeholder="2"
                          required
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="bathroom" className="block text-sm font-medium text-gray-700">
                          Bathrooms *
                        </label>
                        <input
                          id="bathroom"
                          name="bathroom"
                          type="number"
                          defaultValue={rental ? rental.bathroom : 0}
                          placeholder="2"
                          required
                          min="0"
                          step="0.5"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                          Monthly Rent (₱) *
                        </label>
                        <input
                          id="price"
                          name="price"
                          type="number"
                          defaultValue={rental ? rental.price : 0}
                          placeholder="2500"
                          required
                          min="1"
                          step="0.01"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Current Images Section */}
                  {rental && rental.imageUrls && rental.imageUrls.length > 0 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        Current Images
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {rental.imageUrls.map((url: string, i: number) => (
                          <div key={i} className="relative">
                            <img
                              src={url}
                              alt={`Property image ${i + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images Section */}
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Update Images
                    </h2>
                    
                    <div className="space-y-2">
                      <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                        Upload New Images (Optional)
                      </label>
                      <div className="relative">
                        <input
                          id="images"
                          name="images"
                          type="file"
                          multiple
                          accept="image/*"
                          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Upload new images to replace current ones. Leave empty to keep existing images. Supported formats: JPG, PNG, WebP
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      Update Property Listing
                    </button>
                  </div>
                </form>
              </div>

              {/* Footer Note */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  Changes will be reflected immediately after updating.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </>
    
  );
}
