import { Star, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { useToast } from "@/hooks/use-toast";
import { Movie } from "@/lib/tmdb";
import { useNavigate } from "react-router-dom";

interface MovieCardProps {
  title: string;
  rating: number;
  year: string;
  genre: string;
  imageUrl: string;
  id?: number;
}

export const MovieCard = ({ title, rating, year, genre, imageUrl, id }: MovieCardProps) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!id) return;

    try {
      const movie: Movie = {
        id,
        title,
        overview: '',
        poster_path: imageUrl,
        backdrop_path: '',
        release_date: year,
        vote_average: rating,
        genre_ids: [],
        adult: false,
      };

      if (isInWatchlist(id)) {
        await removeFromWatchlist(id);
        toast({
          title: "Removed from watchlist",
          description: `${title} has been removed from your watchlist.`,
        });
      } else {
        await addToWatchlist(movie);
        toast({
          title: "Added to watchlist",
          description: `${title} has been added to your watchlist.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update watchlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCardClick = () => {
    if (id) {
      navigate(`/movie/${id}`);
    }
  };

  return (
    <Card 
      className="group overflow-hidden bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow hover:scale-105 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <Button
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-primary"
          onClick={handleWatchlistToggle}
        >
          {isInWatchlist(id || 0) ? (
            <Check className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </Button>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{title}</h3>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{year} • {genre}</span>
          <div className="flex items-center gap-1 text-accent">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-medium">{rating}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
