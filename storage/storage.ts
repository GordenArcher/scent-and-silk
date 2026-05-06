import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeName, CartItem } from "../types";

const KEYS = {
  THEME: "@scent_silk_theme",
  CART: "@scent_silk_cart",
  WISHLIST: "@scent_silk_wishlist",
};

export const saveTheme = async (theme: ThemeName) => {
  await AsyncStorage.setItem(KEYS.THEME, theme);
};

export const getTheme = async (): Promise<ThemeName | null> => {
  return (await AsyncStorage.getItem(KEYS.THEME)) as ThemeName | null;
};

export const saveCart = async (cart: CartItem[]) => {
  await AsyncStorage.setItem(KEYS.CART, JSON.stringify(cart));
};

export const getCart = async (): Promise<CartItem[]> => {
  const data = await AsyncStorage.getItem(KEYS.CART);
  return data ? JSON.parse(data) : [];
};

export const saveWishlist = async (wishlist: string[]) => {
  await AsyncStorage.setItem(KEYS.WISHLIST, JSON.stringify(wishlist));
};

export const getWishlist = async (): Promise<string[]> => {
  const data = await AsyncStorage.getItem(KEYS.WISHLIST);
  return data ? JSON.parse(data) : [];
};

export const clearCart = async () => {
  await AsyncStorage.removeItem(KEYS.CART);
};
