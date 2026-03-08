import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, User, Shield, KeyRound, Eye, EyeOff, Check, Loader2, Mail, Lock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { user, signOut } = useAuth();

  // Current password method
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [changing, setChanging] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Email reset method
  const [resetSent, setResetSent] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  const passwordStrength = (pw: string) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strengthLabel = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['bg-destructive', 'bg-orange-500', 'bg-yellow-500', 'bg-[#34A853]'];

  // Method 1: Verify current password
  const handleVerifyCurrentPassword = async () => {
    if (!currentPassword || !user?.email) return;
    setVerifying(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (error) {
        toast.error('Current password is incorrect');
        setVerified(false);
      } else {
        toast.success('Password verified successfully!');
        setVerified(true);
      }
    } catch {
      toast.error('Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setChanging(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Password changed successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
      setVerified(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setChanging(false);
    }
  };

  // Method 2: Send password reset email
  const handleSendResetEmail = async () => {
    if (!user?.email) return;
    setSendingReset(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setResetSent(true);
      toast.success(`Password reset link sent to ${user.email}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset email');
    } finally {
      setSendingReset(false);
    }
  };

  const score = passwordStrength(newPassword);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Account Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <CardTitle>Account</CardTitle>
            </div>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{user?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">User ID</p>
              <p className="text-sm font-mono text-muted-foreground">{user?.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Change Password - Secure */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              <CardTitle>Change Password</CardTitle>
            </div>
            <CardDescription>
              Verify your identity before changing password. Use your current password or get a reset link via email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="current-password" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="current-password" className="gap-2">
                  <Lock className="h-4 w-4" /> Current Password
                </TabsTrigger>
                <TabsTrigger value="email-reset" className="gap-2">
                  <Mail className="h-4 w-4" /> Reset via Email
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Current Password */}
              <TabsContent value="current-password" className="space-y-5">
                {!verified ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Enter your current password to verify your identity.
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="current-pw">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-pw"
                          type={showPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Your current password"
                          className="pr-10"
                          onKeyDown={(e) => e.key === 'Enter' && handleVerifyCurrentPassword()}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <Button onClick={handleVerifyCurrentPassword} disabled={verifying || !currentPassword}>
                      {verifying ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
                      ) : (
                        <><Shield className="mr-2 h-4 w-4" /> Verify Password</>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-[#34A853]/10 text-[#34A853] text-sm font-medium">
                      <Check className="h-4 w-4" /> Identity verified — set your new password below
                    </div>

                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {newPassword && (
                        <div className="space-y-1.5">
                          <div className="flex gap-1">
                            {[0, 1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition-colors ${
                                  i < score ? strengthColor[score - 1] : 'bg-muted'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Strength: {score > 0 ? strengthLabel[score - 1] : 'Too short'}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Confirm Password</Label>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                      {confirmPassword && newPassword && (
                        <p className={`text-xs flex items-center gap-1 ${confirmPassword === newPassword ? 'text-[#34A853]' : 'text-destructive'}`}>
                          {confirmPassword === newPassword ? (
                            <><Check className="w-3 h-3" /> Passwords match</>
                          ) : (
                            'Passwords do not match'
                          )}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleChangePassword} disabled={changing || !newPassword || !confirmPassword}>
                        {changing ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Changing...</>
                        ) : (
                          <><KeyRound className="mr-2 h-4 w-4" /> Change Password</>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setVerified(false);
                          setCurrentPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Tab 2: Email Reset */}
              <TabsContent value="email-reset" className="space-y-5">
                {!resetSent ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      If you don't remember your current password, we'll send a secure password reset link to your email.
                    </p>
                    <div className="p-3 rounded-lg bg-muted/50 text-sm">
                      <span className="text-muted-foreground">Reset link will be sent to: </span>
                      <span className="font-medium">{user?.email}</span>
                    </div>
                    <Button onClick={handleSendResetEmail} disabled={sendingReset}>
                      {sendingReset ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                      ) : (
                        <><Mail className="mr-2 h-4 w-4" /> Send Reset Link</>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-[#34A853]/10 text-[#34A853] text-sm font-medium">
                      <Check className="h-4 w-4" /> Reset link sent to {user?.email}
                    </div>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>📧 Check your email inbox (and spam folder)</p>
                      <p>🔗 Click the reset link in the email</p>
                      <p>🔒 You'll be redirected to set a new password</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setResetSent(false);
                      }}
                      className="gap-2"
                    >
                      <Mail className="h-4 w-4" /> Send Again
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage your session</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
