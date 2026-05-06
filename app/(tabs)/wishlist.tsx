import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../theme/useTheme";
import { products } from "../../constants/products";
import { getWishlist, saveWishlist } from "../../storage/storage";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 52) / 2;

export default function WishlistScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadWishlist();
    }, []),
  );

  const loadWishlist = async () => {
    const ids = await getWishlist();
    setWishlistIds(ids);
  };

  const removeFromWishlist = async (id: string) => {
    const updated = wishlistIds.filter((wid) => wid !== id);
    setWishlistIds(updated);
    await saveWishlist(updated);
  };

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Wishlist
        </Text>
        <Text
          style={[styles.headerCount, { color: theme.colors.textSecondary }]}
        >
          {wishlistIds.length} {wishlistIds.length === 1 ? "item" : "items"}
        </Text>
      </View>

      <FlatList
        data={wishlistProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
            onPress={() => router.push(`/product/${item.id}`)}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <Pressable
              style={[
                styles.heartBtn,
                { backgroundColor: theme.colors.background },
              ]}
              onPress={() => removeFromWishlist(item.id)}
            >
              <Ionicons name="heart" size={16} color={theme.colors.cta} />
            </Pressable>
            <View style={styles.cardInfo}>
              <Text
                style={[styles.brand, { color: theme.colors.textSecondary }]}
                numberOfLines={1}
              >
                {item.brand}
              </Text>
              <Text
                style={[styles.name, { color: theme.colors.primary }]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text style={[styles.price, { color: theme.colors.cta }]}>
                ${item.price.toFixed(2)}
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="heart-outline"
              size={56}
              color={theme.colors.textSecondary}
            />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              Your wishlist is empty
            </Text>
            <Text
              style={[styles.emptySub, { color: theme.colors.textSecondary }]}
            >
              Save your favorite scents for later
            </Text>
            <Pressable
              style={[styles.exploreBtn, { backgroundColor: theme.colors.cta }]}
              onPress={() => router.push("/discover")}
            >
              <Text style={styles.exploreBtnText}>Explore Scents</Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  headerTitle: { fontSize: 28, fontWeight: "600", letterSpacing: 0.5 },
  headerCount: { fontSize: 14, fontWeight: "400" },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  grid: { gap: 12, marginBottom: 12 },
  card: { flex: 1, borderRadius: 16, overflow: "hidden" },
  image: { width: "100%", height: CARD_WIDTH * 0.9 },
  heartBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: { padding: 12, gap: 2 },
  brand: {
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  name: { fontSize: 15, fontWeight: "600" },
  price: { fontSize: 16, fontWeight: "700", marginTop: 4 },
  empty: { alignItems: "center", paddingTop: 100, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "600", marginTop: 8 },
  emptySub: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  exploreBtn: {
    marginTop: 16,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 25,
  },
  exploreBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
});
