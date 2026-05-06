import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "../theme/ThemeContext";
import { useTheme } from "../theme/useTheme";

const RootNavigator = () => {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar style={theme.colors.statusBar} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="product/[id]"
          options={{
            headerShown: true,
            headerTitle: "",
            headerBackTitle: "Back",
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.accent,
          }}
        />
        <Stack.Screen
          name="checkout"
          options={{
            headerShown: true,
            headerTitle: "Checkout",
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.accent,
            headerTitleStyle: { color: theme.colors.text },
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="search"
          options={{
            headerShown: true,
            headerTitle: "Search",
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.accent,
            headerTitleStyle: { color: theme.colors.text },
            presentation: "modal",
          }}
        />
      </Stack>
    </>
  );
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}
