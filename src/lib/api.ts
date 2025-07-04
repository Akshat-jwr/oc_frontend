// lib/api.ts

import axios from 'axios';
import {
  AuthResponse, LoginCredentials, RegisterData,
  Product, Category, Recommendation, User, Address,
  Cart, CartSummary, Order, Review, SearchFilters, FilterOptions,
  PaginationResponse, Pagination // Ensure Pagination is imported
} from '@/types';

// ... (axiosInstance and interceptors remain the same) ...
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const { data } = await axios.post(`${refreshBase}/auth/refresh-token`, {}, { withCredentials: true });
        const newAccessToken = data.data.accessToken;
        if (typeof window !== 'undefined') localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          if (!window.location.pathname.startsWith('/auth')) window.location.href = '/auth';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export interface CreateOrderResponse {
  order: Order;
  paymentRequired: boolean;
  paymentDetails: {
    amount: number;
    currency: string;
    method: string;
    orderId: string; // This is the Razorpay Order ID
  };
}

const handleResponse = (response: any) => response.data.data;

// --- SERVICES ---

export const authService = {
  register: (data: RegisterData) => axiosInstance.post('/auth/register', data).then(handleResponse),
  verifyEmail: (data: { email: string; otp: string }): Promise<AuthResponse> => axiosInstance.post('/auth/verify-email', data).then(handleResponse),
  resendOTP: (data: { email: string }) => axiosInstance.post('/auth/resend-otp', data).then(handleResponse),
  login: (credentials: LoginCredentials): Promise<AuthResponse> => axiosInstance.post('/auth/login', credentials).then(handleResponse),
  googleAuth: (idToken: string): Promise<AuthResponse> => axiosInstance.post('/auth/google', { idToken }).then(handleResponse),
  logout: () => axiosInstance.post('/auth/logout'),
  getMe: (): Promise<{ user: User }> => axiosInstance.get('/auth/me').then(handleResponse),
};

export const publicService = {
  getAllProducts: (filters: SearchFilters): Promise<{ products: Product[]; pagination: any }> => {
    return axiosInstance.get('/public/products', { params: filters }).then(handleResponse);
  },
  getProductById: (idOrSlug: string): Promise<Product> => axiosInstance.get(`/public/products/${idOrSlug}`).then(handleResponse),
  getFeaturedProducts: (limit: number = 8): Promise<Product[]> => axiosInstance.get('/public/products/featured', { params: { limit } }).then(handleResponse),
  getProductsByCategory: (categoryId: string, filters: SearchFilters): Promise<{ products: Product[]; pagination: any }> => {
    return axiosInstance.get(`/public/products/category/${categoryId}`, { params: filters }).then(handleResponse);
  },
  getRelatedProducts: (productId: string, limit: number = 6): Promise<Product[]> => axiosInstance.get(`/public/products/${productId}/related`, { params: { limit } }).then(handleResponse),
  getAllCategories: (params?: { includeEmpty?: boolean; parentOnly?: boolean }): Promise<Category[]> => axiosInstance.get('/public/categories', { params }).then(handleResponse),
  getCategoryById: (id: string): Promise<Category> => axiosInstance.get(`/public/categories/${id}`).then(handleResponse),
  searchProducts: (query: string, suggestions: boolean = false): Promise<Product[] | string[]> => axiosInstance.get('/public/search', { params: { q: query, suggestions } }).then(handleResponse),
  getSearchSuggestions: (query: string): Promise<string[]> => axiosInstance.get('/public/search/suggestions', { params: { q: query } }).then(handleResponse),
  getFilterOptions: (categoryId?: string): Promise<FilterOptions> => axiosInstance.get('/public/filters', { params: { category: categoryId } }).then(handleResponse),
};

export const userService = {
  getUserProfile: (): Promise<User> => axiosInstance.get('/user/profile').then(handleResponse),
  updateUserProfile: (data: Partial<User>): Promise<User> => axiosInstance.put('/user/profile', data).then(handleResponse),
  changePassword: (data: { currentPassword: string; newPassword: string }) => axiosInstance.patch('/user/change-password', data),
  uploadAvatar: (file: File): Promise<{ avatar: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    return axiosInstance.post('/user/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(handleResponse);
  },
  searchProducts: async (
    query: string, 
    options?: {
      page?: number;
      limit?: number;
      sort?: string;
      order?: 'asc' | 'desc';
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
    }
  ): Promise<{ products: Product[], pagination: any }> => {
    try {
      // Build query string for the global search endpoint
      const searchParams = new URLSearchParams();
      searchParams.append('q', query);
      searchParams.append('type', 'products'); // Only search for products
      
      if (options) {
        if (options.page) searchParams.append('page', String(options.page));
        if (options.limit) searchParams.append('limit', String(options.limit));
        if (options.sort) searchParams.append('sort', options.sort);
        if (options.order) searchParams.append('order', options.order);
        if (options.category) searchParams.append('category', options.category);
        if (options.minPrice !== undefined) searchParams.append('minPrice', String(options.minPrice));
        if (options.maxPrice !== undefined) searchParams.append('maxPrice', String(options.maxPrice));
        if (options.inStock !== undefined) searchParams.append('inStock', String(options.inStock));
      }
      
      // ✅ FIXED: Use /public/search instead of /public/products/search
      const url = `/public/search?${searchParams.toString()}`;
      console.log('Search API URL:', url);
      
      const response = await axiosInstance.get(url);
      const data = handleResponse(response);
      
      console.log('Raw search API response:', data);
      
      // Handle the global search response structure
      return {
        products: Array.isArray(data) ? data : (data?.products || []),
        pagination: data?.pagination || {
          total: Array.isArray(data) ? data.length : 0,
          page: options?.page || 1,
          limit: options?.limit || 24,
          pages: 1,
          hasNext: false,
          hasPrev: false
        }
      };
      
    } catch (error) {
      console.error('Search products API error:', error);
      return {
        products: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 24,
          pages: 0,
          hasNext: false,
          hasPrev: false
        }
      };
    }
  },

  // ✅ Keep this exactly as it is (already working)
  getSearchSuggestions: async (query: string): Promise<string[]> => {
    try {
      const response = await axiosInstance.get(`/public/search/suggestions?q=${encodeURIComponent(query)}`);
      const data = handleResponse(response);
      
      if (!Array.isArray(data)) {
        return [];
      }

      return data.map(item => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null) {
          return item.value || item.name || item.text || item.title || item.label || String(item);
        }
        return String(item);
      }).filter(item => item.trim().length > 0);
      
    } catch (error) {
      console.error('Search suggestions API error:', error);
      return [];
    }
  },

  globalSearch: (query: string, type: 'all' | 'products' | 'categories' = 'all'): Promise<any> => {
    return axiosInstance.get(`/public/search?q=${encodeURIComponent(query)}&type=${type}`).then(handleResponse);
  },
  getCart: (): Promise<Cart> => axiosInstance.get('/user/cart').then(handleResponse),
  addToCart: (productId: string, quantity: number, customizations?: object): Promise<Cart> => axiosInstance.post('/user/cart', { productId, quantity, customizations }).then(handleResponse),
  updateCartItem: (productId: string, quantity: number): Promise<Cart> => axiosInstance.patch(`/user/cart/${productId}`, { quantity }).then(handleResponse),
  removeFromCart: (productId: string): Promise<Cart> => axiosInstance.delete(`/user/cart/${productId}`).then(handleResponse),
  clearCart: () => axiosInstance.delete('/user/cart'),
  getCartSummary: (): Promise<CartSummary> => axiosInstance.get('/user/cart/summary').then(handleResponse),
  getWishlist: (): Promise<PaginationResponse<Product>> => axiosInstance.get('/user/wishlist').then(handleResponse),
  addToWishlist: (productId: string) => axiosInstance.post('/user/wishlist', { productId }),
  removeFromWishlist: (productId: string) => axiosInstance.delete(`/user/wishlist/${productId}`),
  createOrder: (data: any): Promise<CreateOrderResponse> => {
    return axiosInstance.post('/user/orders', data).then(handleResponse);
  },  // --- PERFECTLY AND DEFINITIVELY CORRECTED RETURN TYPE ---
  getProductReviews: (productId: string): Promise<{ 
    reviews: Review[], 
    pagination: any 
}> => {
  return axiosInstance.get(`/user/reviews?productId=${productId}`).then(handleResponse);
},
  getUserOrders: (filters: any): Promise<{ orders: Order[]; pagination: Pagination; }> => axiosInstance.get('/user/orders', { params: filters }).then(handleResponse),
  getOrderById: (id: string): Promise<Order> => axiosInstance.get(`/user/orders/${id}`).then(handleResponse),
  cancelOrder: (id: string, reason?: string) => axiosInstance.patch(`/user/orders/${id}/cancel`, { reason }),
  getUserAddresses: (): Promise<Address[]> => axiosInstance.get('/user/addresses').then(handleResponse),
  addAddress: (data: Omit<Address, '_id' | 'isDefault'>): Promise<Address> => axiosInstance.post('/user/addresses', data).then(handleResponse),
  updateAddress: (id: string, data: Partial<Address>): Promise<Address> => axiosInstance.put(`/user/addresses/${id}`, data).then(handleResponse),
  deleteAddress: (id: string) => axiosInstance.delete(`/user/addresses/${id}`),
  setDefaultAddress: (id: string): Promise<Address> => axiosInstance.patch(`/user/addresses/${id}/default`).then(handleResponse),
  createReview: (data: { productId: string; rating: number; comment: string }): Promise<Review> => axiosInstance.post('/user/reviews', data).then(handleResponse),
  getPersonalizedRecommendations: (limit: number = 12): Promise<Recommendation[]> => axiosInstance.get('/user/recommendations', { params: { limit } }).then(handleResponse),
  getTrendingProducts: (limit: number = 8): Promise<Product[]> => axiosInstance.get('/user/recommendations/trending', { params: { limit } }).then(handleResponse).then(res => res.items),
};

export const paymentService = {
  verifyPayment: (data: any) => axiosInstance.post('/payment/verify', data),
  getAvailablePaymentMethods: (data: { postalCode: string }): Promise<string[]> => axiosInstance.post('/payment/methods', data).then(handleResponse),
  getPaymentStatus: (paymentId: string): Promise<any> => axiosInstance.get(`/payment/status/${paymentId}`).then(handleResponse),
};
