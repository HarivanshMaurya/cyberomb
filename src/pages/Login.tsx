import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, LogIn, UserPlus, KeyRound, ArrowLeft, Mail, Lock, Eye, EyeOff, CheckCircle2, Sparkles, Shield, Fingerprint } from 'lucide-react';
import { lovable } from '@/integrations/lovable/index';

type ViewMode = 'signin' | 'signup' | 'forgot' | 'forgot-sent';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState<ViewMode>('signin');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { signIn, signUp, user, isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fromAdmin = location.state?.from?.pathname?.startsWith('/admin');

  useEffect(() => {
    if (user && !authLoading) {
      const timer = setTimeout(() => {
        navigate(isAdmin ? '/admin' : '/', { replace: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Welcome back!');
    }
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    const { error } = await signUp(email, password, fullName);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Account created! Check your email to verify.');
      setView('signin');
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
    } else {
      setView('forgot-sent');
    }
    setIsLoading(false);
  };

  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.redirected) {
        // User is being redirected to Google, don't reset loading
        return;
      }
      if (result.error) {
        console.error('Google sign in error:', result.error);
        toast.error('Google sign in failed: ' + (result.error.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Google sign in exception:', err);
      toast.error('Google sign in failed. Please try again.');
    }
    setGoogleLoading(false);
  };

  const handleAppleSignIn = async () => {
    setAppleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("apple", {
        redirect_uri: window.location.origin,
      });
      if (result.redirected) {
        // User is being redirected to Apple, don't reset loading
        return;
      }
      if (result.error) {
        console.error('Apple sign in error:', result.error);
        toast.error('Apple sign in failed: ' + (result.error.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Apple sign in exception:', err);
      toast.error('Apple sign in failed. Please try again.');
    }
    setAppleLoading(false);
  };

  const passwordStrength = (() => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const strengthLabel = passwordStrength <= 1 ? 'Weak' : passwordStrength <= 3 ? 'Good' : 'Strong';
  const strengthColor = passwordStrength <= 1 ? 'bg-destructive' : passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-accent';

  if (user && !authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-[460px]">
          {/* Ambient glow */}
          <div className="relative">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/[0.03] rounded-full blur-[100px] pointer-events-none" />

            {/* Main card */}
            <div className="relative rounded-3xl border border-border/40 bg-card/80 backdrop-blur-xl shadow-2xl shadow-primary/[0.04] overflow-hidden">
              
              {/* Gradient accent line */}
              <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {/* Header */}
              <div className="px-8 pt-8 pb-4 text-center">
                {view === 'signin' && (
                  <>
                    <div className="mx-auto mb-5 relative w-16 h-16">
                      <div className="absolute inset-0 rounded-2xl bg-primary/5 rotate-6" />
                      <div className="relative h-full rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Fingerprint className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h1 className="text-[1.75rem] font-serif font-bold tracking-tight text-foreground">Welcome Back</h1>
                    <p className="text-sm text-muted-foreground mt-1.5">
                      {fromAdmin ? 'Admin access requires authentication' : 'Sign in to continue your journey'}
                    </p>
                  </>
                )}
                {view === 'signup' && (
                  <>
                    <div className="mx-auto mb-5 relative w-16 h-16">
                      <div className="absolute inset-0 rounded-2xl bg-accent/5 rotate-6" />
                      <div className="relative h-full rounded-2xl bg-accent/10 flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-accent" />
                      </div>
                    </div>
                    <h1 className="text-[1.75rem] font-serif font-bold tracking-tight text-foreground">Join Us</h1>
                    <p className="text-sm text-muted-foreground mt-1.5">Create your account in seconds</p>
                  </>
                )}
                {view === 'forgot' && (
                  <>
                    <div className="mx-auto mb-5 relative w-16 h-16">
                      <div className="absolute inset-0 rounded-2xl bg-secondary/10 rotate-6" />
                      <div className="relative h-full rounded-2xl bg-secondary/15 flex items-center justify-center">
                        <Shield className="h-8 w-8 text-secondary-foreground" />
                      </div>
                    </div>
                    <h1 className="text-[1.75rem] font-serif font-bold tracking-tight text-foreground">Recover Access</h1>
                    <p className="text-sm text-muted-foreground mt-1.5">We'll send a secure reset link to your email</p>
                  </>
                )}
                {view === 'forgot-sent' && (
                  <>
                    <div className="mx-auto mb-5 relative w-16 h-16">
                      <div className="absolute inset-0 rounded-2xl bg-accent/5 rotate-6 animate-pulse" />
                      <div className="relative h-full rounded-2xl bg-accent/10 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-accent" />
                      </div>
                    </div>
                    <h1 className="text-[1.75rem] font-serif font-bold tracking-tight text-foreground">Check Your Inbox</h1>
                    <p className="text-sm text-muted-foreground mt-1.5">A reset link has been sent</p>
                  </>
                )}
              </div>

              {/* Divider */}
              <div className="mx-8 h-px bg-border/50" />

              {/* Form area */}
              <div className="px-8 py-6">

                {/* Sign In */}
                {view === 'signin' && (
                  <form onSubmit={handleSignIn} className="space-y-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Email Address
                      </Label>
                      <div className={`relative rounded-xl border transition-all duration-200 ${focusedField === 'email' ? 'border-primary/50 ring-2 ring-primary/10' : 'border-border/60'}`}>
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="pl-10 h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Password
                        </Label>
                        <button
                          type="button"
                          onClick={() => setView('forgot')}
                          className="text-xs text-primary/70 hover:text-primary font-medium transition-colors"
                        >
                          Forgot?
                        </button>
                      </div>
                      <div className={`relative rounded-xl border transition-all duration-200 ${focusedField === 'password' ? 'border-primary/50 ring-2 ring-primary/10' : 'border-border/60'}`}>
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                          required
                          minLength={6}
                          className="pl-10 pr-10 h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl gap-2.5 text-sm font-semibold tracking-wide shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/15 transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                      {isLoading ? 'Authenticating...' : 'Sign In'}
                    </Button>

                    {/* Divider */}
                    <div className="relative my-1">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/40" /></div>
                      <div className="relative flex justify-center"><span className="bg-card px-3 text-[11px] uppercase tracking-widest text-muted-foreground/50 font-semibold">or</span></div>
                    </div>

                    {/* Google */}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 rounded-xl gap-3 text-sm font-medium border-border/60 hover:bg-muted/30 transition-all"
                      onClick={handleGoogleSignIn}
                      disabled={googleLoading}
                    >
                      {googleLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      )}
                      Continue with Google
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 rounded-xl gap-3 text-sm font-medium border-border/60 hover:bg-muted/30 transition-all"
                      onClick={handleAppleSignIn}
                      disabled={appleLoading}
                    >
                      {appleLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                        </svg>
                      )}
                      Continue with Apple
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      New here?{' '}
                      <button type="button" onClick={() => { setView('signup'); setPassword(''); }} className="text-primary font-semibold hover:underline underline-offset-4">
                        Create Account
                      </button>
                    </p>
                  </form>
                )}

                {/* Sign Up */}
                {view === 'signup' && (
                  <form onSubmit={handleSignUp} className="space-y-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Full Name
                      </Label>
                      <div className={`relative rounded-xl border transition-all duration-200 ${focusedField === 'name' ? 'border-primary/50 ring-2 ring-primary/10' : 'border-border/60'}`}>
                        <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="Your full name"
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          onFocus={() => setFocusedField('name')}
                          onBlur={() => setFocusedField(null)}
                          className="pl-10 h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signupEmail" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Email Address
                      </Label>
                      <div className={`relative rounded-xl border transition-all duration-200 ${focusedField === 'signupEmail' ? 'border-primary/50 ring-2 ring-primary/10' : 'border-border/60'}`}>
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <Input
                          id="signupEmail"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          onFocus={() => setFocusedField('signupEmail')}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="pl-10 h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signupPassword" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Password
                      </Label>
                      <div className={`relative rounded-xl border transition-all duration-200 ${focusedField === 'signupPassword' ? 'border-primary/50 ring-2 ring-primary/10' : 'border-border/60'}`}>
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <Input
                          id="signupPassword"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min 6 characters"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          onFocus={() => setFocusedField('signupPassword')}
                          onBlur={() => setFocusedField(null)}
                          required
                          minLength={6}
                          className="pl-10 pr-10 h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {password.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(i => (
                              <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                  passwordStrength >= i ? strengthColor : 'bg-muted'
                                }`}
                              />
                            ))}
                          </div>
                          <p className={`text-[11px] font-medium ${passwordStrength <= 1 ? 'text-destructive' : passwordStrength <= 3 ? 'text-yellow-600' : 'text-accent'}`}>
                            {strengthLabel} password
                          </p>
                        </div>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl gap-2.5 text-sm font-semibold tracking-wide shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/15 transition-all duration-300"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      {isLoading ? 'Creating Account...' : 'Get Started'}
                    </Button>

                    {/* Divider */}
                    <div className="relative my-1">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/40" /></div>
                      <div className="relative flex justify-center"><span className="bg-card px-3 text-[11px] uppercase tracking-widest text-muted-foreground/50 font-semibold">or</span></div>
                    </div>

                    {/* Google */}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 rounded-xl gap-3 text-sm font-medium border-border/60 hover:bg-muted/30 transition-all"
                      onClick={handleGoogleSignIn}
                      disabled={googleLoading}
                    >
                      {googleLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      )}
                      Continue with Google
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 rounded-xl gap-3 text-sm font-medium border-border/60 hover:bg-muted/30 transition-all"
                      onClick={handleAppleSignIn}
                      disabled={appleLoading}
                    >
                      {appleLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                        </svg>
                      )}
                      Continue with Apple
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      Already a member?{' '}
                      <button type="button" onClick={() => { setView('signin'); setPassword(''); }} className="text-primary font-semibold hover:underline underline-offset-4">
                        Sign In
                      </button>
                    </p>
                  </form>
                )}

                {/* Forgot Password */}
                {view === 'forgot' && (
                  <form onSubmit={handleForgotPassword} className="space-y-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="resetEmail" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Registered Email
                      </Label>
                      <div className={`relative rounded-xl border transition-all duration-200 ${focusedField === 'resetEmail' ? 'border-primary/50 ring-2 ring-primary/10' : 'border-border/60'}`}>
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <Input
                          id="resetEmail"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          onFocus={() => setFocusedField('resetEmail')}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="pl-10 h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
                        A secure password reset link will be sent to this address if the account exists.
                      </p>
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl gap-2.5 text-sm font-semibold tracking-wide shadow-lg shadow-primary/10"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                      {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                    <button
                      type="button"
                      onClick={() => setView('signin')}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto group"
                    >
                      <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" /> Back to sign in
                    </button>
                  </form>
                )}

                {/* Forgot Sent */}
                {view === 'forgot-sent' && (
                  <div className="space-y-5 text-center">
                    <div className="bg-muted/20 rounded-2xl p-6 space-y-3 border border-border/30">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto">
                        <Mail className="h-6 w-6 text-accent" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">{email}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        If this email is registered, you'll receive a secure reset link shortly. Check both inbox and spam.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full h-11 rounded-xl"
                        onClick={() => setView('forgot')}
                      >
                        Didn't receive? Try again
                      </Button>
                      <button
                        type="button"
                        onClick={() => setView('signin')}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto group"
                      >
                        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" /> Back to sign in
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-8 pb-6">
                <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground/50">
                  <Shield className="h-3 w-3" />
                  <span>Secured with end-to-end encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
