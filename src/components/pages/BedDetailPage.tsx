import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { HospitalBeds } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ArrowLeft, Bed, Calendar, Clock, MapPin, Info, CheckCircle, XCircle } from 'lucide-react';

export default function BedDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [bed, setBed] = useState<HospitalBeds | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBed = async () => {
      setIsLoading(true);
      try {
        const data = await BaseCrudService.getById<HospitalBeds>('hospitalbeds', id!);
        setBed(data);
      } catch (error) {
        console.error('Error loading bed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadBed();
    }
  }, [id]);

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-available-green text-available-green-foreground';
      case 'occupied':
        return 'bg-occupied-blue text-occupied-blue-foreground';
      case 'cleaning':
        return 'bg-warning-yellow text-warning-yellow-foreground';
      case 'maintenance':
        return 'bg-neutral-gray text-neutral-gray-foreground';
      case 'emergency':
        return 'bg-alert-red text-alert-red-foreground';
      default:
        return 'bg-neutral-gray text-neutral-gray-foreground';
    }
  };

  const getStatusDescription = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'This bed is currently available and ready for patient admission.';
      case 'occupied':
        return 'This bed is currently occupied by a patient.';
      case 'cleaning':
        return 'This bed is being cleaned and sanitized. It will be available shortly.';
      case 'maintenance':
        return 'This bed is undergoing maintenance and is temporarily unavailable.';
      case 'emergency':
        return 'This bed is reserved for emergency cases only.';
      default:
        return 'Status information not available.';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-12">
        <Link to="/">
          <Button variant="outline" className="mb-8">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Availability
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
                The bed you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/">
                <Button>Return to Home</Button>
              </Link>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header Card */}
              <Card className="p-8 mb-8 border-2">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex items-start gap-6">
                    <div className={`w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 ${bed.isAvailable ? 'bg-available-green' : 'bg-occupied-blue'}`}>
                      <Bed className={`w-10 h-10 ${bed.isAvailable ? 'text-available-green-foreground' : 'text-occupied-blue-foreground'}`} />
                    </div>
                    <div>
                      <h1 className="font-heading text-4xl font-bold text-foreground mb-2">
                        Bed {bed.bedNumber}
                      </h1>
                      <p className="font-paragraph text-lg text-neutral-gray">
                        {bed.department} Department
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-start lg:items-end gap-3">
                    <Badge className={`${getStatusColor(bed.status)} text-base px-4 py-2`}>
                      {bed.status}
                    </Badge>
                    <div className="flex items-center gap-2">
                      {bed.isAvailable ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-available-green" />
                          <span className="font-paragraph text-base font-semibold text-available-green">Available</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-occupied-blue" />
                          <span className="font-paragraph text-base font-semibold text-occupied-blue">Occupied</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Information */}
                <div className="lg:col-span-2 space-y-8">
                  <Card className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Info className="w-6 h-6 text-primary" />
                      <h2 className="font-heading text-2xl font-bold text-foreground">Bed Information</h2>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <p className="font-paragraph text-sm text-neutral-gray">Bed Number</p>
                          <p className="font-heading text-xl font-bold text-foreground">{bed.bedNumber}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="font-paragraph text-sm text-neutral-gray">Room Type</p>
                          <p className="font-heading text-xl font-bold text-foreground">{bed.roomType}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="font-paragraph text-sm text-neutral-gray">Department</p>
                          <p className="font-heading text-xl font-bold text-foreground">{bed.department}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="font-paragraph text-sm text-neutral-gray">Current Status</p>
                          <p className="font-heading text-xl font-bold text-foreground">{bed.status}</p>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-neutral-gray/10">
                        <p className="font-paragraph text-base text-foreground leading-relaxed">
                          {getStatusDescription(bed.status)}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <MapPin className="w-6 h-6 text-primary" />
                      <h2 className="font-heading text-2xl font-bold text-foreground">Location Details</h2>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-background rounded-lg">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-paragraph text-sm text-neutral-gray mb-1">Department Location</p>
                          <p className="font-paragraph text-base font-medium text-foreground">{bed.department} Wing</p>
                          <p className="font-paragraph text-sm text-neutral-gray mt-2">
                            Please check with the admissions desk for specific floor and room directions.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-4 bg-background rounded-lg">
                        <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Bed className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                          <p className="font-paragraph text-sm text-neutral-gray mb-1">Room Configuration</p>
                          <p className="font-paragraph text-base font-medium text-foreground">{bed.roomType}</p>
                          <p className="font-paragraph text-sm text-neutral-gray mt-2">
                            Room amenities and features vary by type. Contact staff for specific details.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                  <Card className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Clock className="w-6 h-6 text-primary" />
                      <h2 className="font-heading text-xl font-bold text-foreground">Last Updated</h2>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-background rounded-lg">
                        <Calendar className="w-5 h-5 text-neutral-gray" />
                        <div>
                          <p className="font-paragraph text-xs text-neutral-gray">Date & Time</p>
                          <p className="font-paragraph text-sm font-medium text-foreground">
                            {bed.lastUpdated ? new Date(bed.lastUpdated).toLocaleString() : 'Not available'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="font-paragraph text-xs text-neutral-gray mb-2">Real-Time Updates</p>
                        <p className="font-paragraph text-sm text-foreground">
                          Bed status is updated automatically every 5 minutes to ensure accuracy.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                    <h3 className="font-heading text-xl font-bold text-foreground mb-4">
                      Need to Reserve This Bed?
                    </h3>
                    <p className="font-paragraph text-sm text-neutral-gray mb-6">
                      Contact our admissions team to inquire about bed availability and patient admission procedures.
                    </p>
                    <div className="space-y-3">
                      <Button className="w-full font-semibold">
                        Contact Admissions
                      </Button>
                      <Button variant="outline" className="w-full font-semibold">
                        Call Emergency Line
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-8">
                    <h3 className="font-heading text-lg font-bold text-foreground mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <Link to="/" className="block">
                        <Button variant="outline" className="w-full justify-start">
                          <ArrowLeft className="mr-2 w-4 h-4" />
                          View All Beds
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.location.reload()}
                      >
                        <Clock className="mr-2 w-4 h-4" />
                        Refresh Status
                      </Button>
                    </div>
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
