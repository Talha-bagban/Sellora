'use client';

import { useState } from 'react';
import { City, Area } from '@/types/location';
import {
    useGetCitiesQuery,
    useGetAreasByCityQuery,
} from '@/store/locationApi';

interface LocationFilterProps {
    onLocationChange: (cityId: string, areaId: string) => void;
}

export default function LocationFilter({ onLocationChange }: LocationFilterProps) {
    // const [cities, setCities] = useState<City[]>([]);
    // const [areas, setAreas] = useState<Area[]>([]);
    // const [areaId, setAreaId] = useState('');
    // const [cityId, setCityId] = useState('');
    const [cityId, setCityId] = useState('');
    const [areaId, setAreaId] = useState('');

    const { data: cities = [] } = useGetCitiesQuery();

    const { data: areas = [] } = useGetAreasByCityQuery(cityId, {
        skip: !cityId,
    });

    const handleCityChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const selectedCityId = event.target.value;

        setCityId(selectedCityId);
        setAreaId('');

        onLocationChange(selectedCityId, '');
    };

    return (
        <>
            <h2>Filter by price</h2>
            <div className='flex'>
                <select className=' p-2 me-2 bg-white border border-gray-300
             rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none' value={cityId} onChange={handleCityChange}>
                    <option value="">All Cities</option>

                    {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                            {city.name}
                        </option>
                    ))}
                </select>

                <select className='p-2 bg-white border border-gray-300
             rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none' value={areaId} disabled={!cityId} onChange={(event) => {
                        const selectedAreaId = event.target.value;

                        setAreaId(selectedAreaId);
                        onLocationChange(cityId, selectedAreaId);
                    }}>
                    <option value="">{cityId ? 'All Areas' : 'Select City First'}</option>

                    {areas.map((area) => (
                        <option key={area.id} value={area.id}>
                            {area.name}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
}