import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Image } from '@/components/ui/image';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Bed,
  Search,
  Navigation,
  ArrowRight
} from 'lucide-react';

interface Hospital {
  _id: string;
  hospitalName?: string;
  address?: string;
  city?: string;
  stateProvince?: string;
  zipPostalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  phoneNumber?: string;
  emailAddress?: string;
  websiteUrl?: string;
  description?: string;
  hospitalImage?: string;
}

interface HospitalBeds {
  _id: string;
  bedNumber?: string;
  department?: string;
  roomType?: string;
  status?: string;
  isAvailable?: boolean;
  hospitalId?: string;
}

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [beds, setBeds] = useState<HospitalBeds[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [hospitalsResult, bedsResult] = await Promise.all([
        BaseCrudService.getAll<Hospital>('hospitals'),
        BaseCrudService.getAll<HospitalBeds>('hospitalbeds')
      ]);
      setHospitals(hospitalsResult.items);
      setBeds(bedsResult.items);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHospitalBedStats = (hospitalId: string) => {
    const hospitalBeds = beds.filter(bed => bed.hospitalId === hospitalId);
    const available = hospitalBeds.filter(bed => bed.isAvailable).length;
    const total = hospitalBeds.length;
    return { available, total };
  };

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = !searchQuery || 
      hospital.hospitalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.city?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = !locationFilter || 
      hospital.city?.toLowerCase().includes(locationFilter.toLowerCase()) ||
      hospital.stateProvince?.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  const cities = Array.from(new Set(hospitals.map(h => h.city).filter(Boolean)));

  return (
    <div className="min-h-screen bg-background font-paragraph">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="relative z-10 max-w-[120rem] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Building2 className="w-8 h-8 text-primary" />
              <span className="text-sm font-bold tracking-widest uppercase text-neutral-gray">Hospital Network</span>
            </div>
            
            <h1 className="font-heading text-5xl lg:text-7xl font-bold text-foreground mb-6">
              Find Hospitals <br />
              <span className="text-primary">Near You</span>
            </h1>
            
            <p className="font-paragraph text-xl text-neutral-gray mb-10 max-w-2xl mx-auto">
              Search our network of hospitals and check real-time bed availability. Book your bed with confidence.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-gray" />
                <Input
                  type="text"
                  placeholder="Search by hospital name or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 border-0 focus-visible:ring-0 text-base"
                />
              </div>
              <Button 
                size="lg" 
                className="h-14 px-8 bg-primary hover:bg-primary/90"
                onClick={loadData}
              >
                <Navigation className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-0 z-40 bg-white border-b border-neutral-gray/10 shadow-sm">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-bold text-foreground">Filter by Location:</span>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={locationFilter === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLocationFilter('')}
              >
                All Locations
              </Button>
              {cities.slice(0, 5).map(city => (
                <Button
                  key={city}
                  variant={locationFilter === city ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLocationFilter(city!)}
                >
                  {city}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hospitals Grid */}
      <section className="w-full py-16 lg:py-24">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-2">
                Available Hospitals
              </h2>
              <p className="text-neutral-gray">
                Showing {filteredHospitals.length} hospitals in our network
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-white rounded-lg animate-pulse border border-neutral-gray/10" />
              ))}
            </div>
          ) : filteredHospitals.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredHospitals.map((hospital, index) => {
                const stats = getHospitalBedStats(hospital._id);
                const availabilityPercentage = stats.total > 0 ? (stats.available / stats.total) * 100 : 0;
                
                return (
                  <motion.div
                    key={hospital._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 group">
                      {/* Hospital Image */}
                      <div className="relative h-48 bg-neutral-gray/5 overflow-hidden">
                        {hospital.hospitalImage ? (
                          <Image
                            src={hospital.hospitalImage}
                            alt={hospital.hospitalName || 'Hospital'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                            <Building2 className="w-16 h-16 text-primary/30" />
                          </div>
                        )}
                        
                        {/* Availability Badge */}
                        <div className="absolute top-4 right-4 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
                          <Bed className={`w-4 h-4 ${stats.available > 0 ? 'text-available-green' : 'text-alert-red'}`} />
                          <span className="font-bold text-sm">
                            {stats.available}/{stats.total} Available
                          </span>
                        </div>
                      </div>

                      {/* Hospital Info */}
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="font-heading text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {hospital.hospitalName}
                          </h3>
                          {hospital.description && (
                            <p className="text-sm text-neutral-gray line-clamp-2">
                              {hospital.description}
                            </p>
                          )}
                        </div>

                        {/* Availability Bar */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium text-neutral-gray">Bed Availability</span>
                            <span className="text-xs font-bold text-foreground">{availabilityPercentage.toFixed(0)}%</span>
                          </div>
                          <div className="w-full h-2 bg-neutral-gray/10 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${availabilityPercentage > 20 ? 'bg-available-green' : 'bg-alert-red'}`}
                              style={{ width: `${availabilityPercentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 pt-4 border-t border-neutral-gray/10">
                          {hospital.address && (
                            <div className="flex items-start gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-neutral-gray mt-0.5 flex-shrink-0" />
                              <span className="text-neutral-gray">
                                {hospital.address}, {hospital.city}, {hospital.stateProvince} {hospital.zipPostalCode}
                              </span>
                            </div>
                          )}
                          {hospital.phoneNumber && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-neutral-gray" />
                              <span className="text-neutral-gray">{hospital.phoneNumber}</span>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4">
                          <Link to={`/hospital/${hospital._id}`} className="flex-1">
                            <Button className="w-full group/btn">
                              View Details
                              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-lg border border-dashed border-neutral-gray/30">
              <div className="w-20 h-20 bg-neutral-gray/5 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-neutral-gray/40" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">No Hospitals Found</h3>
              <p className="text-neutral-gray mb-8 max-w-md">
                No hospitals match your search criteria. Try adjusting your filters or search terms.
              </p>
              <Button onClick={() => { setSearchQuery(''); setLocationFilter(''); }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
