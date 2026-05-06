export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  notes: string[];
  image: string;
  category: "floral" | "woody" | "fresh" | "oriental" | "gourmand";
  volume: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ThemeName =
  | "aubergine"
  | "rose"
  | "midnight"
  | "sandalwood"
  | "jasmine";

export interface Theme {
  name: ThemeName;
  colors: {
    background: string;
    surface: string;
    primary: string;
    accent: string;
    text: string;
    textSecondary: string;
    border: string;
    cta: string;
    tabBar: string;
    tabBarActive: string;
    tabBarInactive: string;
    statusBar: "light" | "dark";
  };
}
