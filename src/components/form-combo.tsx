'use client';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from '@/components/ui/shadcn-io/combobox';
const category = [
  {
    value: 'next.js',
    label: 'Next.js',
  },
  {
    value: 'sveltekit',
    label: 'SvelteKit',
  },
  {
    value: 'nuxt.js',
    label: 'Nuxt.js',
  },
  {
    value: 'remix',
    label: 'Remix',
  },
  {
    value: 'astro',
    label: 'Astro',
  },
  {
    value: 'vite',
    label: 'Vite',
  },
];
const FormComboBox = () => (
  <Combobox
    data={category}
    onOpenChange={(open) => console.log('Combobox is open?', open)}
    onValueChange={(newValue) => console.log('Combobox value:', newValue)}
    type="framework"
  >
    <ComboboxTrigger />
    <ComboboxContent>
      <ComboboxInput />
      <ComboboxEmpty />
      <ComboboxList>
        <ComboboxGroup>
          {category.map((category) => (
            <ComboboxItem key={category.value} value={category.value}>
              {category.label}
            </ComboboxItem>
          ))}
        </ComboboxGroup>
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
);
export default FormComboBox;