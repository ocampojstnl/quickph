"use client";

import { useState } from "react";
import {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
} from "@/components/ui/shadcn-io/combobox";

// Extract categories from navigation.tsx components array
const categories = [
  { value: "studio-unit", label: "Studio Unit" },
  { value: "1-bedroom-unit", label: "1-Bedroom Unit" },
  { value: "2-bedroom-unit", label: "2-Bedroom Unit" },
  { value: "3-bedroom-unit", label: "3-Bedroom Unit" },
  { value: "loft-unit", label: "Loft Unit" },
  { value: "penthouse", label: "Penthouse" },
];

interface CategoryComboboxProps {
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  required?: boolean;
  className?: string;
}

export default function CategoryCombobox({
  value,
  onValueChange,
  name = "category",
  required = false,
  className = "",
}: CategoryComboboxProps) {
  const [selectedValue, setSelectedValue] = useState(value || "");

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div className={className}>
      <Combobox
        data={categories}
        type="category"
        value={selectedValue}
        onValueChange={handleValueChange}
      >
        <ComboboxTrigger className="w-full justify-between px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
        <ComboboxContent>
          <ComboboxInput />
          <ComboboxList>
            <ComboboxEmpty>No category found.</ComboboxEmpty>
            <ComboboxGroup>
              {categories.map((category) => (
                <ComboboxItem key={category.value} value={category.value}>
                  {category.label}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      
      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        value={selectedValue}
        required={required}
      />
    </div>
  );
}