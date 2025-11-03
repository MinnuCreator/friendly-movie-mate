import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Movie } from '@/lib/tmdb';

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

  // Load watchlist from localStorage for now (since we don't have the table set up)
  const loadWatchlist = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const stored = localStorage.getItem(`watchlist_${user.id}`);
      if (stored) {
        const movies: Movie[] = JSON.parse(stored);
        setWatchlist(movies);
      }
    } catch (error) {
      console.error('Error loading watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add movie to watchlist
  const addToWatchlist = async (movie: Movie) => {
    if (!user) return;

    try {
      const updatedWatchlist = [...watchlist, movie];
      setWatchlist(updatedWatchlist);
      localStorage.setItem(`watchlist_${user.id}`, JSON.stringify(updatedWatchlist));
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      throw error;
    }
  };

  // Remove movie from watchlist
  const removeFromWatchlist = async (movieId: number) => {
    if (!user) return;

    try {
      const updatedWatchlist = watchlist.filter(movie => movie.id !== movieId);
      setWatchlist(updatedWatchlist);
      localStorage.setItem(`watchlist_${user.id}`, JSON.stringify(updatedWatchlist));
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
