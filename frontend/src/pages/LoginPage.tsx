import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Target, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const { login, loginStatus, identity, isInitializing, isLoggingIn, isLoginError } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/admin' });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-gold-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
      {/* Decorative crosshair background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-gold-400 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-gold-400 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-gold-400 rounded-full" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gold-400" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gold-400" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-navy-900 border border-gold-500/30 rounded-xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img
                src="/assets/generated/academy-logo-latest.dim_120x120.png"
                alt="Academy Logo"
                className="h-16 w-16 object-contain rounded-full"
                style={{ filter: 'drop-shadow(0 0 12px oklch(0.78 0.18 85))' }}
              />
            </div>
            <h1 className="font-heading text-2xl font-black text-white uppercase tracking-tight mb-1">
              Admin Login
            </h1>
            <p className="text-foreground/50 text-sm">
              Glorious Shooting Sports Academy
            </p>
          </div>

          {/* Login Card */}
          <div className="space-y-6">
            <div className="bg-navy-950/50 border border-gold-500/10 rounded-lg p-4 flex items-start gap-3">
              <Shield className="h-5 w-5 text-gold-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-white mb-1">Secure Authentication</p>
                <p className="text-xs text-foreground/50 leading-relaxed">
                  This portal is restricted to authorized academy administrators only. Login with your Internet Identity to access the dashboard.
                </p>
              </div>
            </div>

            {isLoginError && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive">
                Login failed. Please try again.
              </div>
            )}

            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold tracking-wide gap-2 h-12"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4" />
                  Login with Internet Identity
                </>
              )}
            </Button>

            <p className="text-center text-xs text-foreground/30">
              Only for Academy Students & Administrators
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
