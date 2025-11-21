import AsyncStorage from '@react-native-async-storage/async-storage';

const WATCHLIST_KEY = '@movie_app_watchlist';
const FAVORITES_KEY = '@movie_app_favorites';
const USER_RATINGS_KEY = '@movie_app_ratings';

export const getWatchlist = async (): Promise<SavedMovie[]> => {
  try {
    const watchlist = await AsyncStorage.getItem(WATCHLIST_KEY);
    return watchlist ? JSON.parse(watchlist) : [];
  } catch (error) {
    console.error('Error getting watchlist:', error);
    return [];
  }
};

export const addToWatchlist = async (movie: Movie | MovieDetails): Promise<void> => {
  try {
    const watchlist = await getWatchlist();
    const exists = watchlist.some(m => m.id === movie.id);
    
    if (!exists) {
      const savedMovie: SavedMovie = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path || '',
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        savedAt: new Date().toISOString(),
      };
      
      watchlist.push(savedMovie);
      await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
    }
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    throw error;
  }
};

export const removeFromWatchlist = async (movieId: number): Promise<void> => {
  try {
    const watchlist = await getWatchlist();
    const filtered = watchlist.filter(m => m.id !== movieId);
    await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    throw error;
  }
};

export const isInWatchlist = async (movieId: number): Promise<boolean> => {
  try {
    const watchlist = await getWatchlist();
    return watchlist.some(m => m.id === movieId);
  } catch (error) {
    console.error('Error checking watchlist:', error);
    return false;
  }
};

export const getFavorites = async (): Promise<SavedMovie[]> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const addToFavorites = async (movie: Movie | MovieDetails): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const exists = favorites.some(m => m.id === movie.id);
    
    if (!exists) {
      const savedMovie: SavedMovie = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path || '',
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        savedAt: new Date().toISOString(),
        isFavorite: true,
      };
      
      favorites.push(savedMovie);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const removeFromFavorites = async (movieId: number): Promise<void> => {
  try {
    const favorites = await getFavorites();
    const filtered = favorites.filter(m => m.id !== movieId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

export const isInFavorites = async (movieId: number): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.some(m => m.id === movieId);
  } catch (error) {
    console.error('Error checking favorites:', error);
    return false;
  }
};

export const saveUserRating = async (movieId: number, rating: number): Promise<void> => {
  try {
    const ratings = await AsyncStorage.getItem(USER_RATINGS_KEY);
    const parsedRatings = ratings ? JSON.parse(ratings) : {};
    parsedRatings[movieId] = rating;
    await AsyncStorage.setItem(USER_RATINGS_KEY, JSON.stringify(parsedRatings));
  } catch (error) {
    console.error('Error saving user rating:', error);
    throw error;
  }
};

export const getUserRating = async (movieId: number): Promise<number | null> => {
  try {
    const ratings = await AsyncStorage.getItem(USER_RATINGS_KEY);
    const parsedRatings = ratings ? JSON.parse(ratings) : {};
    return parsedRatings[movieId] || null;
  } catch (error) {
    console.error('Error getting user rating:', error);
    return null;
  }
};

export const getUserRatings = async (): Promise<{[movieId: number]: number}> => {
  try {
    const ratings = await AsyncStorage.getItem(USER_RATINGS_KEY);
    return ratings ? JSON.parse(ratings) : {};
  } catch (error) {
    console.error('Error getting user ratings:', error);
    return {};
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([WATCHLIST_KEY, FAVORITES_KEY, USER_RATINGS_KEY]);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

