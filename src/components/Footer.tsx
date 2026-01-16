import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-white mt-24">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="font-heading text-xl font-bold mb-6">MedCenter Hospital</h3>
            <p className="font-paragraph text-sm text-white/80 leading-relaxed">
              Providing exceptional healthcare services with real-time bed availability tracking for your convenience.
            </p>
          </div>
          
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6">Contact Information</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-paragraph text-sm text-white/80">Emergency: (555) 911-0000</p>
                  <p className="font-paragraph text-sm text-white/80">Main: (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="font-paragraph text-sm text-white/80">info@medcenterhospital.com</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6">Location</h4>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="font-paragraph text-sm text-white/80 leading-relaxed">
                123 Healthcare Boulevard<br />
                Medical District<br />
                City, State 12345
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading text-lg font-semibold mb-6">Hours</h4>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-paragraph text-sm text-white/80">Emergency: 24/7</p>
                <p className="font-paragraph text-sm text-white/80 mt-2">Admissions:</p>
                <p className="font-paragraph text-sm text-white/80">Mon-Fri: 8:00 AM - 8:00 PM</p>
                <p className="font-paragraph text-sm text-white/80">Sat-Sun: 9:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8">
          <p className="font-paragraph text-sm text-white/60 text-center">
            © 2026 MedCenter Hospital. All rights reserved. | Real-time bed availability updates every 5 minutes.
          </p>
        </div>
      </div>
    </footer>
  );
}
