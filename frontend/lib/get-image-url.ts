const API_URL = process.env.NEXT_PUBLIC_API_URL;

const BACKEND_URL = API_URL?.replace(/\/api\/?$/, '');

export function getImageUrl(imageUrl: string): string {
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  return `${BACKEND_URL}${imageUrl}`;
}