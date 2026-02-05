 import { useAuth } from '@/contexts/AuthContext';
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { LogOut, User, Shield } from 'lucide-react';
 
 export default function Settings() {
   const { user, signOut } = useAuth();
 
   return (
     <div className="space-y-6">
       <div>
         <h1 className="text-3xl font-bold">Settings</h1>
         <p className="text-muted-foreground mt-1">
           Manage your account and preferences
         </p>
       </div>
 
       <div className="grid gap-6">
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