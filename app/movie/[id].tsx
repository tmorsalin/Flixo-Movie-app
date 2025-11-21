import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

import { icons } from "@/constants/icons";
import useFetch from "@/services/usefetch";
import {
  fetchMovieDetails,
  fetchMovieCredits,
  fetchSimilarMovies,
  fetchMovieReviews,
} from "@/services/api";
import {
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
  addToFavorites,
  removeFromFavorites,
  isInFavorites,
  saveUserRating,
  getUserRating,
} from "@/services/storage";

import MovieCard from "@/components/MovieCard";
import CastCard from "@/components/CastCard";
import ReviewCard from "@/components/ReviewCard";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [isInWatchlistState, setIsInWatchlistState] = useState(false);
  const [isInFavoritesState, setIsInFavoritesState] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );
  
  const { data: credits } = useFetch(() => fetchMovieCredits(id as string));
  const { data: similarMovies } = useFetch(() =>
    fetchSimilarMovies(id as string)
  );
  const { data: reviews } = useFetch(() => fetchMovieReviews(id as string));

  useEffect(() => {
    if (movie) {
      checkMovieStatus();
    }
  }, [movie]);

  const checkMovieStatus = async () => {
    if (movie) {
      const watchlistStatus = await isInWatchlist(movie.id);
      const favoritesStatus = await isInFavorites(movie.id);
      const rating = await getUserRating(movie.id);
      
      setIsInWatchlistState(watchlistStatus);
      setIsInFavoritesState(favoritesStatus);
      setUserRating(rating);
    }
  };

  const toggleWatchlist = async () => {
    if (movie) {
      if (isInWatchlistState) {
        await removeFromWatchlist(movie.id);
      } else {
        await addToWatchlist(movie);
      }
      setIsInWatchlistState(!isInWatchlistState);
    }
  };

  const toggleFavorite = async () => {
    if (movie) {
      if (isInFavoritesState) {
        await removeFromFavorites(movie.id);
      } else {
        await addToFavorites(movie);
      }
      setIsInFavoritesState(!isInFavoritesState);
    }
  };

  const handleRating = async (rating: number) => {
    if (movie) {
      await saveUserRating(movie.id, rating);
      setUserRating(rating);
    }
  };

  const director = credits?.crew?.find(
    (person) => person.job === "Director"
  );

  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />

          <TouchableOpacity className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center">
            <Image
              source={icons.play}
              className="w-6 h-7 ml-1"
              resizeMode="stretch"
            />
          </TouchableOpacity>
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3 mt-4">
            <TouchableOpacity
              onPress={toggleWatchlist}
              className={`flex-1 py-2 px-3 rounded-lg flex-row justify-center items-center ${
                isInWatchlistState ? "bg-accent" : "bg-dark-100"
              }`}
            >
              <Image
                source={icons.save}
                className="w-4 h-4 mr-2"
                style={{ tintColor: "white" }}
              />
              <Text className="text-white font-semibold">
                {isInWatchlistState ? "In Watchlist" : "Add to Watchlist"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleFavorite}
              className={`px-4 py-2 rounded-lg ${
                isInFavoritesState ? "bg-red-600" : "bg-dark-100"
              }`}
            >
              <Text className="text-white text-lg">
                {isInFavoritesState ? "❤️" : "🤍"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                // Simple rating prompt
                const rating = prompt("Rate this movie (1-10):");
                if (rating && !isNaN(Number(rating))) {
                  const ratingNum = Math.min(10, Math.max(1, Number(rating)));
                  handleRating(ratingNum);
                }
              }}
              className="px-4 py-2 rounded-lg bg-dark-100"
            >
              <Text className="text-white font-semibold">
                {userRating ? `⭐ ${userRating}` : "Rate"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Your Rating Display */}
          {userRating && (
            <View className="bg-dark-100 p-2 rounded-lg mt-3 self-start">
              <Text className="text-white text-sm">
                Your Rating: ⭐ {userRating}/10
              </Text>
            </View>
          )}

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />
          {director && <MovieInfo label="Director" value={director.name} />}

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movie?.revenue ?? 0) / 1_000_000
              )} million`}
            />
          </View>

          {/* Cast Section */}
          {credits?.cast && credits.cast.length > 0 && (
            <View className="mt-6">
              <Text className="text-white font-bold text-lg mb-3">
                Cast & Crew
              </Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={credits.cast.slice(0, 10)}
                renderItem={({ item }) => <CastCard cast={item} />}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>
          )}

          {/* Reviews Section */}
          {reviews && reviews.length > 0 && (
            <View className="mt-6">
              <Text className="text-white font-bold text-lg mb-3">
                User Reviews ({reviews.length})
              </Text>
              {reviews.slice(0, 3).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </View>
          )}

          {/* Similar Movies */}
          {similarMovies && similarMovies.length > 0 && (
            <View className="mt-6">
              <Text className="text-white font-bold text-lg mb-3">
                Similar Movies
              </Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={similarMovies.slice(0, 10)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="mr-4"
                    onPress={() => router.push(`/movie/${item.id}`)}
                  >
                    <Image
                      source={{
                        uri: `https://image.tmdb.org/t/p/w200${item.poster_path}`,
                      }}
                      className="w-32 h-48 rounded-lg"
                      resizeMode="cover"
                    />
                    <View className="flex-row items-center mt-2">
                      <Image source={icons.star} className="size-3 mr-1" />
                      <Text className="text-white text-xs font-semibold">
                        {item.vote_average?.toFixed(1)}
                      </Text>
                    </View>
                    <Text className="text-white text-xs mt-1 w-32" numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text className="text-light-200 text-xs">
                      {item.release_date?.split("-")[0]}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>
          )}

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Details;