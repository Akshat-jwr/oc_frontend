// context/AppContext.tsx

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authService, userService } from '@/lib/api';
import { User, Cart, RegisterData, AuthResponse, LoginCredentials, Product } from '../types';
import Loading from '@/components/ui/Loading'; 

// --- MODIFIED: Added missing functions required by your application ---
interface AppContextType {
  isAuthenticated: boolean;
  user: User | null;
  cart: Cart | null;
  wishlist: string[];
  isLoading: boolean;
  cartCount: number;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<any>;
  logout: () => void;
  // All cart functions are now present and correctly typed
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartItemQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  updateCart: (cart: Cart | null) => void; // Kept as requested
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;
  // This calculation is now safe and correct based on your types.
  const cartCount = cart && Array.isArray(cart.items) ? cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;

  // --- THE CORE OF THE FIX: A ROBUST REFRESH FUNCTION ---
  // This single function is now the source of truth for the cart state.
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const freshCart = await userService.getCart();
      setCart(freshCart);
    } catch (error) {
      console.error("Failed to refresh cart:", error);
      setCart(null); // Clear cart on error to prevent displaying stale/incorrect data
    }
  }, [isAuthenticated]);

  const initializeApp = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const [userData, wishlistData] = await Promise.all([
          authService.getMe(),
          userService.getWishlist(),
        ]);
        setUser(userData.user);
        setWishlist(wishlistData.items.map(p => p._id));
        // After user is authenticated, refresh the cart separately
        if (userData.user) {
            const cartData = await userService.getCart();
            setCart(cartData);
        }
      } catch (error) {
        console.error("Session initialization failed:", error);
        localStorage.clear();
        setUser(null);
        setCart(null);
        setWishlist([]);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { initializeApp(); }, [initializeApp]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    await initializeApp();
    return response;
  }, [initializeApp]);

  const register = useCallback(async (data: RegisterData) => authService.register(data), []);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch (error) { console.error("Logout API failed.", error); }
    localStorage.clear();
    setUser(null); setCart(null); setWishlist([]);
  }, []);
  
  // --- ALL CART MUTATIONS NOW USE THE "MUTATE THEN REFRESH" PATTERN ---

  const addToCart = async (productId: string, quantity: number) => {
    if (!isAuthenticated) throw new Error("Please log in.");
    await userService.addToCart(productId, quantity);
    await refreshCart(); // Guarantees the state is correct
  };

  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated) return;
    await userService.removeFromCart(productId);
    await refreshCart(); // Guarantees the state is correct
  };

  const updateCartItemQuantity = async (productId: string, quantity: number) => {
    if (!isAuthenticated) return;
    await userService.updateCartItem(productId, quantity);
    await refreshCart(); // Guarantees the state is correct
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;
    await userService.clearCart();
    await refreshCart(); // Guarantees the state is correct
  };

  const updateCart = (newCart: Cart | null) => setCart(newCart);

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const toggleWishlist = useCallback(async (productId: string) => {
    // ... (This logic was correct and remains the same)
    if (!isAuthenticated) throw new Error("Please log in.");
    const inWishlist = isInWishlist(productId);
    setWishlist(prev => inWishlist ? prev.filter(id => id !== productId) : [...prev, productId]);
    try {
      if (inWishlist) await userService.removeFromWishlist(productId);
      else await userService.addToWishlist(productId);
    } catch (e) {
      setWishlist(prev => inWishlist ? [...prev, productId] : prev.filter(id => id !== productId));
      throw new Error("Failed to update wishlist.");
    }
  }, [isAuthenticated, wishlist, isInWishlist]);

  // --- ASSEMBLED CONTEXT VALUE WITH ALL REQUIRED FUNCTIONS ---
  const contextValue = {
    isAuthenticated, user, cart, wishlist, isLoading, cartCount,
    login, register, logout,
    addToCart, removeFromCart, updateCartItemQuantity, clearCart,
    updateCart, // Kept as requested
    toggleWishlist, isInWishlist
  };

  if (isLoading) return <Loading fullScreen text="Initializing Om Creations..." />;

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
};
