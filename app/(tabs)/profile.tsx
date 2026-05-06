import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Switch,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useTheme } from "../../theme/useTheme";
import { ThemeName } from "../../types";

export default function ProfileScreen() {
  const { theme, themeName, setTheme, themeLabels, allThemes } = useTheme();

  const themeIcons: Record<ThemeName, keyof typeof Ionicons.glyphMap> = {
    aubergine: "water",
    rose: "flower-outline",
    midnight: "moon",
    sandalwood: "sunny",
    jasmine: "leaf",
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Profile
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[styles.section, { backgroundColor: theme.colors.surface }]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Choose Theme
          </Text>
          <Text
            style={[styles.sectionSub, { color: theme.colors.textSecondary }]}
          >
            Pick your vibe. Changes apply instantly.
          </Text>
        </View>

        <View style={styles.themeGrid}>
          {allThemes.map((name) => {
            const isActive = themeName === name;
            return (
              <Pressable
                key={name}
                style={[
                  styles.themeCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: isActive
                      ? theme.colors.accent
                      : theme.colors.border,
                    borderWidth: isActive ? 2 : 1,
                  },
                ]}
                onPress={() => setTheme(name)}
              >
                <Ionicons
                  name={themeIcons[name]}
                  size={24}
                  color={
                    isActive ? theme.colors.accent : theme.colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.themeName,
                    {
                      color: isActive
                        ? theme.colors.text
                        : theme.colors.textSecondary,
                      fontWeight: isActive ? "600" : "400",
                    },
                  ]}
                >
                  {themeLabels[name]}
                </Text>
                {isActive && (
                  <View
                    style={[
                      styles.activeDot,
                      { backgroundColor: theme.colors.accent },
                    ]}
                  />
                )}
              </Pressable>
            );
          })}
        </View>

        <View
          style={[styles.section, { backgroundColor: theme.colors.surface }]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Settings
          </Text>
        </View>

        <View
          style={[styles.menuCard, { backgroundColor: theme.colors.surface }]}
        >
          <Pressable style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Feather
                name="package"
                size={20}
                color={theme.colors.textSecondary}
              />
              <Text style={[styles.menuLabel, { color: theme.colors.primary }]}>
                My Orders
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.colors.textSecondary}
            />
          </Pressable>

          <View
            style={[styles.divider, { backgroundColor: theme.colors.border }]}
          />

          <Pressable style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Feather
                name="map-pin"
                size={20}
                color={theme.colors.textSecondary}
              />
              <Text style={[styles.menuLabel, { color: theme.colors.primary }]}>
                Shipping Address
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.colors.textSecondary}
            />
          </Pressable>

          <View
            style={[styles.divider, { backgroundColor: theme.colors.border }]}
          />

          <Pressable style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Feather
                name="bell"
                size={20}
                color={theme.colors.textSecondary}
              />
              <Text style={[styles.menuLabel, { color: theme.colors.primary }]}>
                Notifications
              </Text>
            </View>
            <Switch
              value={true}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.accent,
              }}
              thumbColor={theme.colors.surface}
            />
          </Pressable>
        </View>

        <View
          style={[styles.menuCard, { backgroundColor: theme.colors.surface }]}
        >
          <Pressable style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Feather
                name="info"
                size={20}
                color={theme.colors.textSecondary}
              />
              <Text style={[styles.menuLabel, { color: theme.colors.primary }]}>
                About
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.colors.textSecondary}
            />
          </Pressable>

          <View
            style={[styles.divider, { backgroundColor: theme.colors.border }]}
          />

          <Pressable style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Feather
                name="help-circle"
                size={20}
                color={theme.colors.textSecondary}
              />
              <Text style={[styles.menuLabel, { color: theme.colors.primary }]}>
                Help & Support
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.colors.textSecondary}
            />
          </Pressable>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 28, fontWeight: "600", letterSpacing: 0.5 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },
  section: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  sectionSub: { fontSize: 13, fontWeight: "400", lineHeight: 18 },
  themeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  themeCard: {
    width: "47%",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    gap: 10,
    position: "relative",
  },
  themeName: { fontSize: 13, textAlign: "center" },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: "absolute",
    top: 10,
    right: 10,
  },
  menuCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  menuLabel: { fontSize: 15, fontWeight: "500" },
  divider: { height: 0.5, marginLeft: 54 },
});
