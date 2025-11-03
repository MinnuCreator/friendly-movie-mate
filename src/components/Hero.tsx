import { Button } from "@/components/ui/button";
import { Play, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  const handleExploreMovies = () => {
    // Scroll to the trending movies section
    const trendingSection = document.getElementById('trending-section');
    if (trendingSection) {
      trendingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMyWatchlist = () => {
    // Navigate to watchlist page (we'll create this later)
    navigate('/watchlist');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center mt-16">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in">
          Your Perfect
          <span className="block bg-gradient-accent bg-clip-text text-transparent">
            Movie Companion
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto">
          Discover, plan, and enjoy movies like never before. From booking tickets to
          ordering snacks, we've got your entire movie experience covered.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-gradient-accent text-foreground font-semibold px-8 py-6 text-lg shadow-glow hover:scale-105 transition-transform"
            onClick={handleExploreMovies}
          >
            <Play className="w-5 h-5 mr-2" />
            Explore Movies
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg"
            onClick={handleMyWatchlist}
          >
            <Plus className="w-5 h-5 mr-2" />
            My Watchlist
          </Button>
        </div>
      </div>
    </section>
  );
};
