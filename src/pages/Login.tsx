import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, LogIn, UserPlus, KeyRound, ArrowLeft, Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

type ViewMode = 'signin' | 'signup' | 'forgot' | 'forgot-sent';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState<ViewMode>('signin');
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
      <div className="flex items-center justify-center px-4 py-16 md:py-24">
        <div className="w-full max-w-md">
          {/* Decorative background */}
          <div className="relative">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />

            <Card className="relative border-border/50 shadow-xl backdrop-blur-sm">
              <CardHeader className="text-center pb-2">
                {view === 'signin' && (
                  <>
                    <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <LogIn className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-serif">Welcome Back</CardTitle>
                    <CardDescription>
                      {fromAdmin ? 'Sign in to access admin dashboard' : 'Sign in to your account'}
                    </CardDescription>
                  </>
                )}
                {view === 'signup' && (
                  <>
                    <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <UserPlus className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-serif">Create Account</CardTitle>
                    <CardDescription>Join our community today</CardDescription>
                  </>
                )}
                {view === 'forgot' && (
                  <>
                    <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <KeyRound className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-serif">Reset Password</CardTitle>
                    <CardDescription>Enter your email to receive a reset link</CardDescription>
                  </>
                )}
                {view === 'forgot-sent' && (
                  <>
                    <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center animate-scale-in">
                      <CheckCircle2 className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-serif">Check Your Email</CardTitle>
                    <CardDescription>We've sent a password reset link to your email</CardDescription>
                  </>
                )}
              </CardHeader>

              <CardContent className="pt-4">
                {/* Sign In Form */}
                {view === 'signin' && (
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm">Password</Label>
                        <button
                          type="button"
                          onClick={() => setView('forgot')}
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          required
                          minLength={6}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-11 gap-2" disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                    <div className="text-center text-sm">
                      <span className="text-muted-foreground">Don't have an account? </span>
                      <button type="button" onClick={() => setView('signup')} className="text-primary hover:underline font-medium">
                        Create one
                      </button>
                    </div>
                  </form>
                )}

                {/* Sign Up Form */}
                {view === 'signup' && (
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Your name"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupEmail" className="text-sm">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signupEmail"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signupPassword" className="text-sm">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signupPassword"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Min 6 characters"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          required
                          minLength={6}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {password.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4].map(i => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                password.length >= i * 3
                                  ? password.length >= 10 ? 'bg-primary' : password.length >= 6 ? 'bg-yellow-500' : 'bg-destructive'
                                  : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <Button type="submit" className="w-full h-11 gap-2" disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                      {isLoading ? 'Creating account...' : 'Create Account'}
                    </Button>
                    <div className="text-center text-sm">
                      <span className="text-muted-foreground">Already have an account? </span>
                      <button type="button" onClick={() => setView('signin')} className="text-primary hover:underline font-medium">
                        Sign in
                      </button>
                    </div>
                  </form>
                )}

                {/* Forgot Password Form */}
                {view === 'forgot' && (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="resetEmail" className="text-sm">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="resetEmail"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">We'll send a password reset link to this email if an account exists.</p>
                    </div>
                    <Button type="submit" className="w-full h-11 gap-2" disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
                      {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                    <button
                      type="button"
                      onClick={() => setView('signin')}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
                    >
                      <ArrowLeft className="h-3 w-3" /> Back to sign in
                    </button>
                  </form>
                )}

                {/* Forgot Password Sent Confirmation */}
                {view === 'forgot-sent' && (
                  <div className="space-y-4 text-center">
                    <div className="bg-muted/30 rounded-xl p-6 space-y-3">
                      <Mail className="h-10 w-10 text-primary mx-auto" />
                      <p className="text-sm font-medium">{email}</p>
                      <p className="text-sm text-muted-foreground">
                        If this email is registered, you'll receive a password reset link shortly. Check your inbox and spam folder.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => { setView('forgot'); }}
                      >
                        Didn't receive? Try again
                      </Button>
                      <button
                        type="button"
                        onClick={() => setView('signin')}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mx-auto"
                      >
                        <ArrowLeft className="h-3 w-3" /> Back to sign in
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
