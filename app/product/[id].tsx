import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../theme/useTheme";
import { products } from "../../constants/products";
import {
  getCart,
  saveCart,
  getWishlist,
  saveWishlist,
} from "../../storage/storage";
import { CartItem } from "../../types";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const router = useRouter();

  const product = products.find((p) => p.id === id);

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    checkWishlist();
  }, []);

  const checkWishlist = async () => {
    const wishlist = await getWishlist();
    setIsWishlisted(wishlist.includes(id));
  };

  const toggleWishlist = async () => {
    const wishlist = await getWishlist();
    if (isWishlisted) {
      const updated = wishlist.filter((wid) => wid !== id);
      await saveWishlist(updated);
      setIsWishlisted(false);
    } else {
      wishlist.push(id);
      await saveWishlist(wishlist);
      setIsWishlisted(true);
    }
  };

  const addToCart = async () => {
    if (!product) return;
    const cart = await getCart();
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id,
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }

    await saveCart(cart);
    router.push("/cart");
  };

  if (!product) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text style={{ color: theme.colors.text }}>Product not found</Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", theme.colors.background]}
            style={styles.gradient}
          />
          <Pressable
            style={[
              styles.wishlistBtn,
              { backgroundColor: theme.colors.surface },
            ]}
            onPress={toggleWishlist}
          >
            <Ionicons
              name={isWishlisted ? "heart" : "heart-outline"}
              size={22}
              color={
                isWishlisted ? theme.colors.cta : theme.colors.textSecondary
              }
            />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={[styles.brand, { color: theme.colors.accent }]}>
            {product.brand}
          </Text>
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {product.name}
          </Text>

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: theme.colors.cta }]}>
              ${product.price.toFixed(2)}
            </Text>
            <View
              style={[
                styles.volumeBadge,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Text
                style={[
                  styles.volumeText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {product.volume}ml
              </Text>
            </View>
          </View>

          <View
            style={[styles.divider, { backgroundColor: theme.colors.border }]}
          />

          <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
            Description
          </Text>
          <Text
            style={[styles.description, { color: theme.colors.textSecondary }]}
          >
            {product.description}
          </Text>

          <View
            style={[styles.divider, { backgroundColor: theme.colors.border }]}
          />

          <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
            Fragrance Notes
          </Text>
          <View style={styles.notesContainer}>
            {product.notes.map((note, index) => (
              <View
                key={index}
                style={[
                  styles.noteChip,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <Text style={[styles.noteText, { color: theme.colors.accent }]}>
                  {note}
                </Text>
              </View>
            ))}
          </View>

          <View
            style={[styles.divider, { backgroundColor: theme.colors.border }]}
          />

          <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
            Category
          </Text>
          <View
            style={[styles.categoryChip, { backgroundColor: theme.colors.cta }]}
          >
            <Text style={styles.categoryText}>
              {product.category.charAt(0).toUpperCase() +
                product.category.slice(1)}
            </Text>
          </View>

          <View style={{ height: 140 }} />
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.colors.primary,
            borderTopColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.quantityRow}>
          <Pressable
            style={[styles.qtyBtn, { borderColor: theme.colors.border }]}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Ionicons name="remove" size={18} color={theme.colors.text} />
          </Pressable>
          <Text style={[styles.qtyValue, { color: theme.colors.text }]}>
            {quantity}
          </Text>
          <Pressable
            style={[styles.qtyBtn, { borderColor: theme.colors.border }]}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Ionicons name="add" size={18} color={theme.colors.text} />
          </Pressable>
        </View>

        <Pressable
          style={[styles.addToCartBtn, { backgroundColor: theme.colors.cta }]}
          onPress={addToCart}
        >
          <Ionicons name="bag-add-outline" size={20} color="#FFFFFF" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
          <Text style={styles.addToCartPrice}>
            ${(product.price * quantity).toFixed(2)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: { position: "relative" },
  image: { width, height: width },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  wishlistBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  brand: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 4,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  name: {
    fontSize: 30,
    fontWeight: "300",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  price: { fontSize: 24, fontWeight: "700" },
  volumeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  volumeText: { fontSize: 13, fontWeight: "500" },
  divider: { height: 0.5, marginVertical: 20 },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  description: { fontSize: 15, fontWeight: "400", lineHeight: 24 },
  notesContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  noteChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  noteText: { fontSize: 13, fontWeight: "500" },
  categoryChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 0.5,
    gap: 16,
  },
  quantityRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyValue: {
    fontSize: 17,
    fontWeight: "600",
    minWidth: 24,
    textAlign: "center",
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 25,
  },
  addToCartText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  addToCartPrice: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
});
