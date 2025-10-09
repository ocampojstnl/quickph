import { createRental } from "@/app/rentals/rental.actions";
import { getUserStatus } from "@/app/landlord/register/userStatus.action";
import CategoryCombobox from "./CategoryCombobox";

export default function CreateRentalForm() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Create New Rental
          </h1>
          <p className="text-lg text-gray-600">
            List your property and start earning rental income
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-2 sm:p-2 lg:p-4">
          <form action={createRental} className="space-y-8">
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
                    placeholder="2500"
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Property Images
              </h2>
              
              <div className="space-y-2">
                <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                  Upload Images *
                </label>
                <div className="relative">
                  <input
                    id="images"
                    name="images"
                    type="file"
                    multiple
                    accept="image/*"
                    required
                    className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Upload multiple high-quality images of your property. Supported formats: JPG, PNG, WebP
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
                Create Rental Listing
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By creating a listing, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}
