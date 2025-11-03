import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Movie } from '@/lib/tmdb';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WatchlistContextType {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => Promise<void>;
  removeFromWatchlist: (movieId: number) => Promise<void>;
  isInWatchlist: (movieId: number) => boolean;
  loading: boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load watchlist from Supabase
  const loadWatchlist = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading watchlist:', error);
        toast({
          title: "Error",
          description: "Failed to load watchlist",
          variant: "destructive",
        });
        return;
      }

      // Convert database records to Movie objects
      const movies: Movie[] = data.map(item => ({
        id: item.movie_id,
        title: item.movie_title,
        poster_path: item.movie_poster_path || '',
        release_date: item.movie_release_date || '',
        vote_average: item.movie_vote_average || 0,
        overview: '', // We'll need to fetch this if needed
        genre_ids: [], // We'll need to fetch this if needed
        backdrop_path: '', // We'll need to fetch this if needed
        adult: false, // We'll need to fetch this if needed
      }));

      setWatchlist(movies);
    } catch (error) {
      console.error('Error loading watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to load watchlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add movie to watchlist
  const addToWatchlist = async (movie: Movie) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('watchlist')
        .insert({
          user_id: user.id,
          movie_id: movie.id,
          movie_title: movie.title,
          movie_poster_path: movie.poster_path,
          movie_release_date: movie.release_date,
          movie_vote_average: movie.vote_average,
        });

      if (error) {
        console.error('Error adding to watchlist:', error);
        toast({
          title: "Error",
          description: "Failed to add movie to watchlist",
          variant: "destructive",
        });
        throw error;
      }

      setWatchlist(prev => [...prev, movie]);
      toast({
        title: "Success",
        description: "Movie added to watchlist",
      });
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  };

  // Remove movie from watchlist
  const removeFromWatchlist = async (movieId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movieId);

      if (error) {
        console.error('Error removing from watchlist:', error);
        toast({
          title: "Error",
          description: "Failed to remove movie from watchlist",
          variant: "destructive",
        });
        throw error;
      }

      setWatchlist(prev => prev.filter(movie => movie.id !== movieId));
      toast({
        title: "Success",
        description: "Movie removed from watchlist",
      });
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      throw error;
    }
  };

  // Check if movie is in watchlist
  const isInWatchlist = (movieId: number) => {
    return watchlist.some(movie => movie.id === movieId);
  };

  useEffect(() => {
    if (user) {
      loadWatchlist();
    } else {
      setWatchlist([]);
    }
  }, [user]);

  const value: WatchlistContextType = {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    loading,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};
