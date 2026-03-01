import { Link } from '@tanstack/react-router';
import { Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'glorious-shooting-academy');

  return (
    <footer className="bg-navy-950 border-t border-gold-500/20 text-foreground/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/academy-logo-latest.dim_120x120.png"
                alt="Academy Logo"
                className="h-10 w-10 object-contain rounded-full"
                style={{ filter: 'drop-shadow(0 0 4px oklch(0.78 0.18 85))' }}
              />
              <div>
                <p className="text-gold-400 font-heading font-bold text-sm uppercase tracking-wide">
                  Glorious Shooting
                </p>
                <p className="text-gold-300/70 font-heading text-xs uppercase tracking-widest">
                  Sports Academy
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Vijayawada's premier shooting sports academy, dedicated to developing champions through discipline, precision, and excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-gold-400 font-heading font-bold text-sm uppercase tracking-widest">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/scores" className="hover:text-gold-400 transition-colors">Scores</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-gold-400 transition-colors">Admin Login</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-gold-400 font-heading font-bold text-sm uppercase tracking-widest">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-gold-400 mt-0.5 shrink-0" />
                <a href="tel:8121951021" className="hover:text-gold-400 transition-colors font-medium">
                  8121951021
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gold-400 mt-0.5 shrink-0" />
                <span>Vijayawada, Andhra Pradesh, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gold-500/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-foreground/40">
          <p>© {year} Glorious Shooting Sports Academy. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-gold-500 fill-gold-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-400 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
