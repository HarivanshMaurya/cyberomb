import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user arrived via recovery link
    const handleRecovery = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Check URL hash for recovery type
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace('#', ''));
      const type = params.get('type');
      
      if (session || type === 'recovery') {
        setIsValidSession(true);
      }
      setChecking(false);
    };

    // Listen for auth events (recovery token exchange)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true);
        setChecking(false);
      }
    });

    handleRecovery();
    return () => subscription.unsubscribe();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
    } else {
      setIsSuccess(true);
      toast.success('Password updated successfully!');
    }
    setIsLoading(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center px-4 py-16 md:py-24">
        <div className="w-full max-w-md relative">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />

          <Card className="relative border-border/50 shadow-xl">
            <CardHeader className="text-center pb-2">
              {isSuccess ? (
                <>
                  <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center animate-scale-in">
                    <CheckCircle2 className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-serif">Password Updated!</CardTitle>
                  <CardDescription>Your password has been changed successfully</CardDescription>
                </>
              ) : !isValidSession ? (
                <>
                  <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
                    <ShieldCheck className="h-7 w-7 text-destructive" />
                  </div>
                  <CardTitle className="text-2xl font-serif">Invalid Link</CardTitle>
                  <CardDescription>This reset link is invalid or has expired</CardDescription>
                </>
              ) : (
                <>
                  <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Lock className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-serif">Set New Password</CardTitle>
                  <CardDescription>Choose a strong password for your account</CardDescription>
                </>
              )}
            </CardHeader>

            <CardContent className="pt-4">
              {isSuccess ? (
                <div className="space-y-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    You can now sign in with your new password.
                  </p>
                  <Button className="w-full h-11" onClick={() => navigate('/login')}>
                    Go to Sign In
                  </Button>
                </div>
              ) : !isValidSession ? (
                <div className="space-y-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Please request a new password reset link from the login page.
                  </p>
                  <Button className="w-full h-11" onClick={() => navigate('/login')}>
                    Back to Login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newPassword"
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
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        className="pl-10"
                      />
                    </div>
                    {confirmPassword.length > 0 && password !== confirmPassword && (
                      <p className="text-xs text-destructive">Passwords do not match</p>
                    )}
                    {confirmPassword.length > 0 && password === confirmPassword && (
                      <p className="text-xs text-primary flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Passwords match
                      </p>
                    )}
                  </div>

                  {/* Password requirements */}
                  <div className="bg-muted/30 rounded-lg p-3 space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">Password requirements:</p>
                    {[
                      { check: password.length >= 6, text: 'At least 6 characters' },
                      { check: /[A-Z]/.test(password), text: 'One uppercase letter' },
                      { check: /[0-9]/.test(password), text: 'One number' },
                      { check: password === confirmPassword && confirmPassword.length > 0, text: 'Passwords match' },
                    ].map((req, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className={`h-3 w-3 ${req.check ? 'text-primary' : 'text-muted-foreground/40'}`} />
                        <span className={req.check ? 'text-foreground' : 'text-muted-foreground'}>{req.text}</span>
                      </div>
                    ))}
                  </div>

                  <Button type="submit" className="w-full h-11 gap-2" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
