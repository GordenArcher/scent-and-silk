import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../theme/useTheme";
import { products, categories } from "../../constants/products";
import { getImageSource } from "../../constants/images";
import { formatCurrency } from "../../constants/shop";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 52) / 2;

export default function DiscoverScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.notes.some((note) =>
        note.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesCategory && matchesSearch;
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Discover
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Ionicons
            name="search"
            size={18}
            color={theme.colors.textSecondary}
          />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search scents, notes, brands..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={theme.colors.textSecondary}
              />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.categoriesWrapper}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
          renderItem={({ item }) => {
            const isActive = selectedCategory === item.value;
            return (
              <Pressable
                onPress={() => setSelectedCategory(item.value)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isActive
                      ? theme.colors.accent
                      : theme.colors.primary,
                    borderColor: isActive
                      ? theme.colors.accent
                      : theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    {
                      color: isActive
                        ? theme.colors.background
                        : theme.colors.textSecondary,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productGrid}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productList}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.productCard,
              { backgroundColor: theme.colors.surface },
            ]}
            onPress={() => router.push(`/product/${item.id}`)}
          >
            <Image
              source={getImageSource(item.image)}
              style={styles.productImage}
              resizeMode="cover"
            />
            <View style={styles.productInfo}>
              <Text
                style={[
                  styles.productBrand,
                  { color: theme.colors.textSecondary },
                ]}
                numberOfLines={1}
              >
                {item.brand}
              </Text>
              <Text
                style={[styles.productName, { color: theme.colors.primary }]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <View style={styles.productFooter}>
                <Text
                  style={[styles.productPrice, { color: theme.colors.cta }]}
                >
                  {formatCurrency(item.price)}
                </Text>
                <View
                  style={[
                    styles.volumeBadge,
                    { backgroundColor: theme.colors.background },
                  ]}
                >
                  <Text
                    style={[
                      styles.volumeText,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {item.volume}ml
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="search-outline"
              size={48}
              color={theme.colors.textSecondary}
            />
            <Text
              style={[styles.emptyText, { color: theme.colors.textSecondary }]}
            >
              No scents found
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "400",
  },
  categoriesWrapper: {
    paddingBottom: 8,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "500",
  },
  productList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  productGrid: {
    gap: 12,
    marginBottom: 12,
  },
  productCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: CARD_WIDTH * 0.9,
  },
  productInfo: {
    padding: 12,
    gap: 2,
  },
  productBrand: {
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
  },
  volumeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  volumeText: {
    fontSize: 11,
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "400",
  },
});
