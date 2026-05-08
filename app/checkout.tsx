import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  Linking,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/useTheme";
import { getCart, clearCart } from "../storage/storage";
import { CartItem } from "../types";
import { formatCurrency, shop } from "../constants/shop";

const DELIVERY_FEE = 25;
const FREE_DELIVERY_THRESHOLD = 300;

export default function CheckoutScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState(shop.location);
  const [note, setNote] = useState("");

  const loadCart = useCallback(async () => {
    const items = await getCart();
    if (items.length === 0) {
      router.back();
      return;
    }
    setCartItems(items);
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [loadCart]),
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  const buildWhatsAppMessage = () => {
    let message = `*New Order - ${shop.name}*\n\n`;
    message += `*Customer Details*\n`;
    message += `Name: ${name}\n`;
    message += `Phone: ${phone}\n`;
    message += `Address: ${address}\n`;
    if (note) message += `Note: ${note}\n`;
    message += `\n*Order Items*\n`;

    cartItems.forEach((item, i) => {
      message += `\n${i + 1}. ${item.product.name} (${item.product.volume}ml)`;
      message += `\n   Qty: ${item.quantity} x ${formatCurrency(item.product.price)}`;
      message += `\n   Subtotal: ${formatCurrency(item.product.price * item.quantity)}\n`;
    });

    message += `\n*Summary*\n`;
    message += `Subtotal: ${formatCurrency(subtotal)}\n`;
    if (delivery > 0) message += `Delivery: ${formatCurrency(delivery)}\n`;
    message += `*Total: ${formatCurrency(total)}*`;

    return message;
  };

  const handlePlaceOrder = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert(
        "Missing Info",
        "Please fill in your name, phone, and address.",
      );
      return;
    }

    const message = buildWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${shop.whatsappNumber}?text=${encoded}`;

    try {
      await Linking.openURL(url);
      await clearCart();
      router.replace("/cart");
    } catch {
      Alert.alert("Error", "Could not open WhatsApp. Please try again.");
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[styles.section, { backgroundColor: theme.colors.surface }]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Delivery Details
          </Text>

          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Full Name
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="Enter your full name"
            placeholderTextColor={theme.colors.textSecondary}
            value={name}
            onChangeText={setName}
          />

          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Phone Number
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="+233 XX XXX XXXX"
            placeholderTextColor={theme.colors.textSecondary}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Delivery Address
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="Enter your delivery address"
            placeholderTextColor={theme.colors.textSecondary}
            value={address}
            onChangeText={setAddress}
            multiline
          />

          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            Order Note (optional)
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="Any special instructions..."
            placeholderTextColor={theme.colors.textSecondary}
            value={note}
            onChangeText={setNote}
            multiline
          />
        </View>

        <View
          style={[styles.section, { backgroundColor: theme.colors.surface }]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Order Summary
          </Text>
          {cartItems.map((item) => (
            <View key={item.product.id} style={styles.summaryItem}>
              <View style={styles.summaryLeft}>
                <Text
                  style={[styles.summaryName, { color: theme.colors.primary }]}
                >
                  {item.product.name}
                </Text>
                <Text
                  style={[
                    styles.summaryQty,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {item.quantity} x {formatCurrency(item.product.price)}
                </Text>
              </View>
              <Text
                style={[styles.summaryPrice, { color: theme.colors.primary }]}
              >
                {formatCurrency(item.product.price * item.quantity)}
              </Text>
            </View>
          ))}

          <View
            style={[styles.divider, { backgroundColor: theme.colors.border }]}
          />

          <View style={styles.summaryRow}>
            <Text
              style={[
                styles.summaryLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              Subtotal
            </Text>
            <Text
              style={[styles.summaryValue, { color: theme.colors.primary }]}
            >
              {formatCurrency(subtotal)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text
              style={[
                styles.summaryLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              Delivery
            </Text>
            <Text
              style={[
                styles.summaryValue,
                { color: delivery === 0 ? "#4CAF50" : theme.colors.primary },
              ]}
            >
              {delivery === 0 ? "FREE" : formatCurrency(delivery)}
            </Text>
          </View>

          <View
            style={[styles.divider, { backgroundColor: theme.colors.border }]}
          />

          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: theme.colors.primary }]}>
              Total
            </Text>
            <Text style={[styles.totalValue, { color: theme.colors.cta }]}>
              {formatCurrency(total)}
            </Text>
          </View>
        </View>

        <View
          style={[styles.noteBox, { backgroundColor: theme.colors.primary }]}
        >
          <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
          <Text
            style={[styles.noteText, { color: theme.colors.textSecondary }]}
          >
            Your order will be sent via WhatsApp for confirmation and payment.
          </Text>
        </View>

        <View style={{ height: 40 }} />
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
        <Pressable
          style={[styles.orderBtn, { backgroundColor: theme.colors.cta }]}
          onPress={handlePlaceOrder}
        >
          <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
          <Text style={styles.orderBtnText}>Send Order via WhatsApp</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 8 },
  section: { borderRadius: 16, padding: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "500", marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: "400",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  summaryLeft: { flex: 1 },
  summaryName: { fontSize: 15, fontWeight: "500" },
  summaryQty: { fontSize: 13, fontWeight: "400", marginTop: 2 },
  summaryPrice: { fontSize: 15, fontWeight: "600" },
  divider: { height: 0.5, marginVertical: 14 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  summaryLabel: { fontSize: 14, fontWeight: "400" },
  summaryValue: { fontSize: 14, fontWeight: "500" },
  totalLabel: { fontSize: 17, fontWeight: "600" },
  totalValue: { fontSize: 20, fontWeight: "700" },
  noteBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
  },
  noteText: { flex: 1, fontSize: 13, fontWeight: "400", lineHeight: 18 },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 0.5,
  },
  orderBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 25,
  },
  orderBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});
