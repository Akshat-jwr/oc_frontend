'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { User, Cart, Product, CartSummary } from '@/types';
import { userService, authService, setAuthToken, removeAuthToken } from '@/lib/api';
import toast from 'react-hot-toast';

interface AppState {
  user: User | null;
  cart: Cart | null;
  cartSummary: CartSummary | null;
  wishlist: Product[];
  isLoading: boolean;
  isAuthenticated: boolean;
  cartCount: number;
  wishlistCount: number;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_CART'; payload: Cart | null }
  | { type: 'SET_CART_SUMMARY'; payload: CartSummary | null }
  | { type: 'SET_WISHLIST'; payload: Product[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_CART_ITEM'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_CART_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string };

interface AppContextType {
  state: AppState;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<any>;
  logout: () => void;
  addToCart: (productId: string, quantity?: number, customizations?: any) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  refreshCartSummary: () => Promise<void>;
}

const initialState: AppState = {
  user: null,
  cart: null,
  cartSummary: null,
  wishlist: [],
  isLoading: true,
  isAuthenticated: false,
  cartCount: 0,
  wishlistCount: 0,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case 'SET_CART':
      const cart = action.payload;
      return {
        ...state,
        cart,
        cartCount: cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
      };
    case 'SET_CART_SUMMARY':
      return {
        ...state,
        cartSummary: action.payload,
      };
    case 'SET_WISHLIST':
      return {
        ...state,
        wishlist: action.payload,
        wishlistCount: action.payload.length,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'UPDATE_CART_ITEM':
      if (!state.cart) return state;
      const updatedItems = state.cart.items.map(item =>
        item.productId._id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        cart: { ...state.cart, items: updatedItems },
        cartCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    case 'REMOVE_CART_ITEM':
      if (!state.cart) return state;
      const filteredItems = state.cart.items.filter(item => item.productId._id !== action.payload);
      return {
        ...state,
        cart: { ...state.cart, items: filteredItems },
        cartCount: filteredItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: { items: [], totalPrice: 0, updatedAt: new Date().toISOString() },
        cartCount: 0,
      };
    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
        wishlistCount: state.wishlist.length + 1,
      };
    case 'REMOVE_FROM_WISHLIST':
      const newWishlist = state.wishlist.filter(item => item._id !== action.payload);
      return {
        ...state,
        wishlist: newWishlist,
        wishlistCount: newWishlist.length,
      };
    default:
      return state;
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        
        if (token) {
          setAuthToken(token);
          try {
            const response = await userService.getProfile();
            dispatch({ type: 'SET_USER', payload: response.data.data });
          } catch (error) {
            console.error('Token validation failed:', error);
            removeAuthToken();
            dispatch({ type: 'SET_USER', payload: null });
          }
        } else {
          dispatch({ type: 'SET_USER', payload: null });
        }
      } catch (error) {
        console.error('Initialization error:', error);
        dispatch({ type: 'SET_USER', payload: null });
      }
    };

    initializeUser();
  }, []);

  const refreshCart = useCallback(async () => {
    if (!state.isAuthenticated) return;
    
    try {
      const response = await userService.getCart();
      dispatch({ type: 'SET_CART', payload: response.data.data });
    } catch (error) {
      console.error('Failed to refresh cart:', error);
    }
  }, [state.isAuthenticated]);

  const refreshCartSummary = useCallback(async () => {
    if (!state.isAuthenticated) return;
    
    try {
      const response = await userService.getCartSummary();
      dispatch({ type: 'SET_CART_SUMMARY', payload: response.data.data });
    } catch (error) {
      console.error('Failed to refresh cart summary:', error);
    }
  }, [state.isAuthenticated]);

  const refreshWishlist = useCallback(async () => {
    if (!state.isAuthenticated) return;
    
    try {
      const response = await userService.getWishlist({ limit: 100 });
      dispatch({ type: 'SET_WISHLIST', payload: response.data.data.items || [] });
    } catch (error) {
      console.error('Failed to refresh wishlist:', error);
    }
  }, [state.isAuthenticated]);

  useEffect(() => {
    if (state.isAuthenticated) {
      refreshCart();
      refreshWishlist();
      refreshCartSummary();
    }
  }, [state.isAuthenticated, refreshCart, refreshWishlist, refreshCartSummary]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await authService.login({ email, password });
      const { user, accessToken } = response.data.data;
      
      setAuthToken(accessToken);
      dispatch({ type: 'SET_USER', payload: user });
      
      toast.success('Login successful!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw new Error(message);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const register = useCallback(async (data: any) => {
    try {
      const response = await authService.register(data);
      toast.success('Registration successful! Please check your email for verification.');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeAuthToken();
      dispatch({ type: 'SET_USER', payload: null });
      dispatch({ type: 'SET_CART', payload: null });
      dispatch({ type: 'SET_CART_SUMMARY', payload: null });
      dispatch({ type: 'SET_WISHLIST', payload: [] });
      toast.success('Logged out successfully');
    }
  }, []);

  const addToCart = useCallback(async (productId: string, quantity = 1, customizations?: any) => {
    if (!state.isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await userService.addToCart({ productId, quantity, customizations });
      await refreshCart();
      await refreshCartSummary();
      toast.success('Item added to cart');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(message);
    }
  }, [state.isAuthenticated, refreshCart, refreshCartSummary]);

  const removeFromCart = useCallback(async (productId: string) => {
    try {
      await userService.removeFromCart(productId);
      dispatch({ type: 'REMOVE_CART_ITEM', payload: productId });
      await refreshCartSummary();
      toast.success('Item removed from cart');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to remove item from cart';
      toast.error(message);
    }
  }, [refreshCartSummary]);

  const updateCartQuantity = useCallback(async (productId: string, quantity: number) => {
    try {
      await userService.updateCartItem(productId, { quantity });
      dispatch({ type: 'UPDATE_CART_ITEM', payload: { productId, quantity } });
      await refreshCartSummary();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update cart';
      toast.error(message);
    }
  }, [refreshCartSummary]);

  const addToWishlist = useCallback(async (productId: string) => {
    if (!state.isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    try {
      await userService.addToWishlist({ productId });
      await refreshWishlist();
      toast.success('Item added to wishlist');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to add item to wishlist';
      toast.error(message);
    }
  }, [state.isAuthenticated, refreshWishlist]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    try {
      await userService.removeFromWishlist(productId);
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
      toast.success('Item removed from wishlist');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to remove item from wishlist';
      toast.error(message);
    }
  }, []);

  const contextValue = useMemo(() => ({
    state,
    login,
    register,
    logout,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    addToWishlist,
    removeFromWishlist,
    refreshCart,
    refreshWishlist,
    refreshCartSummary,
  }), [state, login, register, logout, addToCart, removeFromCart, updateCartQuantity, addToWishlist, removeFromWishlist, refreshCart, refreshWishlist, refreshCartSummary]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
};
