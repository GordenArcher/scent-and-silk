import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../theme/useTheme";
import { getCart, saveCart, clearCart } from "../../storage/storage";
import { CartItem } from "../../types";

export default function CartScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, []),
  );

  const loadCart = async () => {
    const items = await getCart();
    setCartItems(items);
  };

  const updateQuantity = async (productId: string, delta: number) => {
    const updated = cartItems
      .map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item,
      )
      .filter((item) => item.quantity > 0);
    setCartItems(updated);
    await saveCart(updated);
  };

  const removeItem = async (productId: string) => {
    const updated = cartItems.filter((item) => item.product.id !== productId);
    setCartItems(updated);
    await saveCart(updated);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    router.push("/checkout");
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Cart
        </Text>
        <Text
          style={[styles.headerCount, { color: theme.colors.textSecondary }]}
        >
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
        </Text>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.product.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View
            style={[styles.cartItem, { backgroundColor: theme.colors.surface }]}
          >
            <Image
              source={{ uri: item.product.image }}
              style={styles.itemImage}
              resizeMode="cover"
            />
            <View style={styles.itemInfo}>
              <Text
                style={[
                  styles.itemBrand,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {item.product.brand}
              </Text>
              <Text style={[styles.itemName, { color: theme.colors.primary }]}>
                {item.product.name}
              </Text>
              <Text
                style={[
                  styles.itemVolume,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {item.product.volume}ml
              </Text>
              <Text style={[styles.itemPrice, { color: theme.colors.cta }]}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </Text>
            </View>
            <View style={styles.quantityControls}>
              <Pressable
                style={[styles.qtyBtn, { borderColor: theme.colors.border }]}
                onPress={() => updateQuantity(item.product.id, -1)}
              >
                <Ionicons name="remove" size={16} color={theme.colors.text} />
              </Pressable>
              <Text style={[styles.qtyText, { color: theme.colors.text }]}>
                {item.quantity}
              </Text>
              <Pressable
                style={[styles.qtyBtn, { borderColor: theme.colors.border }]}
                onPress={() => updateQuantity(item.product.id, 1)}
              >
                <Ionicons name="add" size={16} color={theme.colors.text} />
              </Pressable>
              <Pressable
                style={styles.deleteBtn}
                onPress={() => removeItem(item.product.id)}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={theme.colors.textSecondary}
                />
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="bag-outline"
              size={56}
              color={theme.colors.textSecondary}
            />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              Your cart is empty
            </Text>
            <Text
              style={[styles.emptySub, { color: theme.colors.textSecondary }]}
            >
              Add some scents to get started
            </Text>
            <Pressable
              style={[styles.exploreBtn, { backgroundColor: theme.colors.cta }]}
              onPress={() => router.push("/discover")}
            >
              <Text style={styles.exploreBtnText}>Shop Now</Text>
            </Pressable>
          </View>
        }
      />

      {cartItems.length > 0 && (
        <View
          style={[
            styles.footer,
            {
              backgroundColor: theme.colors.primary,
              borderTopColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.footerRow}>
            <Text
              style={[styles.totalLabel, { color: theme.colors.textSecondary }]}
            >
              Subtotal
            </Text>
            <Text style={[styles.totalAmount, { color: theme.colors.text }]}>
              ${subtotal.toFixed(2)}
            </Text>
          </View>
          <Pressable
            style={[styles.checkoutBtn, { backgroundColor: theme.colors.cta }]}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      )}
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
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  cartItem: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    gap: 12,
  },
  itemImage: { width: 80, height: 80, borderRadius: 12 },
  itemInfo: { flex: 1, gap: 2, justifyContent: "center" },
  itemBrand: {
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  itemName: { fontSize: 16, fontWeight: "600" },
  itemVolume: { fontSize: 12, fontWeight: "400" },
  itemPrice: { fontSize: 17, fontWeight: "700", marginTop: 4 },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: 15,
    fontWeight: "600",
    minWidth: 20,
    textAlign: "center",
  },
  deleteBtn: { marginLeft: 8 },
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
  footer: {
    borderTopWidth: 0.5,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    gap: 12,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 15, fontWeight: "400" },
  totalAmount: { fontSize: 22, fontWeight: "700" },
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 25,
  },
  checkoutText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});
