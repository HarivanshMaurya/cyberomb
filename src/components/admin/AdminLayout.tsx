 import { Outlet } from 'react-router-dom';
 import { AdminSidebar } from './AdminSidebar';
 
 export function AdminLayout() {
   return (
     <div className="flex min-h-screen w-full bg-background">
       <AdminSidebar />
       <main className="flex-1 overflow-y-auto">
         <div className="p-6 lg:p-8">
           <Outlet />
         </div>
       </main>
     </div>
   );
 }