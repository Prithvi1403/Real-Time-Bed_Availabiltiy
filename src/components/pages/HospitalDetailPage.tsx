import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Image } from '@/components/ui/image';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Bed,
  Activity,
  Filter,
  ArrowRight
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  lastUpdated?: Date | string;
}

export default function HospitalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [beds, setBeds] = useState<HospitalBeds[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [hospitalData, bedsResult] = await Promise.all([
        BaseCrudService.getById<Hospital>('hospitals', id!),
        BaseCrudService.getAll<HospitalBeds>('hospitalbeds')
      ]);
      
      setHospital(hospitalData);
      const hospitalBeds = bedsResult.items.filter(bed => bed.hospitalId === id);
      setBeds(hospitalBeds);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const departments = Array.from(new Set(beds.map(bed => bed.department).filter(Boolean)));
  const statuses = Array.from(new Set(beds.map(bed => bed.status).filter(Boolean)));

  const filteredBeds = beds.filter(bed => {
    if (filterDepartment !== 'all' && bed.department !== filterDepartment) return false;
    if (filterStatus !== 'all' && bed.status !== filterStatus) return false;
    return true;
  });

  const availableCount = beds.filter(bed => bed.isAvailable).length;
  const occupiedCount = beds.filter(bed => !bed.isAvailable).length;

  const getStatusBadgeVariant = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'bg-available-green/10 text-available-green hover:bg-available-green/20 border-available-green/20';
      case 'occupied': return 'bg-occupied-blue/10 text-occupied-blue hover:bg-occupied-blue/20 border-occupied-blue/20';
      case 'cleaning': return 'bg-warning-yellow/10 text-warning-yellow hover:bg-warning-yellow/20 border-warning-yellow/20';
      case 'emergency': return 'bg-alert-red/10 text-alert-red hover:bg-alert-red/20 border-alert-red/20';
      default: return 'bg-neutral-gray/10 text-neutral-gray hover:bg-neutral-gray/20 border-neutral-gray/20';
    }
  };

  return (
    <div className="min-h-screen bg-background font-paragraph">
      <Header />

      <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-12">
        <Link to="/hospitals">
          <Button variant="outline" className="mb-8">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Hospitals
          </Button>
        </Link>

        <div className="min-h-[600px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <LoadingSpinner />
            </div>
          ) : !hospital ? (
            <div className="text-center py-32">
              <Building2 className="w-16 h-16 text-neutral-gray mx-auto mb-4" />
              <h2 className="font-heading text-3xl font-bold text-foreground mb-2">Hospital Not Found</h2>
              <p className="font-paragraph text-base text-neutral-gray mb-6">
                The hospital you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/hospitals">
                <Button>Return to Hospitals</Button>
              </Link>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Hospital Header */}
              <Card className="overflow-hidden mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  {/* Hospital Image */}
                  <div className="relative h-64 lg:h-auto bg-neutral-gray/5">
                    {hospital.hospitalImage ? (
                      <Image
                        src={hospital.hospitalImage}
                        alt={hospital.hospitalName || 'Hospital'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                        <Building2 className="w-24 h-24 text-primary/30" />
                      </div>
                    )}
                  </div>

                  {/* Hospital Info */}
                  <div className="lg:col-span-2 p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h1 className="font-heading text-4xl font-bold text-foreground mb-3">
                          {hospital.hospitalName}
                        </h1>
                        {hospital.description && (
                          <p className="font-paragraph text-lg text-neutral-gray max-w-2xl">
                            {hospital.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-background p-4 rounded-lg">
                        <p className="text-sm text-neutral-gray mb-1">Total Beds</p>
                        <p className="font-heading text-3xl font-bold text-foreground">{beds.length}</p>
                      </div>
                      <div className="bg-available-green/10 p-4 rounded-lg">
                        <p className="text-sm text-available-green mb-1">Available</p>
                        <p className="font-heading text-3xl font-bold text-available-green">{availableCount}</p>
                      </div>
                      <div className="bg-occupied-blue/10 p-4 rounded-lg">
                        <p className="text-sm text-occupied-blue mb-1">Occupied</p>
                        <p className="font-heading text-3xl font-bold text-occupied-blue">{occupiedCount}</p>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {hospital.address && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">Address</p>
                            <p className="text-sm text-neutral-gray">
                              {hospital.address}, {hospital.city}, {hospital.stateProvince} {hospital.zipPostalCode}
                            </p>
                          </div>
                        </div>
                      )}
                      {hospital.phoneNumber && (
                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">Phone</p>
                            <p className="text-sm text-neutral-gray">{hospital.phoneNumber}</p>
                          </div>
                        </div>
                      )}
                      {hospital.emailAddress && (
                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">Email</p>
                            <p className="text-sm text-neutral-gray">{hospital.emailAddress}</p>
                          </div>
                        </div>
                      )}
                      {hospital.websiteUrl && (
                        <div className="flex items-start gap-3">
                          <Globe className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">Website</p>
                            <a href={hospital.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                              Visit Website
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Filters */}
              <Card className="p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="flex items-center gap-2 text-primary font-bold">
                      <Filter className="w-5 h-5" />
                      <span>FILTERS</span>
                    </div>
                    
                    <div className="flex gap-2 flex-1">
                      <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          {departments.map(dept => (
                            <SelectItem key={dept} value={dept!}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          {statuses.map(status => (
                            <SelectItem key={status} value={status!}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setFilterDepartment('all');
                      setFilterStatus('all');
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </Card>

              {/* Beds Grid */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="w-6 h-6 text-primary" />
                  <h2 className="font-heading text-2xl font-bold text-foreground">
                    Available Beds ({filteredBeds.length})
                  </h2>
                </div>

                {filteredBeds.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBeds.map((bed, index) => (
                      <motion.div
                        key={bed._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <Link to={`/bed/${bed._id}`}>
                          <Card className="p-6 hover:shadow-xl transition-all duration-300 group h-full">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bed.isAvailable ? 'bg-available-green/10 group-hover:bg-available-green text-available-green group-hover:text-white' : 'bg-occupied-blue/10 group-hover:bg-occupied-blue text-occupied-blue group-hover:text-white'} transition-colors`}>
                                  <Bed className="w-6 h-6" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-neutral-gray uppercase">Unit</p>
                                  <h3 className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                    {bed.bedNumber}
                                  </h3>
                                </div>
                              </div>
                              <Badge variant="outline" className={`${getStatusBadgeVariant(bed.status)} border`}>
                                {bed.status}
                              </Badge>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center py-2 border-b border-neutral-gray/5">
                                <span className="text-sm text-neutral-gray">Department</span>
                                <span className="font-medium text-foreground text-sm">{bed.department}</span>
                              </div>
                              
                              <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-neutral-gray">Type</span>
                                <span className="font-medium text-foreground text-sm">{bed.roomType}</span>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-neutral-gray/10 flex justify-between items-center">
                              <span className={`text-sm font-semibold ${bed.isAvailable ? 'text-available-green' : 'text-occupied-blue'}`}>
                                {bed.isAvailable ? 'Available' : 'Occupied'}
                              </span>
                              <ArrowRight className="w-4 h-4 text-neutral-gray group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <Bed className="w-16 h-16 text-neutral-gray/40 mx-auto mb-4" />
                    <h3 className="font-heading text-xl font-bold text-foreground mb-2">No Beds Found</h3>
                    <p className="text-neutral-gray mb-6">
                      No beds match your current filter criteria.
                    </p>
                    <Button onClick={() => { setFilterDepartment('all'); setFilterStatus('all'); }}>
                      Clear Filters
                    </Button>
                  </Card>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
