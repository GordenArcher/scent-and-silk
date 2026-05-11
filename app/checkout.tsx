import { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Modal,
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  Linking,
} from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/useTheme";
import { getCart, clearCart } from "../storage/storage";
import { CartItem } from "../types";
import { formatCurrency, shop } from "../constants/shop";
import { paystack, toPaystackSubunit } from "../constants/paystack";

const DELIVERY_FEE = 25;
const FREE_DELIVERY_THRESHOLD = 300;

const generatePaymentReference = () =>
  `SHN-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function CheckoutScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState(shop.location);
  const [note, setNote] = useState("");
  const [paymentHtml, setPaymentHtml] = useState("");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const buildWhatsAppMessage = (paymentReference?: string) => {
    let message = `*New Order - ${shop.name}*\n\n`;
    message += `*Customer Details*\n`;
    message += `Name: ${name}\n`;
    message += `Email: ${email}\n`;
    message += `Phone: ${phone}\n`;
    message += `Address: ${address}\n`;
    if (note) message += `Note: ${note}\n`;
    if (paymentReference) {
      message += `Payment: Paid via Paystack\n`;
      message += `Paystack Reference: ${paymentReference}\n`;
    } else {
      message += `Payment: Pending confirmation\n`;
    }
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

  const validateDetails = (requiresEmail: boolean) => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert(
        "Missing Info",
        "Please fill in your name, phone, and address.",
      );
      return false;
    }

    if (requiresEmail && !email.trim()) {
      Alert.alert("Missing Email", "Please enter your email for Paystack.");
      return false;
    }

    return true;
  };

  const sendWhatsAppOrder = async (paymentReference?: string) => {
    const message = buildWhatsAppMessage(paymentReference);
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${shop.whatsappNumber}?text=${encoded}`;

    await Linking.openURL(url);
    await clearCart();
    router.replace("/cart");
  };

  const handlePlaceOrder = async () => {
    if (!validateDetails(false)) return;

    try {
      await sendWhatsAppOrder();
    } catch {
      Alert.alert("Error", "Could not open WhatsApp. Please try again.");
    }
  };

  const buildPaystackHtml = (reference: string) => {
    const paymentConfig = {
      key: paystack.publicKey,
      email: email.trim(),
      amount: toPaystackSubunit(total),
      currency: paystack.currency,
      ref: reference,
      firstname: name.trim().split(" ")[0] || name.trim(),
      phone: phone.trim(),
      channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
      metadata: {
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: name.trim(),
          },
          {
            display_name: "Phone",
            variable_name: "phone",
            value: phone.trim(),
          },
          {
            display_name: "Delivery Address",
            variable_name: "delivery_address",
            value: address.trim(),
          },
        ],
      },
    };

    return `
      <!doctype html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script src="https://js.paystack.co/v1/inline.js"></script>
          <style>
            html, body {
              align-items: center;
              background: #050505;
              color: #f7f2ea;
              display: flex;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
              height: 100%;
              justify-content: center;
              margin: 0;
              text-align: center;
            }
            p { color: #b9a98c; }
          </style>
        </head>
        <body>
          <main>
            <h3>Opening Paystack...</h3>
            <p>Please keep this screen open.</p>
          </main>
          <script>
            const postToApp = (payload) => {
              window.ReactNativeWebView.postMessage(JSON.stringify(payload));
            };

            let hasStarted = false;

            const startPayment = () => {
              if (hasStarted) return;
              hasStarted = true;

              try {
                if (!window.PaystackPop) {
                  hasStarted = false;
                  postToApp({
                    type: "error",
                    message: "Paystack checkout did not load. Please check your internet connection."
                  });
                  return;
                }

                const handler = window.PaystackPop.setup({
                  ...${JSON.stringify(paymentConfig)},
                  callback: (transaction) => {
                    postToApp({ type: "success", transaction });
                  },
                  onClose: () => {
                    postToApp({ type: "cancel" });
                  }
                });
                handler.openIframe();
              } catch (error) {
                postToApp({
                  type: "error",
                  message: error && error.message ? error.message : "Paystack could not start."
                });
              }
            };

            window.addEventListener("load", startPayment);
            setTimeout(startPayment, 1500);
          </script>
        </body>
      </html>
    `;
  };

  const handlePayWithPaystack = () => {
    if (!validateDetails(true)) return;

    if (!paystack.publicKey) {
      Alert.alert(
        "Paystack Key Missing",
        "Add EXPO_PAYSTACK_PUBLIC_KEY or EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY to your .env file.",
      );
      return;
    }

    const reference = generatePaymentReference();
    setPaymentHtml(buildPaystackHtml(reference));
    setIsPaymentOpen(true);
  };

  const handlePaystackMessage = async (event: WebViewMessageEvent) => {
    try {
      const payload = JSON.parse(event.nativeEvent.data);

      if (payload.type === "success") {
        const reference =
          payload.transaction?.reference || payload.transaction?.trxref;
        setIsSubmitting(true);
        setIsPaymentOpen(false);
        await sendWhatsAppOrder(reference);
        return;
      }

      if (payload.type === "cancel") {
        setIsPaymentOpen(false);
        Alert.alert("Payment Cancelled", "No payment was taken.");
        return;
      }

      if (payload.type === "error") {
        setIsPaymentOpen(false);
        Alert.alert("Payment Error", payload.message || "Paystack failed.");
      }
    } catch {
      setIsPaymentOpen(false);
      Alert.alert("Payment Error", "Could not read the Paystack response.");
    } finally {
      setIsSubmitting(false);
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
            Email Address
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
            placeholder="name@example.com"
            placeholderTextColor={theme.colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
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
          <Ionicons name="card-outline" size={20} color={theme.colors.cta} />
          <Text
            style={[styles.noteText, { color: theme.colors.textSecondary }]}
          >
            Pay securely with Paystack. After payment, the order details and
            reference will open in WhatsApp for confirmation.
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
          onPress={handlePayWithPaystack}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Ionicons name="card-outline" size={20} color="#FFFFFF" />
          )}
          <Text style={styles.orderBtnText}>Pay with Paystack</Text>
        </Pressable>
        <Pressable
          style={[styles.whatsappBtn, { borderColor: theme.colors.border }]}
          onPress={handlePlaceOrder}
          disabled={isSubmitting}
        >
          <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
          <Text style={[styles.whatsappBtnText, { color: theme.colors.text }]}>
            Send WhatsApp Order
          </Text>
        </Pressable>
      </View>

      <Modal
        visible={isPaymentOpen}
        animationType="slide"
        onRequestClose={() => setIsPaymentOpen(false)}
      >
        <View style={[styles.webviewHeader, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.webviewTitle, { color: theme.colors.text }]}>
            Paystack Checkout
          </Text>
          <Pressable onPress={() => setIsPaymentOpen(false)}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </Pressable>
        </View>
        {paymentHtml ? (
          <WebView
            originWhitelist={["*"]}
            source={{ html: paymentHtml, baseUrl: "https://checkout.paystack.com" }}
            javaScriptEnabled
            domStorageEnabled
            onMessage={handlePaystackMessage}
            startInLoadingState
          />
        ) : (
          <View style={styles.loadingPayment}>
            <ActivityIndicator color={theme.colors.cta} />
          </View>
        )}
      </Modal>
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
  whatsappBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
  },
  whatsappBtnText: { fontSize: 14, fontWeight: "600" },
  webviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 56,
    paddingBottom: 14,
  },
  webviewTitle: { fontSize: 17, fontWeight: "700" },
  loadingPayment: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
