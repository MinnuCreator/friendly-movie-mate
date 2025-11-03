const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'your_tmdb_api_key_here';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  adult: boolean;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
}

export const tmdbApi = {
  // Get trending movies
  getTrending: async (): Promise<Movie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return data.results;
  },

  // Get popular movies
  getPopular: async (): Promise<Movie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return data.results;
  },

  // Get top rated movies
  getTopRated: async (): Promise<Movie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return data.results;
  },

  // Get upcoming movies
  getUpcoming: async (): Promise<Movie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return data.results;
  },

  // Search movies
  searchMovies: async (query: string): Promise<Movie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return data.results;
  },

  // Get movie details
  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`
    );
    return await response.json();
  },

  // Get movie recommendations
  getRecommendations: async (movieId: number): Promise<Movie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/recommendations?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return data.results;
  },

  // Get movies by genre
  getMoviesByGenre: async (genreId: number): Promise<Movie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}`
    );
    const data = await response.json();
    return data.results;
  },

  // Get genres
  getGenres: async () => {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`
    );
    const data = await response.json();
    return data.genres;
  }
};

export const getImageUrl = (path: string, size: 'w200' | 'w300' | 'w500' | 'original' = 'w500') => {
  if (!path) return '/placeholder.svg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const formatMovieData = (movie: Movie) => ({
  id: movie.id,
  title: movie.title,
  rating: movie.vote_average,
  year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A',
  genre: 'Movie', // We'll enhance this later with genre mapping
  imageUrl: getImageUrl(movie.poster_path),
  overview: movie.overview,
  releaseDate: movie.release_date,
  backdropUrl: getImageUrl(movie.backdrop_path, 'original'),
});
