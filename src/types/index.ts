// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  countryCode?: string;
  avatar?: string;
  role: 'user' | 'admin';
  emailVerified: boolean;
  addresses: Address[];
  preferences?: {
    categories: string[];
    priceRange: {
      min: number;
      max: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

// Address Types
export interface Address {
  _id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

// Product Types
export interface ProductImage {
  _id?: string;
  url: string;
  alt?: string;
  isFeatured: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPercentage: number;
  discountedPrice: number;
  stock: number;
  category: Category;
  images: ProductImage[];
  features: string[];
  specifications: Record<string, any>;
  customizationOptions?: Array<{
    name: string;
    options: string[];
  }>;
  averageRating: number;
  reviewCount: number;
  isInStock: boolean;
  viewCount?: number;
  brand?: string;
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  parentCategory?: string;
  productCount: number;
  children?: Category[];
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  _id: string;
  productId: Product;
  quantity: number;
  customizations?: Record<string, any>;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  updatedAt: string;
}

export interface CartSummary {
  totalItems: number;
  totalPrice: number;
  estimatedShipping: number;
  tax: number;
  finalTotal: number;
}

// Order Types
export interface Order {
  _id: string;
  orderNumber: string;
  items: Array<{
    product: Product;
    quantity: number;
    price: number;
    customizations?: Record<string, any>;
  }>;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentInfo: {
    method: 'upi' | 'credit_card' | 'cash_on_delivery';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
  };
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface Review {
  _id: string;
  user: User;
  product: string;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginationResponse<T> {
  products?: T[];
  items?: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Search Types
export interface SearchFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price' | 'name' | 'rating' | 'newest' | 'popularity';
  order?: 'asc' | 'desc';
  inStock?: boolean;
  page?: number;
  limit?: number;
}

export interface FilterOptions {
  priceRange: {
    min: number;
    max: number;
  };
  categories: Array<{
    _id: string;
    name: string;
    count: number;
  }>;
  brands: string[];
  stockStatus: Array<{
    name: 'in-stock' | 'out-of-stock';
    count: number;
  }>;
}

// Recommendation Types
export interface Recommendation {
  product: Product;
  score: number;
  reason: string;
  type: 'collaborative' | 'content' | 'trending' | 'recently_viewed';
}


// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  countryCode?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
