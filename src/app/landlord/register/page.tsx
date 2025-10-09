"use client";

import { useTransition } from "react";
import { registerLandlord } from "./registerLandlord.action";

export default function RegisterLandlordForm() {
  const [isPending, startTransition] = useTransition();

  const handleRegister = () => {
    startTransition(async () => {
      try {
        await registerLandlord();
        alert("You are now registered as a landlord!");
      } catch (error) {
        console.error(error);
        alert("Failed to register as landlord.");
      }
    });
  };

  return (
    <form action={handleRegister} className="p-4 border rounded-lg">
      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {isPending ? "Registering..." : "Register as Landlord"}
      </button>
    </form>
  );
}
