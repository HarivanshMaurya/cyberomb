 import { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { useAuth } from '@/contexts/AuthContext';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { toast } from '@/hooks/use-toast';
 import { Loader2, Lock } from 'lucide-react';
 
 export default function AdminLogin() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp } = useAuth();
   const navigate = useNavigate();
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsLoading(true);
 
    if (isSignUp) {
      const { error } = await signUp(email, password);
      
      if (error) {
        toast({
          title: 'Sign Up Failed',
          description: error.message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
 
       toast({
        title: 'Account Created!',
        description: 'Please check your email to verify your account, then sign in.',
       });
       setIsLoading(false);
      setIsSignUp(false);
    } else {
      const { error } = await signIn(email, password);

      if (error) {
        toast({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: 'Welcome back!',
        description: 'Redirecting to dashboard...',
      });

      navigate('/admin');
     }
   };
 
   return (
     <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
       <Card className="w-full max-w-md">
         <CardHeader className="text-center">
           <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
             <Lock className="h-6 w-6 text-primary" />
           </div>
          <CardTitle className="text-2xl">{isSignUp ? 'Create Admin Account' : 'Admin Login'}</CardTitle>
           <CardDescription>
            {isSignUp ? 'Create your admin account to get started' : 'Enter your credentials to access the dashboard'}
           </CardDescription>
         </CardHeader>
         <CardContent>
           <form onSubmit={handleSubmit} className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="email">Email</Label>
               <Input
                 id="email"
                 type="email"
                 placeholder="admin@example.com"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="password">Password</Label>
               <Input
                 id="password"
                 type="password"
                 placeholder="••••••••"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
               />
             </div>
             <Button type="submit" className="w-full" disabled={isLoading}>
               {isLoading ? (
                 <>
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                 </>
               ) : (
                isSignUp ? 'Create Account' : 'Sign In'
               )}
             </Button>
           </form>
          <div className="mt-4 text-center text-sm">
            {isSignUp ? (
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-primary hover:underline font-medium"
                >
                  Create one
                </button>
              </p>
            )}
          </div>
         </CardContent>
       </Card>
     </div>
   );
 }