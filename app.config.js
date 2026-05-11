const appJson = require("./app.json");

module.exports = {
  ...appJson.expo,
  extra: {
    ...appJson.expo.extra,
    paystackPublicKey:
      process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY ||
      process.env.EXPO_PAYSTACK_PUBLIC_KEY ||
      "",
  },
};
