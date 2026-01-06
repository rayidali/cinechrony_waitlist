'use client';

import { useState } from 'react';
import { Film, Users, Sparkles, Heart, ChevronDown, Check, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const FORM_ENDPOINT = 'https://app.loops.so/api/newsletter-form/cmk1swus4060d0i0fl3b686aj';

export default function WaitlistPage() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const formBody = `firstName=${encodeURIComponent(firstName)}&email=${encodeURIComponent(email)}&source=${encodeURIComponent(source)}&mailingLists=cmk23xm1l0ugo0i1pfwfi2y8l`;

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: formBody,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.status === 429) {
        setStatus('error');
        setErrorMessage('Too many signups, please try again in a bit');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Something went wrong');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <main className="h-screen font-body text-foreground flex flex-col overflow-hidden">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-12">
        <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">

          {/* Left Side - Content */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl">
            {/* Logo and Title */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src="https://i.postimg.cc/HkXDfKSb/cinechrony-ios-1024-nobg.png"
                alt="Cinechrony"
                className="h-14 w-14 lg:h-16 lg:w-16"
              />
              <h1 className="text-4xl lg:text-5xl font-headline font-bold tracking-tighter">
                Cinechrony
              </h1>
            </div>

            {/* Tagline */}
            <p className="text-base lg:text-lg text-muted-foreground mb-3 leading-relaxed">
              letterboxd if it smoked a joint and chilled out, was more social and didn&apos;t have film bros using it
            </p>
            <p className="text-sm text-muted-foreground mb-5">
              Create shared watchlists with friends and finally answer &quot;what should we watch?&quot;
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
              <FeaturePill icon={<Users className="h-3.5 w-3.5" />} text="Collaborative Lists" />
              <FeaturePill icon={<Film className="h-3.5 w-3.5" />} text="Movie & TV" />
              <FeaturePill icon={<Heart className="h-3.5 w-3.5" />} text="Social Features" />
            </div>

            {/* Waitlist Form */}
            <div className="w-full">
              <div className="bg-card border-[3px] border-border rounded-2xl p-5 shadow-[5px_5px_0px_0px] shadow-border">
                <h2 className="text-lg font-headline font-bold mb-1">
                  Join the Waitlist
                </h2>
                <p className="text-xs text-muted-foreground mb-4">
                  Be the first to know when we launch
                </p>

                {status === 'success' ? (
                  <div className="flex flex-col items-center py-4 gap-2">
                    <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                      <Check className="h-6 w-6 text-success" />
                    </div>
                    <p className="font-medium">You&apos;re on the list!</p>
                    <p className="text-sm text-muted-foreground">Check your email for next steps</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Email - Most important, on its own row */}
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-11 px-4 bg-input border-[2px] border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />

                    {/* First name and Source side by side */}
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="flex-1 h-11 px-4 bg-input border-[2px] border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />

                      <div className="relative flex-1">
                        <select
                          value={source}
                          onChange={(e) => setSource(e.target.value)}
                          required
                          className="w-full h-11 px-4 bg-input border-[2px] border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm appearance-none cursor-pointer"
                        >
                          <option value="" disabled>How&apos;d you find us?</option>
                          <option value="Internet Search">Internet Search</option>
                          <option value="TikTok">TikTok</option>
                          <option value="Instagram">Instagram</option>
                          <option value="Twitter/X">Twitter/X</option>
                          <option value="Friend">Friend</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>

                    {status === 'error' && (
                      <p className="text-sm text-destructive">{errorMessage}</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full h-11 bg-primary text-primary-foreground font-bold rounded-full border-[3px] border-border shadow-[4px_4px_0px_0px] shadow-border active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Please wait...
                        </>
                      ) : (
                        <>
                          Get Early Access
                          <Sparkles className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Phone Mockups - Both Fully Visible */}
          <div className="flex-1 hidden lg:flex justify-center items-center">
            <div className="flex items-end gap-6">
              {/* Left Phone - Lists Page */}
              <div className="relative">
                <div className="w-[200px] h-[420px] rounded-[32px] bg-card border-[3px] border-border shadow-[8px_8px_0px_0px] shadow-border overflow-hidden transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                  <img
                    src="https://i.postimg.cc/QxfLZ6y5/cinechrony-poster1-nobg.png"
                    alt="Cinechrony - Lists page"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 -left-3 h-5 w-5 rounded-full bg-primary border-2 border-border" />
              </div>

              {/* Right Phone - Inside List View */}
              <div className="relative">
                <div className="w-[200px] h-[420px] rounded-[32px] bg-card border-[3px] border-border shadow-[8px_8px_0px_0px] shadow-border overflow-hidden transform rotate-6 hover:rotate-0 transition-transform duration-300 -mb-8">
                  <img
                    src="https://i.postimg.cc/yx7Gw9hF/cinechrony-poster2-nobg.png"
                    alt="Cinechrony - Inside a watchlist"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Sparkles className="absolute -top-4 -right-2 h-6 w-6 text-primary animate-wiggle" />
                <div className="absolute -bottom-1 -right-3 h-4 w-4 rounded-full bg-success border-2 border-border" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary border-[2px] border-border rounded-full text-xs font-medium">
      {icon}
      <span>{text}</span>
    </div>
  );
}
