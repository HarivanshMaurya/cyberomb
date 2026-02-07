import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Image,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Newspaper,
  Globe,
  Search,
  Palette,
  Layers,
  Tags,
  LayoutGrid,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/hero', icon: Palette, label: 'Hero Section' },
  { to: '/admin/articles', icon: Newspaper, label: 'Articles' },
  { to: '/admin/categories', icon: Tags, label: 'Categories' },
  { to: '/admin/pages', icon: FileText, label: 'Pages' },
  { to: '/admin/page-sections', icon: Layers, label: 'Page Sections' },
  { to: '/admin/section-cards', icon: LayoutGrid, label: 'Section Cards' },
  { to: '/admin/sections', icon: Globe, label: 'Site Content' },
  { to: '/admin/media', icon: Image, label: 'Media Library' },
  { to: '/admin/seo', icon: Search, label: 'SEO Settings' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];
 
 export function AdminSidebar() {
   const { signOut, user } = useAuth();
   const location = useLocation();
   const [collapsed, setCollapsed] = useState(false);
 
   return (
     <aside
       className={cn(
         'flex flex-col h-screen bg-card border-r border-border transition-all duration-300',
         collapsed ? 'w-16' : 'w-64'
       )}
     >
       {/* Header */}
       <div className="flex items-center justify-between p-4 border-b border-border">
         {!collapsed && (
           <h1 className="text-xl font-bold text-primary">Admin CMS</h1>
         )}
         <Button
           variant="ghost"
           size="icon"
           onClick={() => setCollapsed(!collapsed)}
           className={cn(collapsed && 'mx-auto')}
         >
           {collapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
         </Button>
       </div>
 
       {/* Navigation */}
       <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
         {navItems.map((item) => {
           const isActive = item.end
             ? location.pathname === item.to
             : location.pathname.startsWith(item.to);
 
           return (
             <NavLink
               key={item.to}
               to={item.to}
               end={item.end}
               className={cn(
                 'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                 'hover:bg-muted/60',
                 isActive && 'bg-primary/10 text-primary font-medium'
               )}
             >
               <item.icon className="h-5 w-5 shrink-0" />
               {!collapsed && <span>{item.label}</span>}
             </NavLink>
           );
         })}
       </nav>
 
       {/* Footer */}
       <div className="p-3 border-t border-border space-y-2">
         {!collapsed && (
           <div className="px-3 py-2 text-sm text-muted-foreground truncate">
             {user?.email}
           </div>
         )}
         <Button
           variant="ghost"
           className={cn(
             'w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10',
             collapsed && 'justify-center'
           )}
           onClick={signOut}
         >
           <LogOut className="h-5 w-5 shrink-0" />
           {!collapsed && <span>Logout</span>}
         </Button>
       </div>
     </aside>
   );
 }