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
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/useTheme";
import { products } from "../constants/products";
import { getImageSource } from "../constants/images";
import { formatCurrency } from "../constants/shop";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 52) / 2;

export default function SearchScreen() {
  const { q } = useLocalSearchParams<{ q: string }>();
  const { theme } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState(q || "");
  const [results, setResults] = useState(
    q
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(q.toLowerCase()) ||
            p.brand.toLowerCase().includes(q.toLowerCase()) ||
            p.notes.some((n) => n.toLowerCase().includes(q.toLowerCase())),
        )
      : [],
  );

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.trim().length === 0) {
      setResults([]);
      return;
    }
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(text.toLowerCase()) ||
        p.brand.toLowerCase().includes(text.toLowerCase()) ||
        p.notes.some((n) => n.toLowerCase().includes(text.toLowerCase())) ||
        p.category.toLowerCase().includes(text.toLowerCase()),
    );
    setResults(filtered);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
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
            value={query}
            onChangeText={handleSearch}
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => handleSearch("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={theme.colors.textSecondary}
              />
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={results}
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
              source={getImageSource(item.image)}
              style={styles.image}
              resizeMode="cover"
            />
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
                {formatCurrency(item.price)}
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          query.length > 0 ? (
            <View style={styles.empty}>
              <Ionicons
                name="search-outline"
                size={48}
                color={theme.colors.textSecondary}
              />
              <Text
                style={[
                  styles.emptyText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                No results found for &quot;{query}&quot;
              </Text>
            </View>
          ) : (
            <View style={styles.empty}>
              <Ionicons
                name="search-outline"
                size={48}
                color={theme.colors.textSecondary}
              />
              <Text
                style={[
                  styles.emptyText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Search for your favorite scents
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15, fontWeight: "400" },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  grid: { gap: 12, marginBottom: 12 },
  card: { flex: 1, borderRadius: 16, overflow: "hidden" },
  image: { width: "100%", height: CARD_WIDTH * 0.9 },
  cardInfo: { padding: 12, gap: 2 },
  brand: {
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  name: { fontSize: 15, fontWeight: "600" },
  price: { fontSize: 16, fontWeight: "700", marginTop: 4 },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 15, fontWeight: "400", textAlign: "center" },
});
