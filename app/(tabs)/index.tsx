import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ImageBackground,
  Dimensions,
  StyleSheet,
  Animated,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../theme/useTheme";
import { products, heroPhrases } from "../../constants/products";
import { getImageSource, images } from "../../constants/images";
import { formatCurrency, shop } from "../../constants/shop";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;
const SPACING = 16;

const TypingHeader = () => {
  const { theme } = useTheme();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const charIndex = useRef(0);

  useEffect(() => {
    const currentPhrase = heroPhrases[phraseIndex];

    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          if (charIndex.current < currentPhrase.length) {
            setDisplayText(currentPhrase.slice(0, charIndex.current + 1));
            charIndex.current += 1;
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (charIndex.current > 0) {
            setDisplayText(currentPhrase.slice(0, charIndex.current - 1));
            charIndex.current -= 1;
          } else {
            setIsDeleting(false);
            setPhraseIndex((prev) => (prev + 1) % heroPhrases.length);
          }
        }
      },
      isDeleting ? 40 : 80,
    );

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex]);

  return (
    <View style={styles.headerContainer}>
      <Text style={[styles.brandName, { color: theme.colors.accent }]}>
        {shop.name.toUpperCase()}
      </Text>
      <View style={styles.typingRow}>
        <Text style={[styles.typingText, { color: theme.colors.text }]}>
          {displayText}
        </Text>
        <View style={[styles.cursor, { backgroundColor: theme.colors.cta }]} />
      </View>
    </View>
  );
};

const MovingImageCards = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % products.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
        viewPosition: 0.5,
      });
      setCurrentIndex(nextIndex);
    }, 3500);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View style={styles.carouselContainer}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Featured Scents
        </Text>
        <Ionicons name="sparkles" size={18} color={theme.colors.cta} />
      </View>
      <Animated.FlatList
        ref={flatListRef}
        data={products}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + SPACING}
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * (CARD_WIDTH + SPACING),
            index * (CARD_WIDTH + SPACING),
            (index + 1) * (CARD_WIDTH + SPACING),
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.92, 1, 0.92],
            extrapolate: "clamp",
          });

          return (
            <Pressable
              onPress={() => router.push(`/product/${item.id}`)}
              style={{ width: CARD_WIDTH }}
            >
              <Animated.View
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.colors.surface,
                    transform: [{ scale }],
                  },
                ]}
              >
                <Image
                  source={getImageSource(item.image)}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.75)"]}
                  style={styles.cardGradient}
                >
                  <View style={styles.cardContent}>
                    <Text style={styles.cardBrand}>{item.brand}</Text>
                    <Text style={styles.cardName}>{item.name}</Text>
                    <View style={styles.cardRow}>
                      <Text style={styles.cardPrice}>
                        {formatCurrency(item.price)}
                      </Text>
                      <View
                        style={[
                          styles.categoryBadge,
                          { backgroundColor: theme.colors.cta },
                        ]}
                      >
                        <Text style={styles.categoryText}>{item.volume}ml</Text>
                      </View>
                    </View>
                    <View style={styles.notesRow}>
                      {item.notes
                        .slice(0, 3)
                        .map((note: string, i: number) => (
                          <View
                            key={i}
                            style={[
                              styles.noteBadge,
                              { borderColor: "rgba(255,255,255,0.4)" },
                            ]}
                          >
                            <Text style={styles.noteText}>{note}</Text>
                          </View>
                        ))}
                    </View>
                  </View>
                </LinearGradient>
              </Animated.View>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

const PromoBanners = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const banners = [
    {
      title: "Layered warmth",
      subtitle: "Oud, amber, sandalwood",
      image: images.banners.woody,
      target: "/discover" as const,
    },
    {
      title: "Soft florals",
      subtitle: "Rose, jasmine, peony",
      image: images.banners.floral,
      target: "/discover" as const,
    },
  ];

  return (
    <View style={styles.bannerSection}>
      {banners.map((banner) => (
        <Pressable
          key={banner.title}
          onPress={() => router.push(banner.target)}
          style={styles.bannerPressable}
        >
          <ImageBackground
            source={getImageSource(banner.image)}
            style={styles.bannerBg}
            imageStyle={styles.bannerImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.12)", "rgba(0,0,0,0.68)"]}
              style={styles.bannerOverlay}
            >
              <Text style={styles.bannerTitle}>{banner.title}</Text>
              <Text
                style={[
                  styles.bannerSubtitle,
                  { color: theme.colors.accent },
                ]}
              >
                {banner.subtitle}
              </Text>
            </LinearGradient>
          </ImageBackground>
        </Pressable>
      ))}
    </View>
  );
};

const CategoryPills = () => {
  const { theme } = useTheme();
  const categories = [
    { label: "Floral", icon: "flower-outline" as const },
    { label: "Woody", icon: "leaf-outline" as const },
    { label: "Fresh", icon: "water-outline" as const },
    { label: "Oriental", icon: "moon-outline" as const },
    { label: "Gourmand", icon: "flame-outline" as const },
  ];

  return (
    <View style={styles.categoriesContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Shop by Mood
      </Text>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContent}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.categoryPill,
              {
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Ionicons name={item.icon} size={18} color={theme.colors.accent} />
            <Text
              style={[
                styles.categoryLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default function HomeScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <TypingHeader />
            <MovingImageCards />
            <CategoryPills />
            <PromoBanners />
            <View style={styles.collectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                New Arrivals
              </Text>
              <Pressable onPress={() => router.push("/discover")}>
                <Text style={[styles.viewAll, { color: theme.colors.cta }]}>
                  View all
                </Text>
              </Pressable>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <Pressable
            style={[styles.gridCard, { backgroundColor: theme.colors.surface }]}
            onPress={() => router.push(`/product/${item.id}`)}
          >
            <Image
              source={getImageSource(item.image)}
              style={styles.gridImage}
              resizeMode="cover"
            />
            <View style={styles.gridContent}>
              <Text
                style={[
                  styles.gridBrand,
                  { color: theme.colors.textSecondary },
                ]}
                numberOfLines={1}
              >
                {item.brand}
              </Text>
              <Text
                style={[styles.gridName, { color: theme.colors.primary }]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text style={[styles.gridPrice, { color: theme.colors.cta }]}>
                {formatCurrency(item.price)}
              </Text>
            </View>
          </Pressable>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  brandName: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 6,
    marginBottom: 12,
  },
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 36,
  },
  typingText: {
    fontSize: 26,
    fontWeight: "300",
    letterSpacing: 0.5,
  },
  cursor: {
    width: 2,
    height: 26,
    marginLeft: 2,
    opacity: 0.8,
  },
  carouselContainer: {
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  carouselContent: {
    paddingHorizontal: (width - CARD_WIDTH) / 2,
    gap: SPACING,
  },
  card: {
    borderRadius: 24,
    overflow: "hidden",
    height: CARD_WIDTH * 1.25,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    padding: 20,
  },
  cardContent: {
    gap: 6,
  },
  cardBrand: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  cardName: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  cardPrice: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  notesRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  noteBadge: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  noteText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11,
    fontWeight: "400",
  },
  categoriesContainer: {
    paddingVertical: 12,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 12,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  bannerSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
  },
  bannerPressable: {
    height: 148,
    borderRadius: 18,
    overflow: "hidden",
  },
  bannerBg: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bannerImage: {
    borderRadius: 18,
  },
  bannerOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 18,
  },
  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },
  bannerSubtitle: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
    textTransform: "uppercase",
  },
  collectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "500",
  },
  gridRow: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 12,
  },
  gridCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  gridImage: {
    width: "100%",
    height: 160,
  },
  gridContent: {
    padding: 12,
    gap: 2,
  },
  gridBrand: {
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  gridName: {
    fontSize: 15,
    fontWeight: "600",
  },
  gridPrice: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 2,
  },
});
