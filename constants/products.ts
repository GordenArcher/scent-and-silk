import { Product } from "../types";
import { images } from "./images";

export const products: Product[] = [
  {
    id: "1",
    name: "Velvet Oud",
    brand: "Scent & Silk",
    price: 89.99,
    description:
      "A rich symphony of aged oud, vanilla bean, and smoky amber. Wraps you in warmth that lingers for hours.",
    notes: ["Oud", "Vanilla", "Amber", "Sandalwood"],
    image: images.products.p1,
    category: "woody",
    volume: 100,
  },
  {
    id: "2",
    name: "Rose Eclipse",
    brand: "Scent & Silk",
    price: 74.99,
    description:
      "Bulgarian rose meets dark musk and pink pepper. Bold, romantic, unforgettable.",
    notes: ["Rose", "Musk", "Pink Pepper", "Patchouli"],
    image: images.products.p2,
    category: "floral",
    volume: 100,
  },
  {
    id: "3",
    name: "Silk Bloom",
    brand: "Scent & Silk",
    price: 69.99,
    description:
      "Jasmine petals, white tea, and soft cedar. Like slipping into clean silk sheets.",
    notes: ["Jasmine", "White Tea", "Cedar", "Bergamot"],
    image: images.products.p3,
    category: "floral",
    volume: 100,
  },
  {
    id: "4",
    name: "Golden Hour",
    brand: "Scent & Silk",
    price: 95.99,
    description:
      "Saffron, honeyed tobacco, and leather. The scent of sunset in a bottle.",
    notes: ["Saffron", "Tobacco", "Honey", "Leather"],
    image: images.products.p4,
    category: "oriental",
    volume: 100,
  },
  {
    id: "5",
    name: "Ocean Mist",
    brand: "Scent & Silk",
    price: 59.99,
    description:
      "Sea salt, lime zest, and driftwood. Crisp, clean, endlessly refreshing.",
    notes: ["Sea Salt", "Lime", "Driftwood", "Mint"],
    image: images.products.p5,
    category: "fresh",
    volume: 100,
  },
  {
    id: "6",
    name: "Noir Vanille",
    brand: "Scent & Silk",
    price: 82.99,
    description:
      "Madagascar vanilla, dark cocoa, and tonka bean. Sweet but dangerously deep.",
    notes: ["Vanilla", "Cocoa", "Tonka", "Almond"],
    image: images.products.p6,
    category: "gourmand",
    volume: 100,
  },
  {
    id: "7",
    name: "Amber Dusk",
    brand: "Scent & Silk",
    price: 79.99,
    description:
      "Warm amber resin, cardamom, and a whisper of incense. Earthy and sensual.",
    notes: ["Amber", "Cardamom", "Incense", "Cinnamon"],
    image: images.products.p7,
    category: "oriental",
    volume: 100,
  },
  {
    id: "8",
    name: "White Peony",
    brand: "Scent & Silk",
    price: 67.99,
    description:
      "Peony, lychee, and soft musk. Light as air, pretty as spring.",
    notes: ["Peony", "Lychee", "Musk", "Freesia"],
    image: images.products.p8,
    category: "floral",
    volume: 100,
  },
  {
    id: "9",
    name: "Cedar & Embers",
    brand: "Scent & Silk",
    price: 88.99,
    description:
      "Smoked cedar, clove, and black tea. A fireside evening captured in glass.",
    notes: ["Cedar", "Clove", "Black Tea", "Vetiver"],
    image: images.products.p9,
    category: "woody",
    volume: 100,
  },
  {
    id: "10",
    name: "Citrus Silk",
    brand: "Scent & Silk",
    price: 54.99,
    description:
      "Grapefruit, neroli, and white musk. Zesty, smooth, effortlessly chic.",
    notes: ["Grapefruit", "Neroli", "White Musk", "Petitgrain"],
    image: images.products.p10,
    category: "fresh",
    volume: 100,
  },
  {
    id: "11",
    name: "Santal Royale",
    brand: "Scent & Silk",
    price: 99.99,
    description:
      "Creamy sandalwood, orris butter, and a touch of coconut. Pure luxury.",
    notes: ["Sandalwood", "Orris", "Coconut", "Myrrh"],
    image: images.products.p11,
    category: "woody",
    volume: 100,
  },
  {
    id: "12",
    name: "Midnight Jasmine",
    brand: "Scent & Silk",
    price: 72.99,
    description:
      "Night-blooming jasmine, black currant, and sheer amber. Mysterious and magnetic.",
    notes: ["Jasmine", "Black Currant", "Amber", "Moss"],
    image: images.products.p12,
    category: "floral",
    volume: 100,
  },
];

export const categories = [
  { label: "All", value: "all" },
  { label: "Floral", value: "floral" },
  { label: "Woody", value: "woody" },
  { label: "Fresh", value: "fresh" },
  { label: "Oriental", value: "oriental" },
  { label: "Gourmand", value: "gourmand" },
];

export const heroPhrases = [
  "Find your signature scent...",
  "Silk in a bottle...",
  "Wear your aura...",
  "Luxury that lingers...",
  "Your scent, your silk...",
];
