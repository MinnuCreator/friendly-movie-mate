import { MovieCard } from "./MovieCard";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Movie {
  id: number;
  title: string;
  rating: number;
  year: string;
  genre: string;
  imageUrl: string;
}

interface MovieSectionProps {
  title: string;
  movies: Movie[];
}

export const MovieSection = ({ title, movies }: MovieSectionProps) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    // Navigate to explore page with the section type
    navigate(`/explore?section=${title.toLowerCase().replace(' ', '-')}`);
  };

  return (
    <section id={title.toLowerCase().replace(' ', '-').replace('now', 'section')} className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
          <button
            className="flex items-center gap-2 text-primary hover:gap-3 transition-all"
            onClick={handleViewAll}
          >
            View All
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      </div>
    </section>
  );
};
