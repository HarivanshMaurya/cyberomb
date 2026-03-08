import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, User, Shield, KeyRound, Eye, EyeOff, Check, Loader2, Mail, Lock } from 'lucide-react';
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

  // Email OTP method
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpNewPassword, setOtpNewPassword] = useState('');
  const [otpConfirmPassword, setOtpConfirmPassword] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [changingOtp, setChangingOtp] = useState(false);
  const [showOtpPassword, setShowOtpPassword] = useState(false);

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
        toast.success('Password verified!');
        setVerified(true);
      }
    } catch {
      toast.error('Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleChangePasswordWithCurrent = async () => {
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

  // Method 2: Email OTP
  const handleSendOtp = async () => {
    if (!user?.email) return;
    setSendingOtp(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email: user.email });
      if (error) throw error;
      setOtpSent(true);
      toast.success(`Verification code sent to ${user.email}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send code');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!user?.email || !otpCode) return;
    setVerifyingOtp(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: user.email,
        token: otpCode,
        type: 'email',
      });
      if (error) throw error;
      setOtpVerified(true);
      toast.success('Code verified! You can now set a new password.');
    } catch (err: any) {
      toast.error('Invalid or expired code');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleChangePasswordWithOtp = async () => {
    if (otpNewPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (otpNewPassword !== otpConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setChangingOtp(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: otpNewPassword });
      if (error) throw error;
      toast.success('Password changed successfully!');
      setOtpNewPassword('');
      setOtpConfirmPassword('');
      setOtpCode('');
      setOtpSent(false);
      setOtpVerified(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setChangingOtp(false);
    }
  };

  const PasswordFields = ({
    pw, setPw, cpw, setCpw, show, setShow, onSubmit, loading, disabled,
  }: {
    pw: string; setPw: (v: string) => void;
    cpw: string; setCpw: (v: string) => void;
    show: boolean; setShow: (v: boolean) => void;
    onSubmit: () => void; loading: boolean; disabled: boolean;
  }) => {
    const score = passwordStrength(pw);
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>New Password</Label>
          <div className="relative">
            <Input
              type={show ? 'text' : 'password'}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Enter new password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {pw && (
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
            type={show ? 'text' : 'password'}
            value={cpw}
            onChange={(e) => setCpw(e.target.value)}
            placeholder="Confirm new password"
          />
          {cpw && pw && (
            <p className={`text-xs flex items-center gap-1 ${cpw === pw ? 'text-[#34A853]' : 'text-destructive'}`}>
              {cpw === pw ? (
                <><Check className="w-3 h-3" /> Passwords match</>
              ) : (
                'Passwords do not match'
              )}
            </p>
          )}
        </div>

        <Button onClick={onSubmit} disabled={disabled || loading || !pw || !cpw}>
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Changing...</>
          ) : (
            <><KeyRound className="mr-2 h-4 w-4" /> Change Password</>
          )}
        </Button>
      </div>
    );
  };

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
              Verify your identity before changing password. Use your current password or get a verification code on email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="current-password" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="current-password" className="gap-2">
                  <Lock className="h-4 w-4" /> Current Password
                </TabsTrigger>
                <TabsTrigger value="email-code" className="gap-2">
                  <Mail className="h-4 w-4" /> Email Code
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Current Password */}
              <TabsContent value="current-password" className="space-y-5">
                {!verified ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-pw">Enter Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-pw"
                          type={showPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Your current password"
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
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-[#34A853]/10 text-[#34A853] text-sm font-medium">
                      <Check className="h-4 w-4" /> Identity verified with current password
                    </div>
                    <PasswordFields
                      pw={newPassword} setPw={setNewPassword}
                      cpw={confirmPassword} setCpw={setConfirmPassword}
                      show={showPassword} setShow={setShowPassword}
                      onSubmit={handleChangePasswordWithCurrent}
                      loading={changing} disabled={false}
                    />
                  </div>
                )}
              </TabsContent>

              {/* Tab 2: Email Code */}
              <TabsContent value="email-code" className="space-y-5">
                {!otpVerified ? (
                  <div className="space-y-4">
                    {!otpSent ? (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          A verification code will be sent to <span className="font-medium text-foreground">{user?.email}</span>
                        </p>
                        <Button onClick={handleSendOtp} disabled={sendingOtp}>
                          {sendingOtp ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                          ) : (
                            <><Mail className="mr-2 h-4 w-4" /> Send Verification Code</>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                          <Mail className="h-4 w-4" /> Code sent to {user?.email}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="otp-code">Enter Verification Code</Label>
                          <Input
                            id="otp-code"
                            type="text"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="Enter the code from email"
                            maxLength={6}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleVerifyOtp} disabled={verifyingOtp || !otpCode}>
                            {verifyingOtp ? (
                              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
                            ) : (
                              <><Check className="mr-2 h-4 w-4" /> Verify Code</>
                            )}
                          </Button>
                          <Button variant="outline" onClick={handleSendOtp} disabled={sendingOtp}>
                            Resend Code
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-[#34A853]/10 text-[#34A853] text-sm font-medium">
                      <Check className="h-4 w-4" /> Identity verified with email code
                    </div>
                    <PasswordFields
                      pw={otpNewPassword} setPw={setOtpNewPassword}
                      cpw={otpConfirmPassword} setCpw={setOtpConfirmPassword}
                      show={showOtpPassword} setShow={setShowOtpPassword}
                      onSubmit={handleChangePasswordWithOtp}
                      loading={changingOtp} disabled={false}
                    />
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
