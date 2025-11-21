import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback } from "react";

import { getWatchlist, getFavorites, getUserRating } from "@/services/storage";
import { icons } from "@/constants/icons";

const SavedMovieCard = ({ movie }: { movie: SavedMovie }) => {
  const router = useRouter();
  const [userRating, setUserRating] = useState<number | null>(null);

  useEffect(() => {
    loadUserRating();
  }, []);

  const loadUserRating = async () => {
    const rating = await getUserRating(movie.id);
    setUserRating(rating);
  };
  
  return (
    <TouchableOpacity
      onPress={() => router.push(`/movie/${movie.id}`)}
      className="flex-row bg-dark-100 rounded-lg p-3 mb-3"
    >
      <Image
        source={{
          uri: movie.poster_path
            ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
            : "https://via.placeholder.com/200x300.png?text=No+Image",
        }}
        className="w-20 h-28 rounded-lg mr-3"
        resizeMode="cover"
      />
      <View className="flex-1 justify-center">
        <Text className="text-white font-semibold text-base mb-1" numberOfLines={2}>
          {movie.title}
        </Text>
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center">
            <Image source={icons.star} className="w-3 h-3 mr-1" />
            <Text className="text-light-200 text-sm">
              {movie.vote_average.toFixed(1)}
            </Text>
          </View>
          <Text className="text-light-200 text-sm">
            • {movie.release_date?.split("-")[0] || "N/A"}
          </Text>
        </View>
        {userRating && (
          <Text className="text-accent text-sm mt-1">
            Your rating: {userRating}/10
          </Text>
        )}
        {movie.isFavorite && (
          <Text className="text-red-500 text-sm mt-1">❤️ Favorite</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const Save = () => {
  const [activeTab, setActiveTab] = useState<"watchlist" | "favorites">("watchlist");
  const [watchlist, setWatchlist] = useState<SavedMovie[]>([]);
  const [favorites, setFavorites] = useState<SavedMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadSavedMovies();
    }, [])
  );

  const loadSavedMovies = async () => {
    setLoading(true);
    try {
      const [watchlistData, favoritesData] = await Promise.all([
        getWatchlist(),
        getFavorites(),
      ]);
      setWatchlist(watchlistData);
      setFavorites(favoritesData);
    } catch (error) {
      console.error("Error loading saved movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentList = activeTab === "watchlist" ? watchlist : favorites;

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <View className="px-5 pt-5 flex-1">
        <Text className="text-white text-2xl font-bold mb-5">My Movies</Text>
        
        {/* Tab Selector */}
        <View className="flex-row bg-dark-100 rounded-lg p-1 mb-5">
          <TouchableOpacity
            onPress={() => setActiveTab("watchlist")}
            className={`flex-1 py-2 rounded-lg ${
              activeTab === "watchlist" ? "bg-accent" : ""
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "watchlist" ? "text-white" : "text-light-200"
              }`}
            >
              Watchlist ({watchlist.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("favorites")}
            className={`flex-1 py-2 rounded-lg ${
              activeTab === "favorites" ? "bg-accent" : ""
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "favorites" ? "text-white" : "text-light-200"
              }`}
            >
              Favorites ({favorites.length})
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" className="mt-10" />
        ) : currentList.length === 0 ? (
          <View className="items-center justify-center mt-20">
            <Image source={icons.save} className="w-16 h-16 mb-4" style={{ tintColor: "#666" }} />
            <Text className="text-light-200 text-lg text-center">
              {activeTab === "watchlist"
                ? "Your watchlist is empty"
                : "You haven't added any favorites yet"}
            </Text>
            <Text className="text-light-200 text-sm text-center mt-2">
              {activeTab === "watchlist"
                ? "Browse movies and add them to your watchlist"
                : "Mark movies as favorites to see them here"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={currentList}
            renderItem={({ item }) => <SavedMovieCard movie={item} />}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Save;