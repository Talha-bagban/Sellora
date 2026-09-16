export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  cityId: string;
  areaId: string;
  userId: string;
  status: string;
  views: number;
  createdAt: string;
  updatedAt: string;

     category: {
    id: string;
    name: string;
    slug: string;
  };

  city: {
    id: string;
    name: string;
    state: string;
  };

  area: {
    id: string;
    name: string;
    cityId: string;
  };


  images: AdImage[];
}

export interface AdImage {
  id: string;
  adId: string;
  imageUrl: string;
  sortOrder: number;
}

export interface AdsResponse {
  data: Ad[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}