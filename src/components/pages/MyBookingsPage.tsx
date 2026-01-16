import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Bed, 
  User, 
  Phone, 
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface Booking {
  _id: string;
  patientName?: string;
  patientEmail?: string;
  patientContactNumber?: string;
  bedIdentifier?: string;
  bookingStartDate?: Date | string;
  bookingEndDate?: Date | string;
  bookingStatus?: string;
  _createdDate?: Date;
}

interface HospitalBeds {
  _id: string;
  bedNumber?: string;
  department?: string;
  roomType?: string;
  hospitalId?: string;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [beds, setBeds] = useState<HospitalBeds[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [bookingsResult, bedsResult] = await Promise.all([
        BaseCrudService.getAll<Booking>('bookings'),
        BaseCrudService.getAll<HospitalBeds>('hospitalbeds')
      ]);
      setBookings(bookingsResult.items);
      setBeds(bedsResult.items);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBedInfo = (bedId?: string) => {
    return beds.find(bed => bed._id === bedId);
  };

  const handleCancelBooking = async (bookingId: string, bedId?: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      // Update booking status
      await BaseCrudService.update('bookings', {
        _id: bookingId,
        bookingStatus: 'cancelled'
      });

      // Make bed available again
      if (bedId) {
        await BaseCrudService.update('hospitalbeds', {
          _id: bedId,
          isAvailable: true,
          status: 'available'
        });
      }

      // Reload data
      loadData();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-available-green" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-alert-red" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-warning-yellow" />;
      default:
        return <AlertCircle className="w-5 h-5 text-neutral-gray" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-available-green/10 text-available-green border-available-green/20';
      case 'cancelled':
        return 'bg-alert-red/10 text-alert-red border-alert-red/20';
      case 'pending':
        return 'bg-warning-yellow/10 text-warning-yellow border-warning-yellow/20';
      default:
        return 'bg-neutral-gray/10 text-neutral-gray border-neutral-gray/20';
    }
  };

  return (
    <div className="min-h-screen bg-background font-paragraph">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Calendar className="w-8 h-8 text-primary" />
              <span className="text-sm font-bold tracking-widest uppercase text-neutral-gray">My Bookings</span>
            </div>
            
            <h1 className="font-heading text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Your Bed <span className="text-primary">Reservations</span>
            </h1>
            
            <p className="font-paragraph text-xl text-neutral-gray max-w-2xl mx-auto">
              Manage your hospital bed bookings and view reservation details
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bookings List */}
      <section className="w-full py-16 lg:py-24">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-white rounded-lg animate-pulse border border-neutral-gray/10" />
              ))}
            </div>
          ) : bookings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {bookings.map((booking, index) => {
                const bedInfo = getBedInfo(booking.bedIdentifier);
                
                return (
                  <motion.div
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                        {/* Booking Status */}
                        <div className="lg:col-span-2 flex lg:flex-col items-center lg:items-start gap-4 lg:border-r border-neutral-gray/10 lg:pr-6">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            {getStatusIcon(booking.bookingStatus)}
                          </div>
                          <div className="text-center lg:text-left">
                            <p className="text-xs text-neutral-gray mb-1">Status</p>
                            <Badge variant="outline" className={`${getStatusBadge(booking.bookingStatus)} border`}>
                              {booking.bookingStatus}
                            </Badge>
                          </div>
                        </div>

                        {/* Booking Details */}
                        <div className="lg:col-span-7 space-y-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-available-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Bed className="w-6 h-6 text-available-green" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-heading text-xl font-bold text-foreground mb-1">
                                Bed {bedInfo?.bedNumber || booking.bedIdentifier}
                              </h3>
                              {bedInfo && (
                                <p className="text-sm text-neutral-gray">
                                  {bedInfo.department} Department • {bedInfo.roomType}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                              <User className="w-5 h-5 text-primary" />
                              <div>
                                <p className="text-xs text-neutral-gray">Patient Name</p>
                                <p className="text-sm font-medium text-foreground">{booking.patientName}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                              <Phone className="w-5 h-5 text-primary" />
                              <div>
                                <p className="text-xs text-neutral-gray">Contact</p>
                                <p className="text-sm font-medium text-foreground">{booking.patientContactNumber}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                              <Mail className="w-5 h-5 text-primary" />
                              <div>
                                <p className="text-xs text-neutral-gray">Email</p>
                                <p className="text-sm font-medium text-foreground">{booking.patientEmail}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
                              <Calendar className="w-5 h-5 text-primary" />
                              <div>
                                <p className="text-xs text-neutral-gray">Booked On</p>
                                <p className="text-sm font-medium text-foreground">
                                  {booking._createdDate ? new Date(booking._createdDate).toLocaleDateString() : 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Dates & Actions */}
                        <div className="lg:col-span-3 flex flex-col justify-between lg:border-l border-neutral-gray/10 lg:pl-6">
                          <div className="space-y-3 mb-4">
                            <div>
                              <p className="text-xs text-neutral-gray mb-1">Check-in</p>
                              <p className="font-medium text-foreground">
                                {booking.bookingStartDate ? new Date(booking.bookingStartDate).toLocaleString() : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-neutral-gray mb-1">Check-out</p>
                              <p className="font-medium text-foreground">
                                {booking.bookingEndDate ? new Date(booking.bookingEndDate).toLocaleString() : 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {bedInfo && (
                              <Link to={`/bed/${bedInfo._id}`} className="block">
                                <Button variant="outline" className="w-full">
                                  View Bed Details
                                </Button>
                              </Link>
                            )}
                            {booking.bookingStatus?.toLowerCase() === 'confirmed' && (
                              <Button 
                                variant="destructive" 
                                className="w-full"
                                onClick={() => handleCancelBooking(booking._id, booking.bedIdentifier)}
                              >
                                Cancel Booking
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <Card className="p-16 text-center">
              <div className="w-20 h-20 bg-neutral-gray/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-neutral-gray/40" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">No Bookings Yet</h3>
              <p className="text-neutral-gray mb-8 max-w-md mx-auto">
                You haven't made any bed reservations. Browse available hospitals and beds to make your first booking.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/hospitals">
                  <Button size="lg">
                    Browse Hospitals
                  </Button>
                </Link>
                <Link to="/">
                  <Button size="lg" variant="outline">
                    View All Beds
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
