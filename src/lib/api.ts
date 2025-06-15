import axios, { AxiosResponse, AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { 
  ApiResponse, 
  PaginationResponse, 
  Product, 
  Category, 
  SearchFilters,
  FilterOptions,
  User,
  Cart,
  CartSummary,
  Order,
  Address,
  Review,
  Recommendation,
  LoginCredentials,
  RegisterData,
  AuthResponse
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with smart error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const protectedRoutes = ['/cart', '/checkout', '/orders', '/wishlist', '/profile', '/account'];
      
      if (protectedRoutes.some(route => currentPath.startsWith(route))) {
        removeAuthToken();
        if (typeof window !== 'undefined') {
          window.location.href = `/auth?returnUrl=${encodeURIComponent(currentPath)}`;
        }
      }
    }
    return Promise.reject(error);
  }
);

// Token management
export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  localStorage.setItem('accessToken', token);
};

export const removeAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// Authentication Services
export const authService = {
  register: (data: RegisterData): Promise<AxiosResponse<ApiResponse<{ user: User }>>> =>
    api.post('/auth/register', data),
  
  verifyEmail: (data: { email: string; otp: string }): Promise<AxiosResponse<ApiResponse<AuthResponse>>> =>
    api.post('/auth/verify-email', data),
  
  resendOTP: (data: { email: string }): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/auth/resend-otp', data),
  
  login: (data: LoginCredentials): Promise<AxiosResponse<ApiResponse<AuthResponse>>> =>
    api.post('/auth/login', data),
  
  googleAuth: (data: { idToken: string }): Promise<AxiosResponse<ApiResponse<AuthResponse>>> =>
    api.post('/auth/google', data),
  
  logout: (): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/auth/logout'),
  
  refreshToken: (): Promise<AxiosResponse<ApiResponse<{ accessToken: string }>>> =>
    api.post('/auth/refresh-token'),
};

// Public Services (No authentication required)
export const publicService = {
  // Products
  getProducts: (filters?: SearchFilters): Promise<AxiosResponse<ApiResponse<PaginationResponse<Product>>>> =>
    api.get('/public/products', { params: filters }),
  
  getProduct: (id: string): Promise<AxiosResponse<ApiResponse<Product>>> =>
    api.get(`/public/products/${id}`),
  
  getFeaturedProducts: (limit = 8): Promise<AxiosResponse<ApiResponse<Product[]>>> =>
    api.get('/public/products/featured', { params: { limit } }),
  
  searchProducts: (params: { q: string; suggestions?: boolean } & SearchFilters): Promise<AxiosResponse<ApiResponse<PaginationResponse<Product> | string[]>>> =>
    api.get('/public/products/search', { params }),
  
  getProductsByCategory: (categoryId: string, params?: SearchFilters): Promise<AxiosResponse<ApiResponse<PaginationResponse<Product>>>> =>
    api.get(`/public/products/category/${categoryId}`, { params }),
  
  getRelatedProducts: (id: string, limit = 6): Promise<AxiosResponse<ApiResponse<Product[]>>> =>
    api.get(`/public/products/${id}/related`, { params: { limit } }),

  // Categories
  getCategories: (params?: { includeEmpty?: boolean; parentOnly?: boolean }): Promise<AxiosResponse<ApiResponse<Category[]>>> =>
    api.get('/public/categories', { params }),
  
  getCategory: (id: string): Promise<AxiosResponse<ApiResponse<Category>>> =>
    api.get(`/public/categories/${id}`),
  
  getCategoryProducts: (id: string, params?: SearchFilters): Promise<AxiosResponse<ApiResponse<PaginationResponse<Product>>>> =>
    api.get(`/public/categories/${id}/products`, { params }),

  // Search & Filters
  globalSearch: (params: { q: string; type?: 'all' | 'products' | 'categories' }): Promise<AxiosResponse<ApiResponse<{ products: Product[]; categories: Category[]; totalResults: any }>>> =>
    api.get('/public/search', { params }),
  
  getFilters: (params?: { category?: string }): Promise<AxiosResponse<ApiResponse<FilterOptions>>> =>
    api.get('/public/filters', { params }),
};

// User Services (Authentication required)
export const userService = {
  // Profile
  getProfile: (): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.get('/user/profile'),
  
  updateProfile: (data: Partial<User>): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.put('/user/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }): Promise<AxiosResponse<ApiResponse>> =>
    api.patch('/user/change-password', data),
  
  uploadAvatar: (formData: FormData): Promise<AxiosResponse<ApiResponse<{ avatar: string }>>> =>
    api.post('/user/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  
  getDashboard: (): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.get('/user/dashboard'),
  
  deleteAccount: (): Promise<AxiosResponse<ApiResponse>> =>
    api.delete('/user/account'),

  // Cart
  getCart: (): Promise<AxiosResponse<ApiResponse<Cart>>> =>
    api.get('/user/cart'),
  
  getCartSummary: (): Promise<AxiosResponse<ApiResponse<CartSummary>>> =>
    api.get('/user/cart/summary'),
  
  addToCart: (data: { productId: string; quantity: number; customizations?: any }): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/user/cart', data),
  
  updateCartItem: (productId: string, data: { quantity: number }): Promise<AxiosResponse<ApiResponse>> =>
    api.patch(`/user/cart/${productId}`, data),
  
  removeFromCart: (productId: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/user/cart/${productId}`),
  
  clearCart: (): Promise<AxiosResponse<ApiResponse>> =>
    api.delete('/user/cart'),

  // Wishlist
  getWishlist: (params?: { page?: number; limit?: number }): Promise<AxiosResponse<ApiResponse<PaginationResponse<Product>>>> =>
    api.get('/user/wishlist', { params }),
  
  addToWishlist: (data: { productId: string }): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/user/wishlist', data),
  
  removeFromWishlist: (productId: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/user/wishlist/${productId}`),
  
  moveWishlistToCart: (data: { productId: string; quantity?: number }): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/user/wishlist/move-to-cart', data),

  // Orders
  getOrders: (params?: { page?: number; limit?: number; status?: string; startDate?: string; endDate?: string }): Promise<AxiosResponse<ApiResponse<PaginationResponse<Order>>>> =>
    api.get('/user/orders', { params }),
  
  createOrder: (data: any): Promise<AxiosResponse<ApiResponse<Order>>> =>
    api.post('/user/orders', data),
  
  getOrder: (id: string): Promise<AxiosResponse<ApiResponse<Order>>> =>
    api.get(`/user/orders/${id}`),
  
  cancelOrder: (id: string, data?: { reason?: string }): Promise<AxiosResponse<ApiResponse>> =>
    api.patch(`/user/orders/${id}/cancel`, data),
  
  getOrderTracking: (id: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.get(`/user/orders/${id}/tracking`),

  // Addresses
  getAddresses: (): Promise<AxiosResponse<ApiResponse<Address[]>>> =>
    api.get('/user/addresses'),
  
  addAddress: (data: Omit<Address, '_id'>): Promise<AxiosResponse<ApiResponse<Address>>> =>
    api.post('/user/addresses', data),
  
  updateAddress: (id: string, data: Partial<Address>): Promise<AxiosResponse<ApiResponse<Address>>> =>
    api.put(`/user/addresses/${id}`, data),
  
  deleteAddress: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/user/addresses/${id}`),
  
  setDefaultAddress: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.patch(`/user/addresses/${id}/default`),

  // Reviews
  createReview: (data: { productId: string; rating: number; comment: string }): Promise<AxiosResponse<ApiResponse<Review>>> =>
    api.post('/user/reviews', data),
  
  getUserReviews: (params?: { page?: number; limit?: number }): Promise<AxiosResponse<ApiResponse<PaginationResponse<Review>>>> =>
    api.get('/user/reviews', { params }),
  
  updateReview: (id: string, data: { rating?: number; comment?: string }): Promise<AxiosResponse<ApiResponse<Review>>> =>
    api.put(`/user/reviews/${id}`, data),
  
  deleteReview: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/user/reviews/${id}`),

  // Recommendations
 getPersonalizedRecommendations: (params?: { limit?: number; type?: string }): Promise<AxiosResponse<ApiResponse<Recommendation[]>>> =>
    api.get('/user/recommendations', { params }),
  
  getProductRecommendations: (productId: string, params?: { limit?: number }): Promise<AxiosResponse<ApiResponse<Product[]>>> =>
    api.get(`/user/recommendations/product/${productId}`, { params }),
  
  getCategoryRecommendations: (categoryId: string, params?: { limit?: number }): Promise<AxiosResponse<ApiResponse<Product[]>>> =>
    api.get(`/user/recommendations/category/${categoryId}`, { params }),
  
  getTrendingProducts: (params?: { limit?: number; category?: string }): Promise<AxiosResponse<ApiResponse<Product[]>>> =>
    api.get('/user/recommendations/trending', { params }),
  
  getRecentlyViewed: (params?: { limit?: number }): Promise<AxiosResponse<ApiResponse<Product[]>>> =>
    api.get('/user/recently-viewed', { params }),

  // Activity Tracking
  trackProductView: (productId: string, data: any): Promise<AxiosResponse<ApiResponse>> =>
    api.post(`/user/track/product-view/${productId}`, data),
  
  trackPageTime: (data: { pageType: string; timeSpent: number; interactions?: any }): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/user/track/page-time', data),
};

// Payment Services
export const paymentService = {
  verifyPayment: (data: { orderId: string; razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/payment/verify', data),
  
  getPaymentMethods: (data: { postalCode: string; city?: string; state?: string }): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.post('/payment/methods', data),
  
  getPaymentStatus: (paymentId: string): Promise<AxiosResponse<ApiResponse<any>>> =>
    api.get(`/payment/status/${paymentId}`),
};



export default api;

