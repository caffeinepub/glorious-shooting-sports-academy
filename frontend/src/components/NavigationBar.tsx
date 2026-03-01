import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NavigationBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { identity, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  return (
    <header className="sticky top-0 z-50 bg-navy-950 border-b border-gold-500/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/assets/generated/academy-logo-latest.dim_120x120.png"
                alt="Glorious Shooting Sports Academy Logo"
                className="h-10 w-10 object-contain rounded-full"
                style={{ filter: 'drop-shadow(0 0 6px oklch(0.78 0.18 85))' }}
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-gold-400 font-heading font-bold text-sm leading-tight tracking-wide uppercase">
                Glorious Shooting
              </p>
              <p className="text-gold-300/80 font-heading text-xs tracking-widest uppercase">
                Sports Academy
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-foreground/80 hover:text-gold-400 transition-colors tracking-wide uppercase"
              activeProps={{ className: 'text-gold-400' }}
            >
              Home
            </Link>
            <Link
              to="/scores"
              className="text-sm font-medium text-foreground/80 hover:text-gold-400 transition-colors tracking-wide uppercase"
              activeProps={{ className: 'text-gold-400' }}
            >
              Scores
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="border-gold-500/50 text-gold-400 hover:bg-gold-500/10 gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-foreground/60 hover:text-destructive gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm" className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold tracking-wide">
                  Admin Login
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-foreground/80 hover:text-gold-400 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-navy-900 border-t border-gold-500/20 px-4 py-4 space-y-3">
          <Link
            to="/"
            className="block text-sm font-medium text-foreground/80 hover:text-gold-400 transition-colors py-2 uppercase tracking-wide"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/scores"
            className="block text-sm font-medium text-foreground/80 hover:text-gold-400 transition-colors py-2 uppercase tracking-wide"
            onClick={() => setMenuOpen(false)}
          >
            Scores
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/admin"
                className="block text-sm font-medium text-gold-400 py-2 uppercase tracking-wide"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="block text-sm font-medium text-foreground/60 hover:text-destructive py-2 uppercase tracking-wide"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block text-sm font-medium text-gold-400 py-2 uppercase tracking-wide"
              onClick={() => setMenuOpen(false)}
            >
              Admin Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
