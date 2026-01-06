'use client';

import { Popcorn, Film, Users, Sparkles, Heart } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function WaitlistPage() {
  return (
    <main className="min-h-screen font-body text-foreground flex flex-col">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8 animate-slide-up">
          <div className="relative">
            <img
              src="https://i.postimg.cc/HkXDfKSb/cinechrony-ios-1024-nobg.png"
              alt="Cinechrony"
              className="h-28 w-28 mb-6 animate-float"
            />
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-primary animate-wiggle" />
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter text-center">
            Cinechrony
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-muted-foreground text-center mb-4 max-w-lg leading-relaxed animate-fade-in">
          letterboxd if it smoked a joint and chilled out, was more social and didn&apos;t have film bros using it
        </p>
        <p className="text-base text-muted-foreground text-center mb-10 max-w-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Create shared watchlists with friends and finally answer &quot;what should we watch?&quot;
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 max-w-md animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <FeaturePill icon={<Users className="h-4 w-4" />} text="Collaborative Lists" />
          <FeaturePill icon={<Film className="h-4 w-4" />} text="Movie & TV" />
          <FeaturePill icon={<Heart className="h-4 w-4" />} text="Social Features" />
        </div>

        {/* Waitlist Form Section */}
        <div className="w-full max-w-md animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="bg-card border-[3px] border-border rounded-2xl p-6 shadow-[6px_6px_0px_0px] shadow-border">
            <h2 className="text-xl font-headline font-bold text-center mb-2">
              Join the Waitlist
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Be the first to know when we launch!
            </p>

            {/* Form Placeholder - Replace with your form code */}
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="w-full h-12 px-4 bg-input border-[3px] border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="submit"
                className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-full border-[3px] border-border shadow-[4px_4px_0px_0px] shadow-border active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Get Early Access
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
            {/* End Form Placeholder */}

          </div>
        </div>

        {/* Social Proof / Counter */}
        <p className="mt-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.5s' }}>
          Join <span className="font-bold text-foreground">500+</span> movie lovers on the waitlist
        </p>
      </div>

      {/* Footer */}
      <footer className="pb-8 flex flex-col items-center gap-2">
        <Popcorn className="h-8 w-8 text-primary/50 animate-bounce-subtle" />
        <p className="text-xs text-muted-foreground">
          Made with love for movie nights
        </p>
      </footer>
    </main>
  );
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-secondary border-[2px] border-border rounded-full text-sm font-medium">
      {icon}
      <span>{text}</span>
    </div>
  );
}
