export interface CreateGearItemPayload {
  name: string;
  description: string;
  image: string;
  brand: string;
  condition?: string;
  pricePerDay: number;
  stock: number;
  categoryId: string;
}

export interface UpdateGearItemPayload {
  name?: string;
  description?: string;
  image?: string;
  brand?: string;
  condition?: string;
  pricePerDay?: number;
  stock?: number;
  categoryId?: string;
}


export interface IGearQuery {
  searchTerm?: string;
  categoryId?: string;
  brand?: string;
  available?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}