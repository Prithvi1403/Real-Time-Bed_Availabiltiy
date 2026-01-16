// HPI 1.7-V
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { HospitalBeds } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image } from '@/components/ui/image';
import { 
  Bed, 
  Filter, 
  RefreshCw, 
  ArrowRight, 
  Activity, 
  Users, 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  BarChart3,
  Search,
  LayoutGrid,
  List
} from 'lucide-react';

// --- Types ---
type ViewMode = 'grid' | 'list';

// --- Utility Components ---

const StatusIndicator = ({ status }: { status?: string }) => {
  const getStatusColor = (s?: string) => {
    switch (s?.toLowerCase()) {
      case 'available': return 'bg-available-green shadow-[0_0_10px_rgba(40,167,69,0.4)]';
      case 'occupied': return 'bg-occupied-blue';
      case 'cleaning': return 'bg-warning-yellow';
      case 'maintenance': return 'bg-neutral-gray';
      case 'emergency': return 'bg-alert-red animate-pulse';
      default: return 'bg-neutral-gray';
    }
  };

  return (
    <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(status)}`} />
  );
};

const GridBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
    <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
  </div>
);

export default function HomePage() {
  // --- 1. Data Fidelity Protocol: Canonical Data Sources ---
  const [beds, setBeds] = useState<HospitalBeds[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterRoomType, setFilterRoomType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // --- Data Fetching (Preserved) ---
  const loadBeds = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<HospitalBeds>('hospitalbeds');
      setBeds(result.items);
    } catch (error) {
      console.error('Error loading beds:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBeds();
  }, []);

  // --- Derived Data (Preserved & Utilized) ---
  const departments = Array.from(new Set(beds.map(bed => bed.department).filter(Boolean)));
  const roomTypes = Array.from(new Set(beds.map(bed => bed.roomType).filter(Boolean)));
  const statuses = Array.from(new Set(beds.map(bed => bed.status).filter(Boolean)));

  const filteredBeds = beds.filter(bed => {
    if (filterDepartment !== 'all' && bed.department !== filterDepartment) return false;
    if (filterRoomType !== 'all' && bed.roomType !== filterRoomType) return false;
    if (filterStatus !== 'all' && bed.status !== filterStatus) return false;
    return true;
  });

  const availableCount = beds.filter(bed => bed.isAvailable).length;
  const occupiedCount = beds.filter(bed => !bed.isAvailable).length;
  const totalBeds = beds.length;
  const emergencyCount = beds.filter(bed => bed.status?.toLowerCase() === 'emergency').length;

  // --- Animation Hooks ---
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const headerY = useTransform(smoothProgress, [0, 0.2], [0, -50]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);

  // --- Helper Functions ---
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
    <div ref={containerRef} className="min-h-screen bg-background font-paragraph selection:bg-primary/20 selection:text-primary overflow-clip">
      <style>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        .tech-grid-bg {
          background-image: 
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .clip-tech-corner {
          clip-path: polygon(
            0 0,
            100% 0,
            100% calc(100% - 20px),
            calc(100% - 20px) 100%,
            0 100%
          );
        }
      `}</style>

      <Header />

      {/* --- HERO SECTION: The Command Center --- */}
      <section className="relative w-full min-h-[90vh] flex flex-col justify-center overflow-hidden bg-background">
        <GridBackground />
        
        {/* Animated Background Elements */}
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, 300]) }}
          className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none"
        />
        <motion.div 
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -200]) }}
          className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-occupied-blue/5 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4 pointer-events-none"
        />

        <div className="relative z-10 max-w-[120rem] mx-auto px-6 lg:px-12 w-full pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Content */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex items-center gap-3"
              >
                <span className="flex h-2 w-2 rounded-full bg-available-green animate-pulse" />
                <span className="text-sm font-bold tracking-widest uppercase text-neutral-gray">System Operational</span>
                <span className="h-px w-12 bg-neutral-gray/30" />
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="font-heading text-6xl lg:text-8xl font-bold leading-[0.9] tracking-tight text-foreground"
              >
                Centralized <br />
                <span className="text-primary">Bed Management</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-paragraph text-xl text-neutral-gray max-w-2xl leading-relaxed"
              >
                Real-time visibility into hospital capacity. Optimize patient flow, reduce wait times, and manage resources with precision-engineered data clarity.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <Button 
                  onClick={() => document.getElementById('dashboard-grid')?.scrollIntoView({ behavior: 'smooth' })}
                  size="lg" 
                  className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white rounded-none clip-tech-corner shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px]"
                >
                  Access Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  onClick={loadBeds}
                  size="lg" 
                  variant="outline" 
                  className="h-14 px-8 text-lg border-2 hover:bg-neutral-gray/5 rounded-none"
                >
                  <RefreshCw className={`mr-2 w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                  Sync Data
                </Button>
              </motion.div>
            </div>

            {/* Hero Stats / HUD */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative z-10"
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Total Capacity Card */}
                  <div className="col-span-2 bg-white border border-neutral-gray/10 p-8 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Building2 className="w-24 h-24" />
                    </div>
                    <p className="text-sm font-bold text-neutral-gray uppercase tracking-wider mb-2">Total Capacity</p>
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading text-6xl font-bold text-foreground">{totalBeds}</span>
                      <span className="text-xl text-neutral-gray">Beds</span>
                    </div>
                    <div className="mt-6 w-full bg-neutral-gray/10 h-1.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>

                  {/* Available Card */}
                  <div className="bg-white border border-neutral-gray/10 p-6 shadow-lg relative overflow-hidden group hover:border-available-green/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-available-green/10 rounded-md">
                        <Bed className="w-6 h-6 text-available-green" />
                      </div>
                      <span className="text-xs font-bold text-available-green bg-available-green/10 px-2 py-1 rounded">LIVE</span>
                    </div>
                    <p className="text-sm font-medium text-neutral-gray mb-1">Available</p>
                    <p className="font-heading text-4xl font-bold text-foreground">{availableCount}</p>
                  </div>

                  {/* Occupied Card */}
                  <div className="bg-white border border-neutral-gray/10 p-6 shadow-lg relative overflow-hidden group hover:border-occupied-blue/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-occupied-blue/10 rounded-md">
                        <Users className="w-6 h-6 text-occupied-blue" />
                      </div>
                      <span className="text-xs font-bold text-neutral-gray bg-neutral-gray/10 px-2 py-1 rounded">ACTIVE</span>
                    </div>
                    <p className="text-sm font-medium text-neutral-gray mb-1">Occupied</p>
                    <p className="font-heading text-4xl font-bold text-foreground">{occupiedCount}</p>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -z-10 top-[-20px] right-[-20px] w-full h-full border border-primary/20 translate-x-4 translate-y-4" />
                <div className="absolute -z-20 top-[-40px] right-[-40px] w-full h-full border border-primary/10 translate-x-8 translate-y-8" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STICKY CONTROL BAR --- */}
      <div className="sticky top-0 z-50 w-full glass-panel border-y border-neutral-gray/10 shadow-sm">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-2 text-primary font-bold">
                <Filter className="w-5 h-5" />
                <span className="hidden sm:inline">FILTERS</span>
              </div>
              <div className="h-8 w-px bg-neutral-gray/20 mx-2 hidden lg:block" />
              
              <div className="flex gap-2 w-full overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-[180px] bg-white/50 border-neutral-gray/20 focus:ring-primary/20">
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
                  <SelectTrigger className="w-[160px] bg-white/50 border-neutral-gray/20 focus:ring-primary/20">
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

            <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
              <div className="flex bg-neutral-gray/5 p-1 rounded-lg border border-neutral-gray/10">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-neutral-gray hover:text-foreground'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-neutral-gray hover:text-foreground'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setFilterDepartment('all');
                  setFilterRoomType('all');
                  setFilterStatus('all');
                }}
                className="text-neutral-gray hover:text-destructive"
              >
                Reset
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* --- MAIN DASHBOARD GRID --- */}
      <section id="dashboard-grid" className="w-full py-16 lg:py-24 bg-neutral-gray/5">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="font-heading text-3xl font-bold text-foreground flex items-center gap-3">
                <Activity className="w-8 h-8 text-primary" />
                Live Bed Status
              </h2>
              <p className="text-neutral-gray mt-2">
                Monitoring {filteredBeds.length} units across {departments.length} departments
              </p>
            </div>
            {emergencyCount > 0 && (
              <div className="flex items-center gap-3 px-4 py-2 bg-alert-red/10 border border-alert-red/20 rounded-full animate-pulse">
                <AlertCircle className="w-5 h-5 text-alert-red" />
                <span className="font-bold text-alert-red text-sm">{emergencyCount} Emergency Beds Active</span>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-48 bg-white rounded-lg animate-pulse border border-neutral-gray/10" />
              ))}
            </div>
          ) : filteredBeds.length > 0 ? (
            <motion.div 
              layout
              className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}
            >
              {filteredBeds.map((bed, index) => (
                <motion.div
                  layout
                  key={bed._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link to={`/bed/${bed._id}`} className="block h-full">
                    <Card className={`h-full group hover:shadow-xl transition-all duration-300 border-neutral-gray/10 overflow-hidden ${viewMode === 'list' ? 'flex flex-row items-center p-6' : 'p-6'}`}>
                      
                      {/* Card Header */}
                      <div className={`flex justify-between items-start ${viewMode === 'list' ? 'w-1/4 border-r border-neutral-gray/10 pr-6 mr-6 mb-0' : 'mb-6'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${bed.isAvailable ? 'bg-available-green/10 group-hover:bg-available-green text-available-green group-hover:text-white' : 'bg-occupied-blue/10 group-hover:bg-occupied-blue text-occupied-blue group-hover:text-white'}`}>
                            <Bed className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-neutral-gray uppercase tracking-wider">Unit</p>
                            <h3 className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {bed.bedNumber}
                            </h3>
                          </div>
                        </div>
                        {viewMode === 'grid' && (
                          <Badge variant="outline" className={`${getStatusBadgeVariant(bed.status)} border`}>
                            {bed.status}
                          </Badge>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className={`space-y-3 ${viewMode === 'list' ? 'flex-1 grid grid-cols-3 gap-6 space-y-0' : ''}`}>
                        <div className={viewMode === 'list' ? 'flex flex-col' : 'flex justify-between items-center py-2 border-b border-neutral-gray/5'}>
                          <span className="text-sm text-neutral-gray">Department</span>
                          <span className="font-medium text-foreground">{bed.department}</span>
                        </div>
                        
                        <div className={viewMode === 'list' ? 'flex flex-col' : 'flex justify-between items-center py-2 border-b border-neutral-gray/5'}>
                          <span className="text-sm text-neutral-gray">Type</span>
                          <span className="font-medium text-foreground">{bed.roomType}</span>
                        </div>
                        
                        <div className={viewMode === 'list' ? 'flex flex-col items-end' : 'flex justify-between items-center py-2'}>
                          <span className="text-sm text-neutral-gray mb-1 block lg:hidden">Status</span>
                          <div className="flex items-center gap-2">
                            <StatusIndicator status={bed.status} />
                            <span className={`text-sm font-semibold ${bed.isAvailable ? 'text-available-green' : 'text-occupied-blue'}`}>
                              {bed.isAvailable ? 'Available' : 'Occupied'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className={`mt-4 pt-4 border-t border-neutral-gray/10 flex justify-between items-center ${viewMode === 'list' ? 'hidden' : ''}`}>
                        <div className="flex items-center gap-1 text-xs text-neutral-gray">
                          <Clock className="w-3 h-3" />
                          <span>Updated: {bed.lastUpdated ? new Date(bed.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-gray group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>

                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-lg border border-dashed border-neutral-gray/30">
              <div className="w-20 h-20 bg-neutral-gray/5 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-neutral-gray/40" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">No Units Found</h3>
              <p className="text-neutral-gray mb-8 max-w-md">
                No beds match your current filter criteria. Try adjusting the filters or refreshing the data.
              </p>
              <Button 
                onClick={() => {
                  setFilterDepartment('all');
                  setFilterRoomType('all');
                  setFilterStatus('all');
                }}
                variant="outline"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* --- ANALYTICS & CAPACITY SECTION --- */}
      <section className="w-full py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-gray/20 to-transparent" />
        
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left: Narrative & Image */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="mb-8">
                <h2 className="font-heading text-4xl font-bold text-foreground mb-6">
                  Departmental <br />
                  <span className="text-primary">Capacity Analytics</span>
                </h2>
                <p className="font-paragraph text-lg text-neutral-gray leading-relaxed mb-8">
                  Our integrated dashboard provides granular visibility into bed utilization across all specialized departments. This data drives efficient resource allocation and ensures critical care availability.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-neutral-gray/5 rounded-lg border border-neutral-gray/10">
                    <CheckCircle2 className="w-6 h-6 text-available-green" />
                    <div>
                      <h4 className="font-bold text-foreground">Auto-Updated Data</h4>
                      <p className="text-sm text-neutral-gray">System syncs every 30 seconds</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-neutral-gray/5 rounded-lg border border-neutral-gray/10">
                    <BarChart3 className="w-6 h-6 text-occupied-blue" />
                    <div>
                      <h4 className="font-bold text-foreground">Demand Planning</h4>
                      <p className="text-sm text-neutral-gray">Predictive analytics for peak hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Visual Data Bars */}
            <div className="lg:col-span-7">
              <div className="grid gap-6">
                {departments.map((dept, index) => {
                  const deptBeds = beds.filter(bed => bed.department === dept);
                  const deptAvailable = deptBeds.filter(bed => bed.isAvailable).length;
                  const percentage = deptBeds.length > 0 ? (deptAvailable / deptBeds.length) * 100 : 0;
                  const isCritical = percentage < 20;

                  return (
                    <motion.div
                      key={dept}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group"
                    >
                      <div className="bg-white border border-neutral-gray/10 p-6 hover:shadow-md transition-all hover:border-primary/30 relative overflow-hidden">
                        {/* Background Progress Bar (Subtle) */}
                        <div 
                          className="absolute top-0 left-0 h-full bg-neutral-gray/5 transition-all duration-1000 ease-out -z-10"
                          style={{ width: `${100 - percentage}%` }} // Inverted to show occupancy visually
                        />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div>
                            <h3 className="font-heading text-xl font-bold text-foreground">{dept}</h3>
                            <p className="text-sm text-neutral-gray">{deptBeds.length} Total Units</p>
                          </div>
                          <div className="text-right">
                            <span className={`font-heading text-2xl font-bold ${isCritical ? 'text-alert-red' : 'text-available-green'}`}>
                              {deptAvailable}
                            </span>
                            <span className="text-sm text-neutral-gray ml-2">Available</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-3 bg-neutral-gray/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={`h-full rounded-full ${isCritical ? 'bg-alert-red' : 'bg-available-green'}`}
                          />
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-primary font-semibold group-hover:translate-x-1 transition-transform"
                            onClick={() => {
                              setFilterDepartment(dept!);
                              document.getElementById('dashboard-grid')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                          >
                            View Details <ArrowRight className="ml-1 w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- VISUAL BREATHER / SYSTEM STATUS --- */}
      <section className="w-full h-[60vh] relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://static.wixstatic.com/media/595350_ce9211eef6b044d7ba3878902e1bc3a3~mv2.png?originWidth=640&originHeight=320" 
            alt="Hospital Technology Abstract" 
            className="w-full h-full object-cover opacity-20 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Unified Patient-Hospital Dashboard
            </h2>
            <p className="font-paragraph text-xl text-neutral-gray mb-10">
              Connecting emergency response, routine care, and city-wide hospital integration into a single source of truth.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border border-neutral-gray/10">
                  <Activity className="w-8 h-8 text-primary" />
                </div>
                <span className="font-bold text-sm uppercase tracking-wider text-neutral-gray">Live Monitoring</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border border-neutral-gray/10">
                  <Users className="w-8 h-8 text-occupied-blue" />
                </div>
                <span className="font-bold text-sm uppercase tracking-wider text-neutral-gray">Patient Flow</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center border border-neutral-gray/10">
                  <Building2 className="w-8 h-8 text-available-green" />
                </div>
                <span className="font-bold text-sm uppercase tracking-wider text-neutral-gray">Facility Mgmt</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- CONTACT / ACTION SECTION --- */}
      <section className="w-full py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://static.wixstatic.com/media/595350_b1f7efd1379e45c78a63c22571abd542~mv2.png?originWidth=640&originHeight=320')] opacity-10 mix-blend-overlay bg-cover bg-center" />
        
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-2/3">
              <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6">
                Immediate Assistance Required?
              </h2>
              <p className="font-paragraph text-xl text-primary-foreground/90 max-w-2xl">
                Our admissions team is on standby 24/7 to assist with bed allocation, emergency transfers, and capacity inquiries.
              </p>
            </div>
            <div className="lg:w-1/3 flex flex-col sm:flex-row gap-4 w-full lg:justify-end">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold h-14 px-8 text-lg shadow-xl">
                Contact Admissions
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-bold h-14 px-8 text-lg">
                Emergency Line
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}