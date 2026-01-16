import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-neutral-gray/20 sticky top-0 z-50">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">MedCenter Hospital</h1>
              <p className="font-paragraph text-xs text-neutral-gray">Real-Time Bed Tracking</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="font-paragraph text-base text-foreground hover:text-primary transition-colors"
            >
              Bed Availability
            </Link>
            <Link 
              to="/hospitals" 
              className="font-paragraph text-base text-neutral-gray hover:text-primary transition-colors"
            >
              Hospitals
            </Link>
            <Link 
              to="/my-bookings" 
              className="font-paragraph text-base text-neutral-gray hover:text-primary transition-colors"
            >
              My Bookings
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
