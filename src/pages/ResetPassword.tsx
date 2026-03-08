import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, ShieldAlert, ArrowRight, Check, X } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [checking, setChecking] = useState(true);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleRecovery = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace('#', ''));
      const type = params.get('type');
      if (session || type === 'recovery') {
        setIsValidSession(true);
      }
      setChecking(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true);
        setChecking(false);
      }
    });

    handleRecovery();
    return () => subscription.unsubscribe();
  }, []);

  const requirements = [
    { check: password.length >= 6, text: 'At least 6 characters' },
    { check: /[A-Z]/.test(password), text: 'One uppercase letter' },
    { check: /[a-z]/.test(password), text: 'One lowercase letter' },
    { check: /[0-9]/.test(password), text: 'One number' },
    { check: /[^A-Za-z0-9]/.test(password), text: 'One special character' },
  ];

  const passedCount = requirements.filter(r => r.check).length;
  const allPassed = passedCount === requirements.length;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allPassed) {
      toast.error('Please meet all password requirements');
      return;
    }
    if (!passwordsMatch) {
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
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <div className="animate-spin h-7 w-7 border-[3px] border-primary border-t-transparent rounded-full" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">Verifying Reset Link</p>
            <p className="text-sm text-muted-foreground mt-1">Please wait while we validate your request...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-[460px]">
          <div className="relative">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/[0.03] rounded-full blur-[100px] pointer-events-none" />

            <div className="relative rounded-3xl border border-border/40 bg-card/80 backdrop-blur-xl shadow-2xl shadow-primary/[0.04] overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {/* Header */}
              <div className="px-8 pt-8 pb-4 text-center">
                {isSuccess ? (
                  <>
                    <div className="mx-auto mb-5 relative w-16 h-16">
                      <div className="absolute inset-0 rounded-2xl bg-accent/10 rotate-6 animate-pulse" />
                      <div className="relative h-full rounded-2xl bg-accent/15 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-accent" />
                      </div>
                    </div>
                    <h1 className="text-[1.75rem] font-semibold tracking-tight text-foreground">Password Updated</h1>
                    <p className="text-sm text-muted-foreground mt-1.5">Your account is now secured with the new password</p>
                  </>
                ) : !isValidSession ? (
                  <>
                    <div className="mx-auto mb-5 relative w-16 h-16">
                      <div className="absolute inset-0 rounded-2xl bg-destructive/5 rotate-6" />
                      <div className="relative h-full rounded-2xl bg-destructive/10 flex items-center justify-center">
                        <ShieldAlert className="h-8 w-8 text-destructive" />
                      </div>
                    </div>
                    <h1 className="text-[1.75rem] font-semibold tracking-tight text-foreground">Link Expired</h1>
                    <p className="text-sm text-muted-foreground mt-1.5">This reset link is no longer valid</p>
                  </>
                ) : (
                  <>
                    <div className="mx-auto mb-5 relative w-16 h-16">
                      <div className="absolute inset-0 rounded-2xl bg-primary/5 rotate-6" />
                      <div className="relative h-full rounded-2xl bg-primary/10 flex items-center justify-center">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h1 className="text-[1.75rem] font-serif font-bold tracking-tight text-foreground">New Password</h1>
                    <p className="text-sm text-muted-foreground mt-1.5">Create a strong and unique password</p>
                  </>
                )}
              </div>

              <div className="mx-8 h-px bg-border/50" />

              <div className="px-8 py-6">
                {isSuccess ? (
                  <div className="space-y-5 text-center">
                    <div className="bg-accent/5 rounded-2xl p-5 border border-accent/10">
                      <p className="text-sm text-muted-foreground">
                        You can now sign in using your new password. All active sessions have been updated.
                      </p>
                    </div>
                    <Button
                      className="w-full h-12 rounded-xl gap-2.5 text-sm font-semibold tracking-wide shadow-lg shadow-primary/10"
                      onClick={() => navigate('/login')}
                    >
                      Continue to Sign In
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ) : !isValidSession ? (
                  <div className="space-y-5 text-center">
                    <div className="bg-destructive/5 rounded-2xl p-5 border border-destructive/10">
                      <p className="text-sm text-muted-foreground">
                        Reset links expire after use or after a set time. Please request a new one from the login page.
                      </p>
                    </div>
                    <Button
                      className="w-full h-12 rounded-xl gap-2.5 text-sm font-semibold tracking-wide shadow-lg shadow-primary/10"
                      onClick={() => navigate('/login')}
                    >
                      Back to Login
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="newPassword" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        New Password
                      </Label>
                      <div className={`relative rounded-xl border transition-all duration-200 ${focusedField === 'new' ? 'border-primary/50 ring-2 ring-primary/10' : 'border-border/60'}`}>
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <Input
                          id="newPassword"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create new password"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          onFocus={() => setFocusedField('new')}
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

                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Confirm Password
                      </Label>
                      <div className={`relative rounded-xl border transition-all duration-200 ${focusedField === 'confirm' ? 'border-primary/50 ring-2 ring-primary/10' : 'border-border/60'}`}>
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                        <Input
                          id="confirmPassword"
                          type={showConfirm ? 'text' : 'password'}
                          placeholder="Re-enter password"
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          onFocus={() => setFocusedField('confirm')}
                          onBlur={() => setFocusedField(null)}
                          required
                          minLength={6}
                          className="pl-10 pr-10 h-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
                        >
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {confirmPassword.length > 0 && (
                        <p className={`text-[11px] font-medium flex items-center gap-1 ${passwordsMatch ? 'text-accent' : 'text-destructive'}`}>
                          {passwordsMatch ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                          {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                        </p>
                      )}
                    </div>

                    {/* Requirements */}
                    {password.length > 0 && (
                      <div className="rounded-2xl border border-border/30 bg-muted/10 p-4 space-y-2">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Security Check</p>
                          <span className="text-[11px] font-semibold text-muted-foreground">{passedCount}/{requirements.length}</span>
                        </div>
                        {/* Progress */}
                        <div className="flex gap-1 mb-2">
                          {requirements.map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                i < passedCount
                                  ? passedCount <= 2 ? 'bg-destructive' : passedCount <= 4 ? 'bg-yellow-500' : 'bg-accent'
                                  : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                        {requirements.map((req, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            <div className={`h-4 w-4 rounded-full flex items-center justify-center transition-all duration-200 ${
                              req.check ? 'bg-accent/15' : 'bg-muted/50'
                            }`}>
                              {req.check 
                                ? <Check className="h-2.5 w-2.5 text-accent" />
                                : <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                              }
                            </div>
                            <span className={`text-xs transition-colors ${req.check ? 'text-foreground' : 'text-muted-foreground/60'}`}>
                              {req.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl gap-2.5 text-sm font-semibold tracking-wide shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/15 transition-all duration-300"
                      disabled={isLoading || !allPassed || !passwordsMatch}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </form>
                )}
              </div>

              <div className="px-8 pb-6">
                <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground/50">
                  <Lock className="h-3 w-3" />
                  <span>Your password is encrypted and secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
