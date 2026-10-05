'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetAdByIdQuery } from '@/store/adApi';
import { skipToken } from '@reduxjs/toolkit/query';

export default function AdDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const id = params?.id;

  const {
    data: ad,
    isLoading,
    isError,
  } = useGetAdByIdQuery(id ?? skipToken, {
    skip: !id,
  });

  if (isLoading) {
    return (
      <main className="p-6">
        <p>Loading ad...</p>
      </main>
    );
  }

  if (isError || !ad) {
    return (
      <main className="p-6">
        <p className="text-red-500">
          Failed to load ad.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className='flex justify-between'>
        <button
        type="button"
        onClick={() => router.back()}
        className="cursor-pointer mb-5 inline-flex items-center gap-2 rounded-lg border text-white border-gray-200 bg-blue-500 
        px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-blue-600 hover:shadow"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>

        Back
      </button> 
      <h3>Views: {ad.views}</h3>
      </div>
      {ad.images?.length > 0 && (
        <img
          src={`http://localhost:3000${ad.images[0].imageUrl}`}
          alt={ad.title}
          className="w-full max-w-3xl h-[400px] object-cover rounded-lg"
        />
      )}

      <h1 className="text-3xl font-bold">
        {ad.title}
      </h1>

      <p className="text-2xl font-bold mt-4">
        ₹{ad.price}
      </p>

      <p className="text-gray-500 mt-2">
        {ad.city?.name}
        {ad.area?.name && `, ${ad.area.name}`}
      </p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">
          Description
        </h2>

        <p className="mt-2">
          {ad.description}
        </p>
      </div>
    </main>
  );
}