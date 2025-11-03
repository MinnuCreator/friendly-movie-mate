import { Navbar } from "@/components/Navbar";
import { MovieCard } from "@/components/MovieCard";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { formatMovieData } from "@/lib/tmdb";
import { Heart } from "lucide-react";

const Watchlist = () => {
  const { watchlist, loading } = useWatchlist();

  const formattedMovies = watchlist.map(movie => formatMovieData(movie));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-red-500 fill-current" />
          <h1 className="text-4xl font-bold">My Watchlist</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : formattedMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {formattedMovies.map((movie) => (
              <MovieCard key={movie.id} {...movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your watchlist is empty</h2>
            <p className="text-muted-foreground">
              Start adding movies to your watchlist by clicking the + button on movie cards.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
