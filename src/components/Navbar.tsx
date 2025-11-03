import { Film, Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Film className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              Movie Mate
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#discover" className="text-foreground/80 hover:text-foreground transition-colors">
              Discover
            </a>
            <a href="#trending" className="text-foreground/80 hover:text-foreground transition-colors">
              Trending
            </a>
            <a href="#watchlist" className="text-foreground/80 hover:text-foreground transition-colors">
              My Watchlist
            </a>
          </div>

          <div className="flex items-center gap-4">
            {searchOpen ? (
              <div className="w-64 transition-all">
                <Input
                  placeholder="Search movies..."
                  className="bg-secondary border-border"
                  onBlur={() => setSearchOpen(false)}
                  autoFocus
                />
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="w-5 h-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
