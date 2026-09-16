'use client';

import { useState } from 'react';
import { useGetCategoriesQuery } from '@/store/categoryApi';

interface CategoryFilterProps {
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryFilter({
  onCategoryChange,
}: CategoryFilterProps) {
  const [categoryId, setCategoryId] = useState('');

  const { data: categories = [] } = useGetCategoriesQuery();

  const handleChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCategoryId = event.target.value;

    setCategoryId(selectedCategoryId);
    onCategoryChange(selectedCategoryId);
  };

  return (
    <select className=' p-2 bg-white border border-gray-300
             rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none' value={categoryId} onChange={handleChange}>
      <option value="">All Categories</option>

      {categories.map((parent) => (
        <optgroup key={parent.id} label={parent.name}>
          {parent.subCategories.map((subCategory) =>
            subCategory.leafCategories.map((leaf) => (
              <option key={leaf.id} value={leaf.id}>
                {subCategory.name} → {leaf.name}
              </option>
            ))
          )}
        </optgroup>
      ))}
    </select>
  );
}