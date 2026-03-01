import { Link } from '@tanstack/react-router';
import { Target, Award, Users, Phone, MapPin, ChevronRight, Star, Shield, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Academy-Only Banner */}
      <div className="bg-gold-500 text-navy-950 text-center py-2 px-4">
        <p className="text-sm font-bold tracking-widest uppercase">
          🎯 Only for Academy Students — Exclusive Score Tracking Portal
        </p>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-navy-950">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/assets/generated/hero-banner.dim_1400x500.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 via-transparent to-navy-950" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <img
              src="/assets/generated/academy-logo-latest.dim_120x120.png"
              alt="Glorious Shooting Sports Academy"
              className="h-24 w-24 object-contain rounded-full"
              style={{ filter: 'drop-shadow(0 0 20px oklch(0.78 0.18 85))' }}
            />
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight leading-none mb-4">
            Glorious Shooting
            <span className="block text-gold-400">Sports Academy</span>
          </h1>
          <p className="text-foreground/70 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Vijayawada's premier shooting sports academy — developing champions through precision, discipline, and excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/scores">
              <Button size="lg" className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold tracking-wide gap-2 w-full sm:w-auto">
                <Target className="h-5 w-5" />
                View Scores
              </Button>
            </Link>
            <a href="tel:8121951021">
              <Button size="lg" variant="outline" className="border-gold-500/50 text-gold-400 hover:bg-gold-500/10 gap-2 w-full sm:w-auto">
                <Phone className="h-5 w-5" />
                8121951021
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Location & Contact Strip */}
      <section className="bg-navy-900 border-y border-gold-500/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-foreground/70">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold-400" />
              <span>Vijayawada, Andhra Pradesh, India</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gold-500/30" />
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gold-400" />
              <a href="tel:8121951021" className="hover:text-gold-400 transition-colors font-medium">
                8121951021
              </a>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gold-500/30" />
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-gold-400 fill-gold-400" />
              <span>Excellence in Shooting Sports</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-3">
              Why Choose <span className="text-gold-400">Us</span>
            </h2>
            <p className="text-foreground/60 max-w-xl mx-auto">
              We provide world-class training facilities and expert coaching to help you reach your full potential.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Crosshair className="h-8 w-8 text-gold-400" />,
                title: 'Expert Coaching',
                desc: 'Learn from experienced coaches with national-level competition backgrounds in rifle and pistol disciplines.',
              },
              {
                icon: <Shield className="h-8 w-8 text-gold-400" />,
                title: 'Safety First',
                desc: 'Rigorous safety protocols and certified range facilities ensure a secure training environment for all students.',
              },
              {
                icon: <Award className="h-8 w-8 text-gold-400" />,
                title: 'Proven Results',
                desc: 'Our students consistently achieve top rankings in district, state, and national shooting competitions.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-navy-900 border border-gold-500/20 rounded-lg p-6 hover:border-gold-500/50 transition-colors"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="font-heading font-bold text-white text-lg uppercase tracking-wide mb-2">
                  {feature.title}
                </h3>
                <p className="text-foreground/60 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Programs */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-3">
              Training <span className="text-gold-400">Programs</span>
            </h2>
            <p className="text-foreground/60 max-w-xl mx-auto">
              Structured programs for all skill levels — from beginners to competitive shooters.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                discipline: 'Rifle',
                levels: ['Beginner', 'Intermediate', 'Advanced', 'Competitive'],
                desc: 'Air rifle and small-bore rifle training with focus on stance, breathing, and trigger control.',
              },
              {
                discipline: 'Pistol',
                levels: ['Beginner', 'Intermediate', 'Advanced', 'Competitive'],
                desc: 'Air pistol and free pistol training emphasizing grip, sight alignment, and mental focus.',
              },
            ].map((program) => (
              <div
                key={program.discipline}
                className="bg-navy-950 border border-gold-500/20 rounded-lg p-6 hover:border-gold-500/40 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-6 w-6 text-gold-400" />
                  <h3 className="font-heading font-bold text-white text-xl uppercase tracking-wide">
                    {program.discipline}
                  </h3>
                </div>
                <p className="text-foreground/60 text-sm mb-4 leading-relaxed">{program.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {program.levels.map((level) => (
                    <span
                      key={level}
                      className="text-xs bg-gold-500/10 text-gold-400 border border-gold-500/30 rounded px-2 py-1 font-medium uppercase tracking-wide"
                    >
                      {level}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-950">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Users className="h-12 w-12 text-gold-400 mx-auto mb-6" />
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-4">
            Track Your <span className="text-gold-400">Progress</span>
          </h2>
          <p className="text-foreground/60 mb-8 leading-relaxed">
            Academy students can view their scores and track their improvement over time on our dedicated scores page.
          </p>
          <Link to="/scores">
            <Button size="lg" className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold tracking-wide gap-2">
              View All Scores
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
