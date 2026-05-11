import Constants from "expo-constants";

const expoExtra = Constants.expoConfig?.extra as
  | { paystackPublicKey?: string }
  | undefined;

const paystackPublicKey =
  expoExtra?.paystackPublicKey ||
  process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY ||
  process.env.EXPO_PAYSTACK_PUBLIC_KEY ||
  "";

export const paystack = {
  publicKey: paystackPublicKey,
  currency: "GHS",
};

export const toPaystackSubunit = (amount: number) => Math.round(amount * 100);
