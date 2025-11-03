import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { MovieSection } from "@/components/MovieSection";
import { tmdbApi, formatMovieData } from "@/lib/tmdb";

const Index = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const [trending, upcoming] = await Promise.all([
          tmdbApi.getTrending(),
          tmdbApi.getUpcoming()
        ]);

        setTrendingMovies(trending.slice(0, 10).map(formatMovieData));
        setUpcomingMovies(upcoming.slice(0, 10).map(formatMovieData));
      } catch (error) {
        console.error('Error loading movies:', error);
        // Fallback to static data if API fails
        setTrendingMovies([
          {
            id: 1,
            title: "Apex Legends",
            rating: 8.5,
            year: "2024",
            genre: "Action",
            imageUrl: "/assets/movie-action.jpg",
          },
          {
            id: 2,
            title: "Forever Yours",
            rating: 7.8,
            year: "2024",
            genre: "Romance",
            imageUrl: "/assets/movie-romance.jpg",
          },
          {
            id: 3,
            title: "Neon Future",
            rating: 9.1,
            year: "2024",
            genre: "Sci-Fi",
            imageUrl: "/assets/movie-scifi.jpg",
          },
          {
            id: 4,
            title: "Laugh Out Loud",
            rating: 7.2,
            year: "2024",
            genre: "Comedy",
            imageUrl: "/assets/movie-comedy.jpg",
          },
          {
            id: 5,
            title: "Dark Shadows",
            rating: 8.3,
            year: "2024",
            genre: "Horror",
            imageUrl: "/assets/movie-horror.jpg",
          },
        ]);

        setUpcomingMovies([
          {
            id: 6,
            title: "Thunder Strike",
            rating: 8.7,
            year: "2025",
            genre: "Action",
            imageUrl: "/assets/movie-action.jpg",
          },
          {
            id: 7,
            title: "Heart of Gold",
            rating: 8.0,
            year: "2025",
            genre: "Romance",
            imageUrl: "/assets/movie-romance.jpg",
          },
          {
            id: 8,
            title: "Cosmic Voyage",
            rating: 9.3,
            year: "2025",
            genre: "Sci-Fi",
            imageUrl: "/assets/movie-scifi.jpg",
          },
          {
            id: 9,
            title: "Weekend Madness",
            rating: 7.5,
            year: "2025",
            genre: "Comedy",
            imageUrl: "/assets/movie-comedy.jpg",
          },
          {
            id: 10,
            title: "The Haunting",
            rating: 8.6,
            year: "2025",
            genre: "Horror",
            imageUrl: "/assets/movie-horror.jpg",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <MovieSection title="Trending Now" movies={trendingMovies} />
      <MovieSection title="Coming Soon" movies={upcomingMovies} />
    </div>
  );
};

export default Index;
