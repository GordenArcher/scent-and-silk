import { ImageSourcePropType } from "react-native";

export type AppImageSource = ImageSourcePropType | string;

export const getImageSource = (source: AppImageSource): ImageSourcePropType =>
  typeof source === "string" ? { uri: source } : source;

export const images = {
  logo: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400",

  hero1: require("../assets/banners/image1.jpeg"),
  hero2: require("../assets/banners/image2.jpeg"),
  hero3: require("../assets/banners/image1.jpeg"),

  products: {
    p1: require("../assets/products/image1.jpeg"),
    p2: require("../assets/products/image2.jpeg"),
    p3: require("../assets/products/image3.jpeg"),
    p4: require("../assets/products/image4.jpeg"),
    p5: require("../assets/products/image5.jpeg"),
    p6: require("../assets/products/image6.jpeg"),
    p7: require("../assets/products/image7.jpeg"),
    p8: require("../assets/products/image8.jpeg"),
    p9: require("../assets/products/image9.jpeg"),
    p10: require("../assets/products/image10.jpeg"),
    p11: require("../assets/products/image11.jpeg"),
    p12: require("../assets/products/image12.jpeg"),
    p13: require("../assets/products/image13.jpeg"),
    p14: require("../assets/products/image14.jpeg"),
    p15: require("../assets/products/image15.jpeg"),
    p16: require("../assets/products/image16.jpeg"),
  },

  banners: {
    floral: require("../assets/banners/image1.jpeg"),
    woody: require("../assets/banners/image2.jpeg"),
    fresh: require("../assets/banners/image1.jpeg"),
    oriental: require("../assets/banners/image2.jpeg"),
  },
};
