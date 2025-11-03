import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { MovieCard } from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { tmdbApi, formatMovieData } from "@/lib/tmdb";

const Explore = () => {
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section') || 'trending-now';

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreData = await tmdbApi.getGenres();
        setGenres(genreData);
      } catch (error) {
        console.error('Error loading genres:', error);
      }
    };

    loadGenres();
  }, []);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        let movieData = [];

        if (searchQuery) {
          movieData = await tmdbApi.searchMovies(searchQuery);
        } else if (selectedGenre) {
          movieData = await tmdbApi.getMoviesByGenre(parseInt(selectedGenre));
        } else {
          switch (section) {
            case 'trending-now':
              movieData = await tmdbApi.getTrending();
              break;
            case 'coming-soon':
              movieData = await tmdbApi.getUpcoming();
              break;
            case 'popular':
              movieData = await tmdbApi.getPopular();
              break;
            case 'top-rated':
              movieData = await tmdbApi.getTopRated();
              break;
            default:
              movieData = await tmdbApi.getTrending();
          }
        }

        setMovies(movieData.map(formatMovieData));
      } catch (error) {
        console.error('Error loading movies:', error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [section, searchQuery, selectedGenre]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is triggered by useEffect when searchQuery changes
  };

  const getSectionTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (selectedGenre) {
      const genre = genres.find(g => g.id.toString() === selectedGenre);
      return `${genre?.name || 'Genre'} Movies`;
    }

    switch (section) {
      case 'trending-now': return 'Trending Movies';
      case 'coming-soon': return 'Coming Soon';
      case 'popular': return 'Popular Movies';
      case 'top-rated': return 'Top Rated Movies';
      default: return 'Explore Movies';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-6">{getSectionTitle()}</h1>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Genres</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id.toString()}>
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} {...movie} />
            ))}
          </div>
        )}

        {!loading && movies.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No movies found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
