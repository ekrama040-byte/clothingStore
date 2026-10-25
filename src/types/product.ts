export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  location?: string;
  currency?: string;
  sellerId?: string;
  sellerName?: string;
  sellerAvatar?: string;
  createdByUser?: boolean;
  createdAt?: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
}