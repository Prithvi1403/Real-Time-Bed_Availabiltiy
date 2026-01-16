import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  ArrowLeft, 
  Bed, 
  Calendar,
  CheckCircle,
  User,
  Phone,
  Mail
} from 'lucide-react';

interface HospitalBeds {
  _id: string;
  bedNumber?: string;
  department?: string;
  roomType?: string;
  status?: string;
  isAvailable?: boolean;
  hospitalId?: string;
}

export default function BookingPage() {
  const { bedId } = useParams<{ bedId: string }>();
  const navigate = useNavigate();
  const [bed, setBed] = useState<HospitalBeds | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Form state
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadBed();
  }, [bedId]);

  const loadBed = async () => {
    setIsLoading(true);
    try {
      const data = await BaseCrudService.getById<HospitalBeds>('hospitalbeds', bedId!);
      setBed(data);
    } catch (error) {
      console.error('Error loading bed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bed?.isAvailable) {
      alert('This bed is no longer available. Please choose another bed.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create booking
      await BaseCrudService.create('bookings', {
        _id: crypto.randomUUID(),
        patientName,
        patientEmail,
        patientContactNumber: patientPhone,
        bedIdentifier: bed._id,
        bookingStartDate: new Date(startDate).toISOString(),
        bookingEndDate: new Date(endDate).toISOString(),
        bookingStatus: 'confirmed'
      });

      // Update bed status to occupied
      await BaseCrudService.update('hospitalbeds', {
        _id: bed._id,
        isAvailable: false,
        status: 'occupied'
      });

      setBookingSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/my-bookings');
      }, 3000);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-background font-paragraph flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <div className="w-20 h-20 bg-available-green rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
            Booking Confirmed!
          </h2>
          <p className="text-neutral-gray mb-8">
            Your bed has been successfully reserved. You will receive a confirmation email shortly.
          </p>
          <p className="text-sm text-neutral-gray">
            Redirecting to your bookings...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-paragraph">
      <Header />

      <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-12">
        <Link to={`/bed/${bedId}`}>
          <Button variant="outline" className="mb-8">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Bed Details
          </Button>
        </Link>

        <div className="min-h-[600px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <LoadingSpinner />
            </div>
          ) : !bed ? (
            <div className="text-center py-32">
              <Bed className="w-16 h-16 text-neutral-gray mx-auto mb-4" />
              <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Bed Not Found</h2>
              <p className="font-paragraph text-base text-neutral-gray mb-6">
                The bed you're trying to book doesn't exist.
              </p>
              <Link to="/">
                <Button>Return to Home</Button>
              </Link>
            </div>
          ) : !bed.isAvailable ? (
            <div className="text-center py-32">
              <Bed className="w-16 h-16 text-alert-red mx-auto mb-4" />
              <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Bed Not Available</h2>
              <p className="font-paragraph text-base text-neutral-gray mb-6">
                This bed is currently occupied and cannot be booked.
              </p>
              <Link to="/">
                <Button>Find Another Bed</Button>
              </Link>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
                  Book Your Bed
                </h1>
                <p className="text-neutral-gray text-lg">
                  Complete the form below to reserve Bed {bed.bedNumber}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Booking Form */}
                <Card className="lg:col-span-2 p-8">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                    Patient Information
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="patientName" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name *
                      </Label>
                      <Input
                        id="patientName"
                        type="text"
                        placeholder="Enter patient's full name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        required
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patientEmail" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address *
                      </Label>
                      <Input
                        id="patientEmail"
                        type="email"
                        placeholder="patient@example.com"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        required
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patientPhone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact Number *
                      </Label>
                      <Input
                        id="patientPhone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        required
                        className="h-12"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Check-in Date *
                        </Label>
                        <Input
                          id="startDate"
                          type="datetime-local"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          required
                          min={new Date().toISOString().slice(0, 16)}
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="endDate" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Expected Check-out *
                        </Label>
                        <Input
                          id="endDate"
                          type="datetime-local"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          required
                          min={startDate || new Date().toISOString().slice(0, 16)}
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-neutral-gray/10">
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full h-14 text-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <LoadingSpinner />
                            <span className="ml-2">Processing...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Confirm Booking
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Card>

                {/* Bed Summary */}
                <div className="space-y-6">
                  <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
                    <h3 className="font-heading text-xl font-bold text-foreground mb-4">
                      Booking Summary
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
                        <div className="w-12 h-12 bg-available-green/10 rounded-lg flex items-center justify-center">
                          <Bed className="w-6 h-6 text-available-green" />
                        </div>
                        <div>
                          <p className="text-xs text-neutral-gray">Bed Number</p>
                          <p className="font-heading text-xl font-bold text-foreground">{bed.bedNumber}</p>
                        </div>
                      </div>

                      <div className="space-y-2 p-4 bg-white rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-sm text-neutral-gray">Department</span>
                          <span className="text-sm font-medium text-foreground">{bed.department}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-neutral-gray">Room Type</span>
                          <span className="text-sm font-medium text-foreground">{bed.roomType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-neutral-gray">Status</span>
                          <span className="text-sm font-medium text-available-green">{bed.status}</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-primary/5 border-primary/20">
                    <h4 className="font-bold text-foreground mb-3">Important Information</h4>
                    <ul className="space-y-2 text-sm text-neutral-gray">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Booking confirmation will be sent to your email</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Please arrive 30 minutes before check-in time</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Bring valid ID and insurance documents</span>
                      </li>
                    </ul>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
