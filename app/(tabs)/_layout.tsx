import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../theme/useTheme";

const TabIcon = ({
  icon,
  label,
  focused,
  color,
}: {
  icon: any;
  label: string;
  focused: boolean;
  color: string;
}) => (
  <View style={styles.tabIcon}>
    {icon}
    <Text style={[styles.tabLabel, { color, opacity: focused ? 1 : 0.5 }]}>
      {label}
    </Text>
  </View>
);

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar,
          borderTopColor: theme.colors.border,
          borderTopWidth: 0.5,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              label="Home"
              icon={
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={22}
                  color={color}
                />
              }
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              label="Discover"
              icon={<Feather name="compass" size={22} color={color} />}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              label="Wishlist"
              icon={
                <Ionicons
                  name={focused ? "heart" : "heart-outline"}
                  size={22}
                  color={color}
                />
              }
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              label="Cart"
              icon={<Feather name="shopping-bag" size={22} color={color} />}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              label="Profile"
              icon={<MaterialIcons name="palette" size={22} color={color} />}
              focused={focused}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
});
