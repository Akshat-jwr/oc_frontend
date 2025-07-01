// types/index.ts

// --- API & Core Types ---

export type SortOption = 'price' | 'name' | 'rating' | 'newest' | 'popularity';
export type OrderOption = 'asc' | 'desc';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationResponse<T> {
  items: T[];
  pagination: Pagination;
}

// --- AUTHENTICATION ---
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

// --- USER & ADDRESS ---
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
  wishlist: string[]; // Storing only product IDs
  cart: Cart;
  orders: string[]; // Storing order IDs
  createdAt: string;
  updatedAt: string;
}

// --- PRODUCT & CATEGORY ---
export interface ProductImage {
  _id?: string;
  url: string;
  publicId: string;
  isFeatured: boolean;
  alt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: string;
  image?: string;
  ancestors: Array<{ _id: string; name: string; slug: string }>;
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  
  price: number;
  currentPrice: number;
  savings: number;
  discountPercentage: number;
  
  stock: number;
  isInStock: boolean;
  
  category: Category;
  brand?: string;
  tags?: string[];
  images: ProductImage[];
  
  features: string[];
  specifications: Record<string, any>;
  customizationOptions?: Array<{
    name: string;
    type: 'text' | 'select' | 'color' | 'image';
    options: string[];
    required: boolean;
    additionalCost?: number;
  }>;
  
  seo: {
    slug?: string; // --- CORRECTED: Slug is optional
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  
  averageRating: number;
  reviewCount: number;
  
  // --- PERFECTLY CORRECTED: Reviews are part of the Product object ---
  reviews?: Review[]; // This field is populated by the backend

  status: 'draft' | 'active' | 'inactive' | 'archived';
  isFeatured: boolean;
  
  createdAt: string;
  updatedAt: string;
}

// --- CART ---
export interface CartItem {
  _id: string;
  product: Product; // Populated from backend
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  updatedAt: string;

  summary: {
    totalItems: number;
    totalPrice: number;
    estimatedTax: number;
    estimatedShipping: number;
    estimatedTotal: number;
  };
  
}

export interface CartSummary {
  totalItems: number;
  totalPrice: number;
  estimatedShipping: number;
  tax: number;
  finalTotal: number;
}

// --- ORDER ---
export interface OrderItem {
  product: Product; // Populated
  quantity: number;
  price: number; // Price at time of order
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string; // User ID
  items: OrderItem[];
  shippingAddress: Address; // Embedded address object
  billingAddress?: Address;
  paymentInfo: {
    method: 'upi' | 'credit_card' | 'debit_card' | 'cash_on_delivery';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    transactionId?: string;
    paymentId?: string;
  };
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// --- REVIEW ---
export interface Review {
  _id: string;
  productId: string;
  userId: User; // Populated
  rating: number;
  comment: string;
  images: string[];
  isVerifiedPurchase: boolean;
  replies: Array<{
    userId: User; // Populated
    comment: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// --- RECOMMENDATION ---
export interface Recommendation {
  product: Product;
  score: number;
  reason: string;
  type: 'collaborative' | 'content' | 'trending' | 'recently_viewed';
}

// --- SEARCH & FILTERS ---
export interface SearchFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  order?: OrderOption;
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
  brands: Array<{
    name: string;
    count: number;
  }>;
}
