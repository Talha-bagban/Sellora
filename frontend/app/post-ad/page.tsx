'use client';

import { useEffect, useState } from 'react';
import { useGetCategoriesQuery } from '@/store/categoryApi';
import {
    useAppDispatch,
    useAppSelector,
} from '@/store/hooks';
import {
    setCategory,
    setSubCategory,
    setType,
    setAdDetails,
    setLocation,
    setStep,
    resetCreateAd,
} from '@/store/createAdSlice';
import { useGetCitiesQuery, useGetAreasByCityQuery } from '@/store/locationApi';
import { useRouter } from 'next/navigation';
import { useCreateAdMutation, useUploadAdImageMutation } from '@/store/adApi';

export default function PostAdPage() {
    const dispatch = useAppDispatch();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const router = useRouter();

    const [createAd, { isLoading: isCreatingAd }] =
        useCreateAdMutation();

    const [uploadAdImages, { isLoading: isUploadingImages }] =
        useUploadAdImageMutation();

    const {
        step,
        categoryId,
        subCategoryId,
        typeId,
        title,
        description,
        price,
        cityId,
        areaId,
    } = useAppSelector((state) => state.createAd);

    const {
        data: categories,
        isLoading,
        isError,    
    } = useGetCategoriesQuery();

    const {
        data: cities,
        isLoading: citiesLoading,
        isError: citiesError,
    } = useGetCitiesQuery();

    const {
        data: areas,
        isLoading: areasLoading,
        isError: areasError,
    } = useGetAreasByCityQuery(cityId, {
        skip: !cityId,
    });


    // Step 1 local state
    const [selectedCategory, setSelectedCategory] = useState(
        categoryId
    );
    const [selectedSubCategory, setSelectedSubCategory] = useState(
        subCategoryId
    );
    const [selectedType, setSelectedType] = useState(
        typeId
    );


    // Step 2 local state
    const [adTitle, setAdTitle] = useState(title);
    const [adDescription, setAdDescription] =
        useState(description);
    const [adPrice, setAdPrice] = useState(price);


    // step 3 local state
    const [selectedCity, setSelectedCity] = useState(cityId);
    const [selectedArea, setSelectedArea] = useState(areaId);


    // Sync Step 1 Redux → local state
    useEffect(() => {
        setSelectedCategory(categoryId);
        setSelectedSubCategory(subCategoryId);
        setSelectedType(typeId);
    }, [categoryId, subCategoryId, typeId]);

    // Sync Step 2 Redux → local state
    useEffect(() => {
        setAdTitle(title);
        setAdDescription(description);
        setAdPrice(price);
    }, [title, description, price]);

    // Sync Step 3 Redux → local state
    useEffect(() => {
        setSelectedCity(cityId);
        setSelectedArea(areaId);
    }, [cityId, areaId]);


    const category = categories?.find(
        (item) => item.id === selectedCategory
    );

    const subCategory = category?.subCategories.find(
        (item) => item.id === selectedSubCategory
    );

    const selectedCityData = cities?.find(
        (city) => city.id === selectedCity
    );

    const selectedAreaData = areas?.find(
        (area) => area.id === selectedArea
    );


    // -------------------------
    // STEP 1 HANDLERS
    // -------------------------
    const handleCategoryChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = event.target.value;

        setSelectedCategory(value);
        setSelectedSubCategory('');
        setSelectedType('');

        dispatch(setCategory(value));
    };

    const handleSubCategoryChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = event.target.value;

        setSelectedSubCategory(value);
        setSelectedType('');

        dispatch(setSubCategory(value));
    };

    const handleTypeChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = event.target.value;

        setSelectedType(value);

        dispatch(setType(value));
    };

    const handleStep1Continue = () => {
        if (
            !selectedCategory ||
            !selectedSubCategory ||
            !selectedType
        ) {
            return;
        }

        dispatch(setStep(2));
    };


    // -------------------------
    // STEP 2 HANDLERS
    // -------------------------
    const handleStep2Continue = () => {
        if (!adTitle.trim()) {
            return;
        }

        dispatch(
            setAdDetails({
                title: adTitle.trim(),
                description: adDescription.trim(),
                price: adPrice,
            })
        );

        dispatch(setStep(3));
    };

    const handleStep2Back = () => {
        dispatch(
            setAdDetails({
                title: adTitle,
                description: adDescription,
                price: adPrice,
            })
        );

        dispatch(setStep(1));
    };


    // -------------------------
    // STEP 3 HANDLERS
    // -------------------------
    const handleCityChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = event.target.value;

        setSelectedCity(value);
        setSelectedArea('');

        dispatch(
            setLocation({
                cityId: value,
                areaId: '',
            })
        );
    };

    const handleAreaChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const value = event.target.value;

        setSelectedArea(value);

        dispatch(
            setLocation({
                cityId: selectedCity,
                areaId: value,
            })
        );
    };

    const handleStep3Back = () => {
        dispatch(
            setLocation({
                cityId: selectedCity,
                areaId: selectedArea,
            })
        );

        dispatch(setStep(2));
    };

    const handleStep3Continue = () => {
        if (!selectedCity || !selectedArea) {
            return;
        }

        dispatch(
            setLocation({
                cityId: selectedCity,
                areaId: selectedArea,
            })
        );

        dispatch(setStep(4));
    };


    // -------------------------
    // STEP 4 HANDLERS
    // -------------------------

    const handlePhotoChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(event.target.files || []);

        if (!files.length) {
            return;
        }

        const validFiles: File[] = [];

        for (const file of files) {
            if (
                !['image/jpeg', 'image/png', 'image/webp'].includes(
                    file.type
                )
            ) {
                alert(`${file.name}: Only JPG, PNG and WEBP are allowed.`);
                continue;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert(`${file.name}: Maximum file size is 5MB.`);
                continue;
            }

            validFiles.push(file);
        }

        const combinedFiles = [
            ...selectedFiles,
            ...validFiles,
        ];

        setSelectedFiles(combinedFiles.slice(0, 5));

        // Reset input so the same file can be selected again later
        event.target.value = '';
    };

    const handleRemovePhoto = (index: number) => {
        setSelectedFiles((currentFiles) =>
            currentFiles.filter((_, fileIndex) => fileIndex !== index)
        );
    };

    const handleStep4Continue = () => {
        dispatch(setStep(5));
    };
    const handleStep4Back = () => {
        dispatch(setStep(3));
    };

    const handlePostAd = async () => {
        try {
            const createdAd = await createAd({
                title: adTitle.trim(),
                description: adDescription.trim(),
                price: Number(adPrice),
                categoryId: selectedType,
                cityId: selectedCity,
                areaId: selectedArea,
            }).unwrap();

            if (selectedFiles.length > 0) {
                for (const file of selectedFiles) {
                    await uploadAdImages({
                        adId: createdAd.id,
                        file,
                    }).unwrap();
                }
            }

            dispatch(resetCreateAd());

            alert('Ad posted successfully!');

            router.push('/profile');
        } catch (error) {
            console.error('Failed to post ad:', error);

            alert('Failed to post ad. Please try again.');
        }
    };



    // -------------------------
    // STEP 1 UI
    // -------------------------
    if (step === 1) {
        return (
            <main className="w-1/2 mx-auto px-4 py-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Post Your Ad
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Step 1 of 5
                    </p>
                </div>

                <div className="border rounded-xl p-6 bg-white">

                    <h2 className="text-xl font-semibold mb-6">
                        Select Category
                    </h2>

                    {isLoading && (
                        <p className="text-gray-500">
                            Loading categories...
                        </p>
                    )}

                    {isError && (
                        <p className="text-red-500">
                            Failed to load categories.
                        </p>
                    )}

                    {!isLoading && !isError && (
                        <div className="space-y-5">

                            {/* Category */}
                            <div>
                                <label className="block font-medium mb-2">
                                    Category *
                                </label>

                                <select
                                    value={selectedCategory}
                                    onChange={handleCategoryChange}
                                    className="w-full border rounded-lg px-3 py-3"
                                >
                                    <option value="">
                                        Select Category
                                    </option>

                                    {categories?.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sub-category */}
                            <div>
                                <label className="block font-medium mb-2">
                                    Sub-category *
                                </label>

                                <select
                                    value={selectedSubCategory}
                                    onChange={handleSubCategoryChange}
                                    disabled={!selectedCategory}
                                    className="w-full border rounded-lg px-3 py-3 disabled:bg-gray-100"
                                >
                                    <option value="">
                                        {selectedCategory
                                            ? 'Select Sub-category'
                                            : 'Select Category First'}
                                    </option>

                                    {category?.subCategories.map(
                                        (subCategory) => (
                                            <option
                                                key={subCategory.id}
                                                value={subCategory.id}
                                            >
                                                {subCategory.name}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block font-medium mb-2">
                                    Type *
                                </label>

                                <select
                                    value={selectedType}
                                    onChange={handleTypeChange}
                                    disabled={!selectedSubCategory}
                                    className="w-full border rounded-lg px-3 py-3 disabled:bg-gray-100"
                                >
                                    <option value="">
                                        {selectedSubCategory
                                            ? 'Select Type'
                                            : 'Select Sub-category First'}
                                    </option>

                                    {subCategory?.leafCategories.map(
                                        (type) => (
                                            <option
                                                key={type.id}
                                                value={type.id}
                                            >
                                                {type.name}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end mt-8">

                        <button
                            type="button"
                            onClick={handleStep1Continue}
                            disabled={
                                !selectedCategory ||
                                !selectedSubCategory ||
                                !selectedType
                            }
                            className="px-6 py-3 bg-blue-600 rounded-2xl text-white hover:bg-blue-700 
                         disabled:opacity-50 
                        disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>

                    </div>

                </div>

            </main>
        );
    }

    // -------------------------
    // STEP 2 UI
    // -------------------------
    if (step === 2) {
        return (
            <main className="w-1/2 mx-auto px-4 py-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Post Your Ad
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Step 2 of 5
                    </p>
                </div>

                <div className="border rounded-xl p-6 bg-white">

                    <h2 className="text-xl font-semibold mb-6">
                        Ad Details
                    </h2>

                    <div className="space-y-5">

                        {/* Title */}
                        <div>
                            <label className="block font-medium mb-2">
                                Title *
                            </label>

                            <input
                                type="text"
                                value={adTitle}
                                onChange={(event) =>
                                    setAdTitle(event.target.value)
                                }
                                placeholder="Enter ad title"
                                className="w-full border rounded-lg px-3 py-3"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block font-medium mb-2">
                                Description
                            </label>

                            <textarea
                                value={adDescription}
                                onChange={(event) =>
                                    setAdDescription(event.target.value)
                                }
                                placeholder="Describe your product..."
                                rows={5}
                                className="w-full border rounded-lg px-3 py-3 resize-none"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block font-medium mb-2">
                                Price (₹)
                            </label>

                            <input
                                type="number"
                                min="0"
                                value={adPrice}
                                onChange={(event) =>
                                    setAdPrice(event.target.value)
                                }
                                placeholder="Enter price"
                                className="w-full border rounded-lg px-3 py-3"
                            />
                        </div>

                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between mt-8">

                        <button
                            type="button"
                            onClick={handleStep2Back}
                            className="px-6 py-3 border rounded-lg hover:bg-gray-100"
                        >
                            Back
                        </button>

                        <button
                            type="button"
                            onClick={handleStep2Continue}
                            disabled={!adTitle.trim()}
                            className="px-6 py-3 bg-blue-600 rounded-2xl text-white hover:bg-blue-700 
                         disabled:opacity-50 
                        disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>

                    </div>

                </div>

            </main>
        );
    }


    // -------------------------
    // STEP 3 UI
    // -------------------------
    if (step === 3) {
        return (
            <main className="w-1/2 mx-auto px-4 py-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Post Your Ad
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Step 3 of 5
                    </p>
                </div>

                <div className="border rounded-xl p-6 bg-white">

                    <h2 className="text-xl font-semibold mb-6">
                        Location
                    </h2>

                    <div className="space-y-5">

                        {/* City */}
                        <div>
                            <label className="block font-medium mb-2">
                                City *
                            </label>

                            {citiesLoading ? (
                                <p className="text-gray-500">
                                    Loading cities...
                                </p>
                            ) : citiesError ? (
                                <p className="text-red-500">
                                    Failed to load cities.
                                </p>
                            ) : (
                                <select
                                    value={selectedCity}
                                    onChange={handleCityChange}
                                    className="w-full border rounded-lg px-3 py-3"
                                >
                                    <option value="">
                                        Select City
                                    </option>

                                    {cities?.map((city) => (
                                        <option
                                            key={city.id}
                                            value={city.id}
                                        >
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Area */}
                        <div>
                            <label className="block font-medium mb-2">
                                Area *
                            </label>

                            <select
                                value={selectedArea}
                                onChange={handleAreaChange}
                                disabled={!selectedCity || areasLoading}
                                className="w-full border rounded-lg px-3 py-3 disabled:bg-gray-100"
                            >
                                <option value="">
                                    {!selectedCity
                                        ? 'Select City First'
                                        : areasLoading
                                            ? 'Loading Areas...'
                                            : 'Select Area'}
                                </option>

                                {areas?.map((area) => (
                                    <option
                                        key={area.id}
                                        value={area.id}
                                    >
                                        {area.name}
                                    </option>
                                ))}
                            </select>

                            {areasError && (
                                <p className="text-red-500 text-sm mt-2">
                                    Failed to load areas.
                                </p>
                            )}
                        </div>

                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between mt-8">

                        <button
                            type="button"
                            onClick={handleStep3Back}
                            className="px-6 py-3 me-1.5 border rounded-lg hover:bg-gray-100"
                        >
                            Back
                        </button>

                        <button
                            type="button"
                            onClick={handleStep3Continue}
                            disabled={!selectedCity || !selectedArea}
                            className="px-6 py-3 bg-blue-600 rounded-2xl text-white hover:bg-blue-700 
                         disabled:opacity-50 
                        disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>

                    </div>

                </div>

            </main>
        );
    }


    // -------------------------
    // STEP 4 UI
    // -------------------------
    if (step === 4) {
        return (
            <main className="w-1/2 mx-auto px-4 py-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Post Your Ad
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Step 4 of 5
                    </p>
                </div>

                <div className="border rounded-xl p-6 bg-white">

                    <h2 className="text-xl font-semibold mb-2">
                        Add Photos
                    </h2>

                    <p className="text-gray-500 mb-6">
                        Add up to 5 photos of your product.
                    </p>

                    {/* Upload area */}
                    {selectedFiles.length < 5 && (
                        <label className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">

                            <div className="text-4xl mb-3">
                                📷
                            </div>

                            <p className="font-medium">
                                Add photos of your item
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                                JPG, PNG or WEBP • Max 5MB each
                            </p>

                            <span className="mt-4 px-5 py-2 bg-accent-600 text-white rounded-lg">
                                Choose Photos
                            </span>

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                className="hidden"
                                onChange={handlePhotoChange}
                            />

                        </label>
                    )}

                    {/* Counter */}
                    <div className="mt-5 font-medium">
                        {selectedFiles.length} / 5 Photos
                    </div>

                    {/* Preview */}
                    {selectedFiles.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">

                            {selectedFiles.map((file, index) => (
                                <div
                                    key={`${file.name}-${index}`}
                                    className="relative border rounded-lg overflow-hidden"
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Selected photo ${index + 1}`}
                                        className="w-full h-32 object-cover"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => handleRemovePhoto(index)}
                                        className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-full"
                                    >
                                        ×
                                    </button>

                                    {index === 0 && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1">
                                            Main Photo
                                        </div>
                                    )}
                                </div>
                            ))}

                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-between mt-8">

                        <button
                            type="button"
                            onClick={handleStep4Back}
                            className="px-6 py-3 border rounded-lg hover:bg-gray-100"
                        >
                            Back
                        </button>

                        <button
                            type="button"
                            onClick={handleStep4Continue}
                            className="px-6 py-3 bg-blue-600 rounded-2xl text-white hover:bg-blue-700 
                         disabled:opacity-50 
                        disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>

                    </div>

                </div>

            </main>
        );
    }

    // -------------------------
    // STEP 5 UI
    // -------------------------
    if (step === 5) {
        return (
            <main className="w-1/2 mx-auto px-4 py-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Post Your Ad
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Step 5 of 5
                    </p>
                </div>

                <div className="border rounded-xl bg-white overflow-hidden">

                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">
                            Preview Your Ad
                        </h2>

                        <p className="text-gray-500 mt-1">
                            Review your ad before posting.
                        </p>
                    </div>

                    {/* Photos */}
                    {selectedFiles.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4">

                            {selectedFiles.map((file, index) => (
                                <img
                                    key={`${file.name}-${index}`}
                                    src={URL.createObjectURL(file)}
                                    alt={`Ad photo ${index + 1}`}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            ))}

                        </div>
                    ) : (
                        <div className="h-48 flex items-center justify-center bg-gray-100">
                            <p className="text-gray-500">
                                No photos added
                            </p>
                        </div>
                    )}

                    {/* Ad Information */}
                    <div className="p-6">

                        <h3 className="text-2xl font-bold">
                            {adTitle}
                        </h3>

                        <p className="text-2xl font-bold mt-3">
                            ₹{adPrice || '0'}
                        </p>

                        {/* Category */}
                        <div className="mt-5">
                            <p className="text-sm text-gray-500">
                                Category
                            </p>

                            <p className="font-medium">
                                {category?.name || '-'}
                                {' → '}
                                {subCategory?.name || '-'}
                                {' → '}
                                {subCategory?.leafCategories.find(
                                    (type) => type.id === selectedType
                                )?.name || '-'}
                            </p>
                        </div>

                        {/* Location */}
                        <div className="mt-4">
                            <p className="text-sm text-gray-500">
                                Location
                            </p>

                            <p className="font-medium">
                                {selectedCityData?.name || '-'}
                                {selectedAreaData?.name
                                    ? `, ${selectedAreaData.name}`
                                    : ''}
                            </p>
                        </div>

                        {/* Description */}
                        <div className="mt-5">
                            <p className="text-sm text-gray-500">
                                Description
                            </p>

                            <p className="mt-1 whitespace-pre-wrap">
                                {adDescription || 'No description added'}
                            </p>
                        </div>

                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between p-6 border-t">

                        <button
                            type="button"
                            onClick={() => dispatch(setStep(4))}
                            className="px-6 py-3 border rounded-lg hover:bg-gray-100"
                        >
                            Back
                        </button>

                        <button
                            type="button"
                            onClick={handlePostAd}
                            disabled={isCreatingAd || isUploadingImages}
                            className="px-6 py-3 bg-blue-600 rounded-2xl text-white hover:bg-blue-700 
                         disabled:opacity-50 
                        disabled:cursor-not-allowed"
                        >
                            {isCreatingAd
                                ? 'Posting Ad...'
                                : isUploadingImages
                                    ? 'Uploading Photos...'
                                    : 'Post Ad'}
                        </button>

                    </div>

                </div>

            </main>
        );
    }

    // Temporary placeholder for Step 3
    return (
        <main className="w-1/2 mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold">
                Post Your Ad
            </h1>

            <p className="text-gray-500 mt-2">
                Step {step} of 5
            </p>

            <div className="border rounded-xl p-6 mt-8">
                <p>Next step coming soon.</p>
            </div>
        </main>
    );



}