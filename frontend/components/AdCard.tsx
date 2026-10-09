import { getImageUrl } from '@/lib/get-image-url';
import { Ad } from '@/types/ad';
import { useRouter } from 'next/navigation';

interface AdCardProps {
  ad: Ad;
}

export default function AdCard({ ad }: AdCardProps) {
  const router = useRouter();
  const image = ad.images?.[0]?.imageUrl;

  const getTimeAgo = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);

    const diffInSeconds = Math.floor(
        (now.getTime() - created.getTime()) / 1000
    );

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (diffInSeconds < 60) {
        return "Just now";
    }

    if (minutes < 60) {
        return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }

    if (hours < 24) {
        return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }

    if (days < 7) {
        return `${days} ${days === 1 ? "day" : "days"} ago`;
    }

    return created.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

  return (
    // <div className="border rounded-lg overflow-hidden" onClick={() => router.push(`/ads/${ad.id}`)}>
    //   {image && (
    //     <img
    //       src={`http://localhost:3000${image}`}
    //       alt={ad.title}
    //       className="w-full h-48 object-cover"
    //     />
    //   )}

    //   <div className="p-4">
    //     <h2 className="font-semibold text-lg">
    //       {ad.title}
    //     </h2>

    //     <p className="text-xl font-bold mt-2">
    //       ₹{ad.price}
    //     </p>

    //     <p className="text-gray-500 mt-1">
    //       {ad.city?.name}
    //       {ad.area?.name && `, ${ad.area.name}`}
    //     </p>
    //   </div>
    // </div>
    <div
    className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    onClick={() => router.push(`/ads/${ad.id}`)}
>
    {/* Image */}
    <div className="relative h-52 w-full overflow-hidden bg-gray-100">
        {image ? (
            <img
                src={getImageUrl(image)}
                alt={ad.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
        ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
                No image
            </div>
        )}

        {/* Favorite */}
        <button
            type="button"
            onClick={(event) => {
                event.stopPropagation();
            }}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-100"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-5 w-5 text-gray-700"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733C11.285 4.876 9.623 3.75 7.688 3.75 5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
            </svg>
        </button>

        {/* Photo count */}
        {ad.images?.length > 0 && (
            <span className="absolute bottom-3 left-3 rounded-md bg-black/70 px-2.5 py-1 text-xs font-medium text-white">
                {ad.images.length}{" "}
                {ad.images.length === 1 ? "photo" : "photos"}
            </span>
        )}
    </div>

    {/* Content */}
    <div className="p-4">
        {/* Title */}
        <h2 className="line-clamp-2 text-lg font-semibold leading-7 text-gray-900">
            {ad.title}
        </h2>

        {/* Price */}
        <p className="mt-1 text-xl font-bold text-blue-600">
            ₹{ad.price.toLocaleString("en-IN")}
        </p>

        {/* Location */}
        <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-4 w-4 shrink-0"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 10.5-7.5 10.5S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
            </svg>

            <span className="truncate">
                {ad.city?.name}
                {ad.area?.name && `, ${ad.area.name}`}
            </span>
        </div>

        {/* Bottom metadata */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-4 w-4"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6l4 2"
                />
                <circle
                    cx="12"
                    cy="12"
                    r="9"
                />
            </svg>

            <span>{getTimeAgo(ad.createdAt)}</span>
        </div>
    </div>
</div>
  );
}