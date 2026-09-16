'use client';

import { useEffect, useState } from 'react';
import LocationFilter from '@/components/LocationFilter';
import AdCard from '@/components/AdCard';
import { useGetAdsQuery } from '@/store/adApi';
import CategoryFilter from '@/components/CategoryFilter';
import Header from '@/components/Header';
import { useSearchParams } from 'next/navigation';


export default function Home() {

  const [cityId, setCityId] = useState('');
  const [areaId, setAreaId] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');

  
  const searchParams = useSearchParams();

  const search = searchParams?.get('search') || '';

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useGetAdsQuery({
    search,
    cityId: cityId || undefined,
    areaId: areaId || undefined,
    categoryId: categoryId || undefined,
    page,
    limit: 20,
    sort,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
  });

  const ads = data?.data ?? [];

  const handleLocationChange = (
    selectedCityId: string,
    selectedAreaId: string
  ) => {
    setCityId(selectedCityId);
    setAreaId(selectedAreaId);
    setPage(1);
  };

  const handleCategoryChange = (selectedCategoryId: string) => {
    setCategoryId(selectedCategoryId);
    setPage(1);
  };


  // const [ads, setAds] = useState<Ad[]>([]);
  // useEffect(() => {
  //   loadAds();
  // }, []);

  // const loadAds = async (
  //   cityId?: string,
  //   areaId?: string
  // ) => {
  //   const data = await getAds({
  //     cityId,
  //     areaId,
  //   });

  //   setAds(data.data);
  // };

  // const handleLocationChange = async (
  //   cityId: string,
  //   areaId: string
  // ) => {

  //    loadAds(
  //     cityId || undefined,
  //     areaId || undefined
  //   );

  // const data = await getAds({
  //   cityId: cityId || undefined,
  //   areaId: areaId || undefined,
  // });

  // setAds(data.data);

  // console.log('Filtered Ads:', data);
  // };


  return (
    <main style={{background: '#fafffc'}}>

      {/* <Header /> */}
      <div className='max-w-7xl mx-auto px-4 py-6'>
        <div className='flex gap-6'>
          <div className='hidden lg:block border border-gray-200 p-5 rounded-2xl bg-white'>

            <LocationFilter onLocationChange={handleLocationChange} /><br />

            <h2>Filter by price</h2>
            <div className="flex gap-2">
              <input className='w-32 p-2 bg-white border border-gray-300
             rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none'
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(1);
                }}
              />

              <input className='w-32 p-2 bg-white border border-gray-300
             rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none'
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
              />
            </div> <br />
            <CategoryFilter
              onCategoryChange={handleCategoryChange}
            />
          </div>
          <div className='block w-full'>
          <div className='flex justify-between items-end'>
             <div>
             <h2>Sort by</h2>
            <select className='block w-full px-4 py-2 bg-white border border-gray-300
             rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none'
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                setPage(1);
              }}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
           </div>

            <p>Ads found: {ads.length}</p>
          </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {ads.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>

            {data?.meta && data.meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  disabled={page === 1 || isFetching}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="border px-4 py-2 rounded disabled:opacity-50"
                >
                  Previous
                </button>

                <span>
                  Page {page} of {data.meta.totalPages}
                </span>

                <button
                  disabled={page === data.meta.totalPages || isFetching}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="border px-4 py-2 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>

      </div>
      <div>

      </div>



      {/* 
      {isLoading && <p>Loading ads...</p>}
      {isError && <p>Failed to load ads.</p>}

      {isFetching && !isLoading && (
        <p className="mt-4">Loading ads...</p>
      )} */}

    </main>
  );
}