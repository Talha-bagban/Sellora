'use client';
import {
    useGetCitiesQuery,
    useGetAreasByCityQuery,
} from '@/store/locationApi';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { useGetCategoriesQuery } from '@/store/categoryApi';
import {
    useAppDispatch,
    useAppSelector,
} from '@/store/hooks';

import {
    setEditAdData,
    setCategory,
    setSubCategory,
    setType,
    setAdDetails,
    setStep,
    setLocation,
    setImages
} from '@/store/createAdSlice';

import {
    useGetAdByIdQuery,
    useDeleteAdImageMutation,
    useUpdateAdMutation,
    useUploadAdImageMutation,
} from '@/store/adApi';

export default function EditAdPage() {
    const [isInitialized, setIsInitialized] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();


    const adId = params?.id as string;

    const {
        data: ad,
        isLoading: adLoading,
        isError: adError,
    } = useGetAdByIdQuery(adId, {
        skip: !adId,
    });

    // const [deleteAdImage, { isLoading: isDeletingImage }] =
    //     useDeleteAdImageMutation();

    const [deleteAdImage] = useDeleteAdImageMutation();

    const [updateAd, { isLoading: isUpdatingAd }] =
        useUpdateAdMutation();

    const [uploadAdImage] =
        useUploadAdImageMutation();


    const handleDeleteExistingPhoto = async (imageId: string) => {
        try {
            await deleteAdImage(imageId).unwrap();

            const updatedImages = images.filter(
                (image) => image.id !== imageId
            );

            dispatch(setImages(updatedImages));
        } catch (error) {
            console.error('Failed to delete image:', error);
            alert('Failed to delete image. Please try again.');
        }
    };

    const handleUpdateAd = async () => {
        if (!adId) {
            return;
        }

        try {
            // Update ad details
            await updateAd({
                id: adId,
                body: {
                    title: adTitle.trim(),
                    description: adDescription.trim(),
                    price: Number(adPrice),
                    categoryId: selectedType,
                    cityId: selectedCity,
                    areaId: selectedArea,
                },
            }).unwrap();

            // Upload newly added photos
            for (const file of selectedFiles) {
                await uploadAdImage({
                    adId,
                    file,
                }).unwrap();
            }

            alert('Ad updated successfully.');

            dispatch(setStep(1));
            router.push(`/ads/${adId}`);
        } catch (error) {
            console.error('Failed to update ad:', error);
            alert('Failed to update ad. Please try again.');
        }
    };

    const {
        data: categories,
        isLoading: categoriesLoading,
        isError: categoriesError,
    } = useGetCategoriesQuery();

    // const { categoryId } = useAppSelector(
    //     (state) => state.createAd
    // );


    const {
        categoryId,
        subCategoryId,
        typeId,
        title,
        description,
        price,
        cityId,
        areaId,
        images,
        step
    } = useAppSelector((state) => state.createAd);

    const [selectedCategory, setSelectedCategory] =
        useState(categoryId);

    const [selectedSubCategory, setSelectedSubCategory] =
        useState(subCategoryId);

    const [selectedType, setSelectedType] =
        useState(typeId);

    const category = categories?.find(
        (item) => item.id === selectedCategory
    );

    const subCategory = category?.subCategories.find(
        (item) => item.id === selectedSubCategory
    );

    const [adTitle, setAdTitle] = useState(title);
    const [adDescription, setAdDescription] =
        useState(description);
    const [adPrice, setAdPrice] = useState(price);

    const [selectedCity, setSelectedCity] = useState(cityId);
    const [selectedArea, setSelectedArea] = useState(areaId);

    const {
        data: cities,
        isLoading: citiesLoading,
        isError: citiesError,
    } = useGetCitiesQuery();

    const {
        data: areas,
        isLoading: areasLoading,
        isError: areasError,
    } = useGetAreasByCityQuery(selectedCity, {
        skip: !selectedCity,
    });

    useEffect(() => {
        setAdTitle(title);
        setAdDescription(description);
        setAdPrice(price);
    }, [title, description, price]);

    useEffect(() => {
        if (!ad || !categories || isInitialized) {
            return;
        }

        /*
         * Find the leaf/type category belonging to this ad.
         */
        const leafCategory = categories
            .flatMap((category) =>
                category.subCategories.flatMap(
                    (subCategory) => subCategory.leafCategories
                )
            )
            .find((type) => type.id === ad.categoryId);

        if (!leafCategory) {
            console.error(
                'Could not find category hierarchy for ad:',
                ad.categoryId
            );
            return;
        }

        /*
         * Find the parent sub-category.
         */
        const parentSubCategory = categories
            .flatMap((category) => category.subCategories)
            .find((subCategory) =>
                subCategory.leafCategories.some(
                    (type) => type.id === ad.categoryId
                )
            );

        if (!parentSubCategory) {
            console.error(
                'Could not find sub-category for ad:',
                ad.categoryId
            );
            return;
        }

        /*
         * Find the top-level category.
         */
        const parentCategory = categories.find((category) =>
            category.subCategories.some(
                (subCategory) =>
                    subCategory.id === parentSubCategory.id
            )
        );

        if (!parentCategory) {
            console.error(
                'Could not find parent category for ad:',
                ad.categoryId
            );
            return;
        }

        /*
         * Initialize the existing ad in our create/edit form state.
         */
        dispatch(
            setEditAdData({
                categoryId: parentCategory.id,
                subCategoryId: parentSubCategory.id,
                typeId: leafCategory.id,

                title: ad.title,
                description: ad.description,
                price: String(ad.price),

                cityId: ad.cityId,
                areaId: ad.areaId,

                images: [...ad.images].sort(
                    (a, b) => a.sortOrder - b.sortOrder
                ),
            })
        );
        setSelectedCategory(parentCategory.id);
        setSelectedSubCategory(parentSubCategory.id);
        setSelectedType(leafCategory.id);

        setSelectedCity(ad.cityId);
        setSelectedArea(ad.areaId);

        setIsInitialized(true);


    }, [ad, categories, dispatch, isInitialized]);


    const handleStep1Continue = () => {
        if (
            !selectedCategory ||
            !selectedSubCategory ||
            !selectedType
        ) {
            return;
        }

        dispatch(
            setAdDetails({
                title: adTitle,
                description: adDescription,
                price: adPrice,
            })
        );

        dispatch(setStep(2));
    };

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
                ![
                    'image/jpeg',
                    'image/png',
                    'image/webp',
                ].includes(file.type)
            ) {
                alert(
                    `${file.name}: Only JPG, PNG and WEBP are allowed.`
                );
                continue;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert(
                    `${file.name}: Maximum file size is 5MB.`
                );
                continue;
            }

            validFiles.push(file);
        }

        const remainingSlots =
            5 - images.length - selectedFiles.length;

        if (remainingSlots <= 0) {
            alert('Maximum 5 photos allowed.');
            event.target.value = '';
            return;
        }

        setSelectedFiles((currentFiles) => [
            ...currentFiles,
            ...validFiles.slice(0, remainingSlots),
        ]);

        event.target.value = '';
    };

    const handleRemoveNewPhoto = (index: number) => {
        setSelectedFiles((currentFiles) =>
            currentFiles.filter(
                (_, fileIndex) => fileIndex !== index
            )
        );
    };

    if (adLoading || categoriesLoading) {
        return (
            <main className="w-1/2 mx-auto px-4 py-8">
                <p className="text-gray-500">
                    Loading ad...
                </p>
            </main>
        );
    }

    if (adError || categoriesError) {
        return (
            <main className="w-1/2 mx-auto px-4 py-8">
                <p className="text-red-500">
                    Failed to load ad.
                </p>

                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mt-4 px-5 py-2 border rounded-lg"
                >
                    Go Back
                </button>
            </main>
        );
    }

    if (!ad) {
        return (
            <main className="w-1/2 mx-auto px-4 py-8">
                <p className="text-gray-500">
                    Ad not found.
                </p>
            </main>
        );
    }

    if (!isInitialized) {
        return (
            <main className="w-1/2 mx-auto px-4 py-8">
                <p className="text-gray-500">
                    Loading ad...
                </p>
            </main>
        );
    }

    if (step === 1)
        return (
            <main className="w-1/2 mx-auto px-4 py-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Edit Your Ad
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Step 1 of 5
                    </p>
                </div>

                <div className="border rounded-xl p-6 bg-white">

                    <h2 className="text-xl font-semibold mb-6">
                        Select Category
                    </h2>

                    <div className="space-y-5">

                        {/* Category */}
                        <div>
                            <label className="block font-medium mb-2">
                                Category *
                            </label>

                            <select
                                value={selectedCategory}
                                onChange={(event) => {
                                    const value = event.target.value;

                                    setSelectedCategory(value);
                                    setSelectedSubCategory('');
                                    setSelectedType('');

                                    dispatch(setCategory(value));
                                }}
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
                                onChange={(event) => {
                                    const value = event.target.value;

                                    setSelectedSubCategory(value);
                                    setSelectedType('');

                                    dispatch(setSubCategory(value));
                                }}
                                disabled={!selectedCategory}
                                className="w-full border rounded-lg px-3 py-3 disabled:bg-gray-100"
                            >
                                <option value="">
                                    {selectedCategory
                                        ? 'Select Sub-category'
                                        : 'Select Category First'}
                                </option>
                                {category?.subCategories.map((subCategory) => (
                                    <option
                                        key={subCategory.id}
                                        value={subCategory.id}
                                    >
                                        {subCategory.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block font-medium mb-2">
                                Type *
                            </label>

                            <select
                                value={selectedType}
                                onChange={(event) => {
                                    const value = event.target.value;

                                    setSelectedType(value);

                                    dispatch(setType(value));
                                }}
                                disabled={!selectedSubCategory}
                                className="w-full border rounded-lg px-3 py-3 disabled:bg-gray-100"
                            >
                                <option value="">
                                    {selectedSubCategory
                                        ? 'Select Type'
                                        : 'Select Sub-category First'}
                                </option>
                                {subCategory?.leafCategories.map((type) => (
                                    <option
                                        key={type.id}
                                        value={type.id}
                                    >
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

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

    if (step === 2) {
        return (
            <main className="w-1/2 mx-auto px-4 py-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Edit Your Ad
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

                    <div className="flex justify-between mt-8">

                        <button
                            type="button"
                            onClick={() => dispatch(setStep(1))}
                            className="px-6 py-3 border rounded-lg hover:bg-gray-100"
                        >
                            Back
                        </button>

                        <button
                            type="button"
                            onClick={() => {
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
                            }}
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

    if (step === 3) {
        return (
            <main className="w-1/2 mx-auto px-4 py-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Edit Your Ad
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
                                disabled={
                                    !selectedCity ||
                                    areasLoading
                                }
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

                    <div className="flex justify-between mt-8">

                        <button
                            type="button"
                            onClick={() => dispatch(setStep(2))}
                            className="px-6 py-3 border rounded-lg hover:bg-gray-100"
                        >
                            Back
                        </button>

                        <button
                            type="button"
                            onClick={() => {
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
                            }}
                            disabled={
                                !selectedCity ||
                                !selectedArea
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

    if (step === 4) {
        return (
            <main className="w-1/2 mx-auto px-4 py-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Edit Your Ad
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Step 4 of 5
                    </p>
                </div>

                <div className="border rounded-xl p-6 bg-white">

                    <h2 className="text-xl font-semibold mb-6">
                        Photos
                    </h2>

                    <p className="text-sm text-gray-500 mb-6">
                        Add up to 5 photos to your ad.
                    </p>

                    {/* Existing Photos */}
                    {images.length > 0 && (
                        <div className="mb-8">
                            <h3 className="mb-3 font-medium">
                                Existing Photos
                            </h3>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                                {images.map((image) => (
                                    <div
                                        key={image.id}
                                        className="relative overflow-hidden rounded-lg border"
                                    >
                                        <img
                                            src={`http://localhost:3000${image.imageUrl}`}
                                            alt="Ad photo"
                                            className="h-32 w-full object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteExistingPhoto(image.id)
                                            }
                                            className="absolute right-1 top-1 rounded-full bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New Photos */}
                    {selectedFiles.length > 0 && (
                        <div className="mb-8">
                            <h3 className="mb-3 font-medium">
                                New Photos
                            </h3>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                                {selectedFiles.map((file, index) => (
                                    <div
                                        key={`${file.name}-${index}`}
                                        className="relative overflow-hidden rounded-lg border"
                                    >
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="h-32 w-full object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveNewPhoto(index)
                                            }
                                            className="absolute right-1 top-1 rounded-full bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upload */}
                    {images.length + selectedFiles.length < 5 && (
                        <div>
                            <label
                                htmlFor="edit-ad-images"
                                className="inline-block cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                            >
                                Add Photos
                            </label>

                            <input
                                id="edit-ad-images"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                className="hidden"
                                onChange={handlePhotoChange}
                            />

                            <p className="mt-2 text-sm text-gray-500">
                                {images.length + selectedFiles.length} / 5 photos selected
                            </p>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between mt-8">

                        <button
                            type="button"
                            onClick={() => dispatch(setStep(3))}
                            className="px-6 py-3 border rounded-lg hover:bg-gray-100"
                        >
                            Back
                        </button>

                        <button
                            type="button"
                            onClick={() => dispatch(setStep(5))}
                            className="px-6 py-3 bg-blue-600 rounded-2xl text-white hover:bg-blue-700"
                        >
                            Continue
                        </button>

                    </div>

                </div>
            </main>
        );
    }

    if (step === 5) {
        return (
            <main className="w-1/2 mx-auto px-4 py-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Preview Your Ad
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Step 5 of 5
                    </p>
                </div>

                <div className="border rounded-xl p-6 bg-white">

                    <h2 className="text-xl font-semibold mb-6">
                        Review Your Ad
                    </h2>

                    <div className="space-y-6">

                        {/* Category */}
                        <div>
                            <p className="text-sm text-gray-500">
                                Category
                            </p>

                            <p className="font-medium">
                                {category?.name}
                                {' / '}
                                {subCategory?.name}
                                {' / '}
                                {subCategory?.leafCategories.find(
                                    (type) => type.id === selectedType
                                )?.name}
                            </p>
                        </div>

                        {/* Title */}
                        <div>
                            <p className="text-sm text-gray-500">
                                Title
                            </p>

                            <p className="font-medium">
                                {adTitle}
                            </p>
                        </div>

                        {/* Description */}
                        <div>
                            <p className="text-sm text-gray-500">
                                Description
                            </p>

                            <p className="whitespace-pre-wrap">
                                {adDescription || 'No description'}
                            </p>
                        </div>

                        {/* Price */}
                        <div>
                            <p className="text-sm text-gray-500">
                                Price
                            </p>

                            <p className="text-xl font-semibold">
                                ₹{adPrice}
                            </p>
                        </div>

                        {/* Location */}
                        <div>
                            <p className="text-sm text-gray-500">
                                Location
                            </p>

                            <p className="font-medium">
                                {cities?.find(
                                    (city) => city.id === selectedCity
                                )?.name}
                                {', '}
                                {areas?.find(
                                    (area) => area.id === selectedArea
                                )?.name}
                            </p>
                        </div>

                        {/* Photos */}
                        <div>
                            <p className="text-sm text-gray-500 mb-3">
                                Photos
                            </p>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">

                                {/* Existing photos */}
                                {images.map((image) => (
                                    <img
                                        key={image.id}
                                        src={`http://localhost:3000${image.imageUrl}`}
                                        alt="Ad photo"
                                        className="h-32 w-full object-cover rounded-lg border"
                                    />
                                ))}

                                {/* New photos */}
                                {selectedFiles.map((file, index) => (
                                    <img
                                        key={`${file.name}-${index}`}
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className="h-32 w-full object-cover rounded-lg border"
                                    />
                                ))}

                            </div>
                        </div>

                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-8">

                        <button
                            type="button"
                            onClick={() => dispatch(setStep(4))}
                            className="px-6 py-3 border rounded-lg hover:bg-gray-100"
                        >
                            Back
                        </button>

                        <button
                            type="button"
                            onClick={handleUpdateAd}
                            disabled={isUpdatingAd}
                            className="px-6 py-3 bg-green-600 rounded-2xl text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUpdatingAd ? 'Updating...' : 'Update Ad'}
                        </button>

                    </div>

                </div>
            </main>
        );
    }

    return null;
}