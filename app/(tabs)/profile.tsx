import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Switch,
  ImageBackground,
  Linking,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../../theme/useTheme";
import { ThemeName } from "../../types";
import { getImageSource, images } from "../../constants/images";
import { shop } from "../../constants/shop";

export default function ProfileScreen() {
  const { theme, themeName, setTheme, themeLabels, allThemes } = useTheme();

  const themeIcons: Record<ThemeName, keyof typeof Ionicons.glyphMap> = {
    noir: "contrast",
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ImageBackground
          source={getImageSource(images.banners.woody)}
          style={styles.hero}
          imageStyle={styles.heroImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.08)", "rgba(0,0,0,0.84)"]}
            style={styles.heroOverlay}
          >
            <Text style={styles.heroKicker}>Welcome to</Text>
            <Text style={styles.heroTitle}>{shop.name}</Text>
            <Text style={styles.heroCopy}>{shop.description}</Text>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.quickGrid}>
          <Pressable
            style={[styles.quickTile, { backgroundColor: theme.colors.surface }]}
            onPress={() => Linking.openURL(`https://wa.me/${shop.whatsappNumber}`)}
          >
            <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
            <Text style={[styles.quickTitle, { color: theme.colors.primary }]}>
              WhatsApp
            </Text>
            <Text
              style={[styles.quickValue, { color: theme.colors.textSecondary }]}
              numberOfLines={1}
            >
              {shop.phoneDisplay}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.quickTile, { backgroundColor: theme.colors.surface }]}
            onPress={() =>
              Linking.openURL(
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  shop.location,
                )}`,
              )
            }
          >
            <Feather name="map-pin" size={22} color={theme.colors.cta} />
            <Text style={[styles.quickTitle, { color: theme.colors.primary }]}>
              Location
            </Text>
            <Text
              style={[styles.quickValue, { color: theme.colors.textSecondary }]}
              numberOfLines={1}
            >
              {shop.location}
            </Text>
          </Pressable>
        </View>

        <View
          style={[styles.section, { backgroundColor: theme.colors.surface }]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            Store Mood
          </Text>
          <Text
            style={[styles.sectionSub, { color: theme.colors.textSecondary }]}
          >
            Switch the app look. Naadu Noir adds the black palette.
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
            Shop Details
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
                WhatsApp Orders
              </Text>
            </View>
            <Ionicons
              name="logo-whatsapp"
              size={18}
              color="#25D366"
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
                Pickup / Delivery Area
              </Text>
            </View>
            <Text style={[styles.menuMeta, { color: theme.colors.textSecondary }]}>
              {shop.location}
            </Text>
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
                Order Updates
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
                About {shop.shortName}
              </Text>
            </View>
            <Text style={[styles.menuMeta, { color: theme.colors.textSecondary }]}>
              Beauty shelf
            </Text>
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
                Call or Message
              </Text>
            </View>
            <Text style={[styles.menuMeta, { color: theme.colors.textSecondary }]}>
              {shop.phoneDisplay}
            </Text>
          </Pressable>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 60 },
  hero: {
    height: 250,
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 14,
  },
  heroImage: {
    borderRadius: 22,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },
  heroKicker: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 34,
    marginTop: 4,
  },
  heroCopy: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 19,
    marginTop: 10,
  },
  quickGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  quickTile: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    gap: 5,
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  quickValue: {
    fontSize: 12,
    fontWeight: "500",
  },
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
    flex: 1,
  },
  menuLabel: { fontSize: 15, fontWeight: "500" },
  menuMeta: { fontSize: 12, fontWeight: "500", maxWidth: 130 },
  divider: { height: 0.5, marginLeft: 54 },
});
