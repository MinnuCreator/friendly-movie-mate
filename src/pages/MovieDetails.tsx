import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Calendar as CalendarIcon, Clock, DollarSign, MapPin, Car, Utensils, Ticket } from "lucide-react";
import { tmdbApi, getImageUrl } from "@/lib/tmdb";
import type { MovieDetails as TMDBMovieDetails } from "@/lib/tmdb";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [movie, setMovie] = useState<TMDBMovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);

  // Booking form states
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState("");
  const [snacks, setSnacks] = useState<string[]>([]);
  const [cabBooking, setCabBooking] = useState(false);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");

  const snackOptions = [
    { id: "popcorn", name: "Popcorn", price: 5 },
    { id: "soda", name: "Soda", price: 3 },
    { id: "nachos", name: "Nachos", price: 7 },
    { id: "candy", name: "Candy", price: 4 },
  ];

  useEffect(() => {
    const loadMovieDetails = async () => {
      if (!id) return;

      try {
        const movieData = await tmdbApi.getMovieDetails(parseInt(id));
        setMovie(movieData);
      } catch (error) {
        console.error('Error loading movie details:', error);
        toast({
          title: "Error",
          description: "Failed to load movie details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMovieDetails();
  }, [id, toast]);

  const handleSnackToggle = (snackId: string) => {
    setSnacks(prev =>
      prev.includes(snackId)
        ? prev.filter(s => s !== snackId)
        : [...prev, snackId]
    );
  };

  const calculateTotal = () => {
    const ticketPrice = 12; // Base ticket price
    const snackTotal = snacks.reduce((total, snackId) => {
      const snack = snackOptions.find(s => s.id === snackId);
      return total + (snack?.price || 0);
    }, 0);
    const cabPrice = cabBooking ? 15 : 0; // Cab booking price
    return ticketPrice + snackTotal + cabPrice;
  };

  const handleBooking = () => {
    if (bookingStep < 4) {
      setBookingStep(bookingStep + 1);
    } else {
      // Complete booking
      toast({
        title: "Booking Confirmed!",
        description: `Your tickets for ${movie?.title} have been booked successfully.`,
      });
      setBookingOpen(false);
      setBookingStep(1);
      // Reset form
      setSelectedDate(undefined);
      setSelectedTime("");
      setSelectedSeats("");
      setSnacks([]);
      setCabBooking(false);
      setPickupAddress("");
      setDropAddress("");
    }
  };

  const canProceedToNextStep = () => {
    switch (bookingStep) {
      case 1: return selectedDate && selectedTime;
      case 2: return selectedSeats;
      case 3: return true; // Snacks are optional
      case 4: return !cabBooking || (pickupAddress && dropAddress);
      default: return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'original')})` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <img
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              className="w-64 rounded-lg shadow-2xl"
            />
            <div className="text-white max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                </div>
                <span>{new Date(movie.release_date).getFullYear()}</span>
                <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map(genre => (
                  <Badge key={genre.id} variant="secondary">{genre.name}</Badge>
                ))}
              </div>
              <p className="text-lg mb-6">{movie.overview}</p>
              <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <Ticket className="w-5 h-5 mr-2" />
                    Book Tickets
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {bookingStep === 1 && "Select Date & Time"}
                      {bookingStep === 2 && "Choose Seats"}
                      {bookingStep === 3 && "Order Snacks"}
                      {bookingStep === 4 && "Cab Booking"}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    {bookingStep === 1 && (
                      <div className="space-y-4">
                        <div>
                          <Label>Select Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start">
                                <CalendarIcon className="w-4 h-4 mr-2" />
                                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <Label>Show Time</Label>
                          <Select value={selectedTime} onValueChange={setSelectedTime}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10:00">10:00 AM</SelectItem>
                              <SelectItem value="13:00">1:00 PM</SelectItem>
                              <SelectItem value="16:00">4:00 PM</SelectItem>
                              <SelectItem value="19:00">7:00 PM</SelectItem>
                              <SelectItem value="22:00">10:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {bookingStep === 2 && (
                      <div>
                        <Label>Number of Seats</Label>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={selectedSeats}
                          onChange={(e) => setSelectedSeats(e.target.value)}
                          placeholder="Enter number of seats"
                        />
                      </div>
                    )}

                    {bookingStep === 3 && (
                      <div className="space-y-3">
                        <Label>Snacks (Optional)</Label>
                        {snackOptions.map(snack => (
                          <div key={snack.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={snack.id}
                                checked={snacks.includes(snack.id)}
                                onCheckedChange={() => handleSnackToggle(snack.id)}
                              />
                              <Label htmlFor={snack.id}>{snack.name}</Label>
                            </div>
                            <span className="text-sm text-muted-foreground">${snack.price}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {bookingStep === 4 && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="cab"
                            checked={cabBooking}
                            onCheckedChange={setCabBooking}
                          />
                          <Label htmlFor="cab">Book Cab Service ($15)</Label>
                        </div>
                        {cabBooking && (
                          <>
                            <div>
                              <Label>Pickup Address</Label>
                              <Textarea
                                value={pickupAddress}
                                onChange={(e) => setPickupAddress(e.target.value)}
                                placeholder="Enter pickup address"
                              />
                            </div>
                            <div>
                              <Label>Drop Address</Label>
                              <Textarea
                                value={dropAddress}
                                onChange={(e) => setDropAddress(e.target.value)}
                                placeholder="Enter drop address (theatre)"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {bookingStep === 4 && (
                      <Card>
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Tickets ({selectedSeats} × $12)</span>
                              <span>${parseInt(selectedSeats || '0') * 12}</span>
                            </div>
                            {snacks.length > 0 && (
                              <div className="flex justify-between">
                                <span>Snacks</span>
                                <span>${snacks.reduce((total, snackId) => {
                                  const snack = snackOptions.find(s => s.id === snackId);
                                  return total + (snack?.price || 0);
                                }, 0)}</span>
                              </div>
                            )}
                            {cabBooking && (
                              <div className="flex justify-between">
                                <span>Cab Service</span>
                                <span>$15</span>
                              </div>
                            )}
                            <div className="border-t pt-2 flex justify-between font-semibold">
                              <span>Total</span>
                              <span>${calculateTotal()}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="flex gap-2">
                      {bookingStep > 1 && (
                        <Button variant="outline" onClick={() => setBookingStep(bookingStep - 1)}>
                          Back
                        </Button>
                      )}
                      <Button
                        onClick={handleBooking}
                        disabled={!canProceedToNextStep()}
                        className="flex-1"
                      >
                        {bookingStep === 4 ? "Confirm Booking" : "Next"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${movie.budget.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${movie.revenue.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Runtime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
